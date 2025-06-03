import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const LandingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [iframeUrl, setIframeUrl] = useState("");

  useEffect(() => {
    document.title =
      "Memor'us | Where teams turn moments into collectible memories";

    // Remove any padding/margin from body when landing page is active
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.overflow = "hidden";

    // Dynamic URL mapping based on current path
    const getIframeUrl = () => {
      const currentPath = location.pathname;
      const currentSearch = location.search;
      const currentHash = location.hash;

      // Base Vercel URL - UPDATED TO YOUR NEW URL
      const baseUrl = "https://landing-eight-bay.vercel.app";

      // Map current path to iframe path
      if (currentPath === "/landing") {
        // Main landing page
        return `${baseUrl}${currentSearch}${currentHash}`;
      } else if (currentPath.startsWith("/landing/")) {
        // Sub-pages (if any)
        const subPath = currentPath.replace("/landing", "");
        return `${baseUrl}${subPath}${currentSearch}${currentHash}`;
      }

      // Default to main landing
      return baseUrl;
    };

    setIframeUrl(getIframeUrl());

    // Cleanup when component unmounts
    return () => {
      document.body.style.margin = "";
      document.body.style.padding = "";
      document.body.style.overflow = "";
    };
  }, [location.pathname, location.search, location.hash]);

  // Enhanced iframe load handler
  const handleIframeLoad = () => {
    try {
      console.log("Landing page iframe loaded");

      // Send setup message to iframe once it loads
      const iframe = document.querySelector(
        'iframe[title="Memor\'us Landing Page"]'
      );
      if (iframe && iframe.contentWindow) {
        // Give iframe time to set up its listeners
        setTimeout(() => {
          iframe.contentWindow.postMessage(
            {
              type: "PARENT_READY",
              parentDomain: window.location.origin,
            },
            "https://landing-eight-bay.vercel.app"
          );
        }, 100);
      }
    } catch (error) {
      console.log("Cannot access iframe content due to CORS policy");
    }
  };

  // Enhanced message listener for iframe navigation sync
  useEffect(() => {
    const handleMessage = (event) => {
      // Make sure message is from your Vercel domain
      if (event.origin === "https://landing-eight-bay.vercel.app") {
        console.log("Received message from iframe:", event.data);

        if (event.data.type === "NAVIGATION_CHANGE") {
          // Update parent URL when iframe navigates
          const newPath = event.data.path || "";
          const newSearch = event.data.search || "";
          const newHash = event.data.hash || "";

          // Construct new URL for parent
          const parentPath =
            newPath === "/" || newPath === ""
              ? "/landing"
              : `/landing${newPath}`;

          const fullUrl = `${parentPath}${newSearch}${newHash}`;

          console.log("Updating parent URL to:", fullUrl);

          // Update parent URL without page reload
          navigate(fullUrl, { replace: true });
        }

        if (event.data.type === "LINK_CLICK") {
          // Handle specific link clicks
          const { href, isExternal } = event.data;

          console.log("Link clicked in iframe:", href, "External:", isExternal);

          if (isExternal) {
            // Open external links in new tab
            window.open(href, "_blank");
          } else {
            // Handle internal navigation
            try {
              const url = new URL(href, "https://landing-eight-bay.vercel.app");
              const pathname = url.pathname;
              const search = url.search;
              const hash = url.hash;

              const parentPath =
                pathname === "/" || pathname === ""
                  ? "/landing"
                  : `/landing${pathname}`;

              const fullParentUrl = `${parentPath}${search}${hash}`;

              console.log("Navigating parent to:", fullParentUrl);
              navigate(fullParentUrl);
            } catch (error) {
              console.error("Error parsing URL:", error);
            }
          }
        }
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [navigate]);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        margin: 0,
        padding: 0,
        overflow: "hidden",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        backgroundColor: "#111827", // Fallback while loading
      }}
    >
      <iframe
        src={iframeUrl}
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          margin: 0,
          padding: 0,
          display: "block",
        }}
        title="Memor'us Landing Page"
        frameBorder='0'
        scrolling='yes'
        allowFullScreen
        loading='eager'
        onLoad={handleIframeLoad}
        // sandbox='allow-same-origin allow-scripts allow-popups allow-forms allow-top-navigation'
      />
    </div>
  );
};

export default LandingPage;
