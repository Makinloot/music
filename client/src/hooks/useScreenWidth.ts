import { useState, useEffect } from "react";

const useScreenWidth = () => {
  const [smallScreen, setSmallScreen] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setSmallScreen(window.innerWidth <= 768);
    };

    // Set up event listener for window resize
    window.addEventListener("resize", handleResize);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []); // Empty dependency array ensures that effect runs only on mount and unmount

  return smallScreen;
};

export default useScreenWidth;
