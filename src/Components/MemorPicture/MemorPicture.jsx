import { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import "./MemorPicture.css";
import { useAuth } from "../../context/AuthContext";

const MemorPicture = ({
  images,
  currentIndex,
  teamName,
  title,
  submitDate,
  onClose,
  onNavigate,
  memorId,
  selectedTeam, // Optional - only used when filtering is needed
  selectedCompetition, // Optional - only used when filtering is needed
  useTeamFiltering = false, // New prop to control whether to apply team filtering
  clickedImageSrc, // Optional - the specific image that was clicked (for finding correct index after filtering)
}) => {
  const { token, user } = useAuth();
  const [activeIndex, setActiveIndex] = useState(0);
  const [teamFilteredImages, setTeamFilteredImages] = useState([]);
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const [hasFetchedImages, setHasFetchedImages] = useState(false);

  // Use ref to track if we've already fetched data for this modal session
  const fetchedForMemorId = useRef(null);
  const initialCurrentIndex = useRef(currentIndex);

  // Separate effect for initial data loading - only runs once per modal open
  useEffect(() => {
    // Only fetch if we haven't already fetched for this memorId in this modal session
    if (fetchedForMemorId.current === memorId && hasFetchedImages) {
      console.log(
        "🎯 MemorPicture: Already fetched for this memorId, skipping fetch"
      );
      return;
    }

    const loadTeamFilteredImages = async () => {
      setIsLoadingImages(true);
      fetchedForMemorId.current = memorId;
      setHasFetchedImages(true);

      console.log("🔥 DEBUG: loadTeamFilteredImages called");
      console.log("🔥 DEBUG: useTeamFiltering:", useTeamFiltering);
      console.log("🔥 DEBUG: selectedTeam:", selectedTeam);
      console.log("🔥 DEBUG: memorId:", memorId);
      console.log("🔥 DEBUG: clickedImageSrc:", clickedImageSrc);

      // If useTeamFiltering is false, just use the passed images directly
      if (!useTeamFiltering) {
        console.log(
          "🎯 MemorPicture: Not using team filtering, using passed images directly"
        );
        setTeamFilteredImages(images || []);
        setActiveIndex(initialCurrentIndex.current || 0);
        setIsLoadingImages(false);
        return;
      }

      // Simple check: if no clickedImageSrc and we're filtering, just use currentIndex
      if (!clickedImageSrc) {
        console.log(
          "🚨 WARNING: No clickedImageSrc provided! MemoryBoard might not be passing it correctly."
        );
        console.log(
          "🚨 Falling back to using currentIndex:",
          initialCurrentIndex.current
        );
      }

      // Only apply team filtering if explicitly requested and we have the necessary data
      if (memorId && token && user?.tenant_subdomain && selectedTeam) {
        console.log(
          "🎯 MemorPicture: Applying team filtering for memorId:",
          memorId,
          "selectedTeam:",
          selectedTeam
        );
        try {
          // Build the API URL with team and competition context
          let apiUrl = `${
            import.meta.env.VITE_API_URL
          }/api/memors/${memorId}/pictures`;

          // Add query parameters for team and competition filtering
          const params = new URLSearchParams();
          if (selectedTeam && selectedTeam !== "all") {
            params.append("teamId", selectedTeam);
          }
          if (selectedCompetition) {
            params.append("competitionId", selectedCompetition);
          }

          if (params.toString()) {
            apiUrl += `?${params.toString()}`;
          }

          console.log("🔥 API URL:", apiUrl);

          const response = await fetch(apiUrl, {
            headers: {
              Authorization: `Bearer ${token}`,
              "X-Tenant": user.tenant_subdomain,
            },
          });

          console.log("🔥 API Response status:", response.status);

          if (response.ok) {
            const teamPictures = await response.json();
            console.log("🔥 API Response data:", teamPictures);

            if (teamPictures.length > 0) {
              console.log(
                "🎯 MemorPicture: Got filtered pictures from API:",
                teamPictures.length
              );

              // Determine the correct index first
              let correctIndex = 0;

              // If we have a clicked image source, find its index in the filtered results
              if (clickedImageSrc) {
                console.log(
                  "🎯 MemorPicture: Looking for clicked image:",
                  clickedImageSrc
                );

                // Helper function to extract base URL (remove query parameters for comparison)
                const extractBaseUrl = (url) => {
                  try {
                    const urlObj = new URL(url);
                    return urlObj.origin + urlObj.pathname;
                  } catch {
                    return url.split("?")[0];
                  }
                };

                const clickedBaseUrl = extractBaseUrl(clickedImageSrc);
                console.log(
                  "🎯 MemorPicture: Clicked image base URL:",
                  clickedBaseUrl
                );

                const foundIndex = teamPictures.findIndex((pic) => {
                  const picSrc = pic.img_src || pic;
                  const picBaseUrl = extractBaseUrl(picSrc);
                  console.log(
                    "🎯 MemorPicture: Comparing with pic base URL:",
                    picBaseUrl
                  );
                  return picBaseUrl === clickedBaseUrl;
                });

                console.log(
                  "🎯 MemorPicture: Found index in filtered results:",
                  foundIndex
                );

                if (foundIndex !== -1) {
                  correctIndex = foundIndex;
                  console.log(
                    "🎯 MemorPicture: Using found index:",
                    correctIndex
                  );
                } else {
                  correctIndex = initialCurrentIndex.current || 0;
                  console.log(
                    "🎯 MemorPicture: Clicked image not found, using currentIndex:",
                    correctIndex
                  );
                }
              } else {
                correctIndex = initialCurrentIndex.current || 0;
                console.log(
                  "🎯 MemorPicture: No clicked image source, using currentIndex:",
                  correctIndex
                );
              }

              // Set both images and index together
              setTeamFilteredImages(teamPictures);
              setActiveIndex(correctIndex);
            } else {
              console.log(
                "🚨 NO FILTERED PICTURES! This means the memor doesn't belong to the selected team!"
              );

              // If no pictures returned, this memor doesn't belong to the selected team
              // Force close the modal
              setTimeout(() => {
                onClose();
              }, 100);

              setIsLoadingImages(false);
              return;
            }
          } else {
            console.log("🚨 API call failed with status:", response.status);
            // If API call fails, use the original images
            console.log(
              "🎯 MemorPicture: API call failed, using passed images"
            );
            setTeamFilteredImages(images || []);
            setActiveIndex(initialCurrentIndex.current || 0);
          }
        } catch (error) {
          console.error("🚨 Error fetching team-filtered images:", error);
          setTeamFilteredImages(images || []);
          setActiveIndex(initialCurrentIndex.current || 0);
        }
      } else {
        // Fallback to passed images if missing required data
        console.log(
          "🎯 MemorPicture: Missing required data for team filtering, using passed images"
        );
        setTeamFilteredImages(images || []);
        setActiveIndex(initialCurrentIndex.current || 0);
      }

      setIsLoadingImages(false);
    };

    loadTeamFilteredImages();
  }, [
    memorId,
    images,
    token,
    user?.tenant_subdomain,
    selectedTeam,
    selectedCompetition,
    useTeamFiltering,
    clickedImageSrc,
    // Removed currentIndex from dependencies to prevent refetch on navigation
  ]);

  // Separate effect to handle currentIndex changes from parent (only when not using team filtering)
  useEffect(() => {
    if (!useTeamFiltering && typeof currentIndex === "number") {
      setActiveIndex(currentIndex);
    }
  }, [currentIndex, useTeamFiltering]);

  // Reset refs when modal opens with a new memorId
  useEffect(() => {
    if (memorId !== fetchedForMemorId.current) {
      fetchedForMemorId.current = null;
      setHasFetchedImages(false);
      initialCurrentIndex.current = currentIndex;
    }
  }, [memorId, currentIndex]);

  const handleNextImage = () => {
    const imagesToUse =
      teamFilteredImages.length > 0 ? teamFilteredImages : images || [];
    if (imagesToUse.length <= 1) return;

    const newIndex =
      activeIndex >= imagesToUse.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(newIndex);
    // Only call onNavigate if we're not using team filtering to avoid parent re-renders
    if (onNavigate && !useTeamFiltering) {
      onNavigate(newIndex);
    }
  };

  const handlePreviousImage = () => {
    const imagesToUse =
      teamFilteredImages.length > 0 ? teamFilteredImages : images || [];
    if (imagesToUse.length <= 1) return;

    const newIndex =
      activeIndex <= 0 ? imagesToUse.length - 1 : activeIndex - 1;
    setActiveIndex(newIndex);
    // Only call onNavigate if we're not using team filtering to avoid parent re-renders
    if (onNavigate && !useTeamFiltering) {
      onNavigate(newIndex);
    }
  };

  // Handle background click to close modal
  const handleOverlayClick = (e) => {
    // Only close if clicking directly on the overlay (background)
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.key) {
        case "ArrowRight":
        case "Right": // For older browsers
          event.preventDefault();
          handleNextImage();
          break;
        case "ArrowLeft":
        case "Left": // For older browsers
          event.preventDefault();
          handlePreviousImage();
          break;
        case "Escape":
        case "Esc": // For older browsers
          event.preventDefault();
          onClose();
          break;
        default:
          break;
      }
    };

    // Add event listener when component mounts
    document.addEventListener("keydown", handleKeyDown);

    // Focus the modal container for accessibility
    const modalElement = document.querySelector(".modal-overlay");
    if (modalElement) {
      modalElement.focus();
    }

    // Cleanup event listener when component unmounts
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIndex, teamFilteredImages, images]); // Added dependencies for handleNextImage/handlePreviousImage

  // Use teamFilteredImages if available, otherwise fall back to original images
  const imagesToDisplay =
    teamFilteredImages.length > 0 ? teamFilteredImages : images || [];

  // Don't render the modal content until we've loaded the images and determined the correct index
  if (isLoadingImages || !imagesToDisplay || imagesToDisplay.length === 0) {
    return (
      <div className='modal-overlay' onClick={handleOverlayClick}>
        <div className='modal-content'>
          <p style={{ color: "white" }}>
            {isLoadingImages ? "Loading images..." : "No images available"}
          </p>
        </div>
      </div>
    );
  }

  const galleryImages = imagesToDisplay.map((img) => {
    if (typeof img === "string") {
      return { original: img, thumbnail: img };
    } else if (img && typeof img === "object") {
      const src = img.img_src || img.image || "";
      return {
        original: src,
        thumbnail: src,
        description: img.alt_text || "Memor image",
        originalAlt: img.alt_text || "Memor image",
        thumbnailAlt: img.alt_text || "Memor image",
      };
    }
    return { original: "", thumbnail: "" };
  });

  return (
    <div
      className='modal-overlay'
      onClick={handleOverlayClick}
      tabIndex={0}
      role='dialog'
      aria-modal='true'
      aria-labelledby='modal-title'
      aria-describedby='modal-description'
    >
      <button
        className='modal-close'
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        aria-label='Close viewer'
      >
        &times;
      </button>
      {galleryImages.length > 1 && (
        <>
          <button
            className='memor-nav-arrow left'
            aria-label='Previous image'
            onClick={(e) => {
              e.stopPropagation();
              handlePreviousImage();
            }}
          >
            &#10094;
          </button>
          <button
            className='memor-nav-arrow right'
            aria-label='Next image'
            onClick={(e) => {
              e.stopPropagation();
              handleNextImage();
            }}
          >
            &#10095;
          </button>
        </>
      )}
      <div className='memor-main-area'>
        <div className='memor-main-image-container'>
          <img
            src={galleryImages[activeIndex]?.original}
            alt={galleryImages[activeIndex]?.originalAlt}
            className='memor-main-image'
            draggable={false}
          />
        </div>
      </div>
      <div className='memor-modal-thumbnails-fixed'>
        <div className='modal-sub-content'>
          <h2 id='modal-title'>{title}</h2>
          <p id='modal-description'>
            {teamName} • {submitDate}
          </p>
        </div>
        <div className='memor-thumbnails-row'>
          {galleryImages.map((item, idx) => (
            <img
              key={idx}
              src={item.thumbnail}
              alt={item.thumbnailAlt}
              className={`memor-thumbnail${
                activeIndex === idx ? " active" : ""
              }`}
              onClick={(e) => {
                e.stopPropagation();
                setActiveIndex(idx);
                // Only call onNavigate if we're not using team filtering to avoid parent re-renders
                if (onNavigate && !useTeamFiltering) {
                  onNavigate(idx);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  e.stopPropagation();
                  setActiveIndex(idx);
                  // Only call onNavigate if we're not using team filtering to avoid parent re-renders
                  if (onNavigate && !useTeamFiltering) {
                    onNavigate(idx);
                  }
                }
              }}
              tabIndex={0}
              role='button'
              aria-label={`Go to image ${idx + 1}`}
              draggable={false}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

MemorPicture.propTypes = {
  images: PropTypes.array.isRequired,
  currentIndex: PropTypes.number,
  teamName: PropTypes.string,
  title: PropTypes.string,
  submitDate: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onNavigate: PropTypes.func,
  memorId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  selectedTeam: PropTypes.string,
  selectedCompetition: PropTypes.string,
  useTeamFiltering: PropTypes.bool,
  clickedImageSrc: PropTypes.string, // New prop
};

export default MemorPicture;
