import { useState, useEffect } from "react";
import "./Loader.css";

const Loader = () => {
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const fadeOutTimer = setTimeout(() => {
      setFadeOut(true);
    }, 1000);

    const removeLoaderTimer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(removeLoaderTimer);
    };
  }, []);

  if (!loading) return null;
  return (
    <div className={`loader-container ${fadeOut ? "fade-out" : ""}`}>
      <div className='loader loader-5'></div>
    </div>
  );
};

export default Loader;
