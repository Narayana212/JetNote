import { useEffect, useState } from "react";

/**
 * Custom hook to get the origin of the current window
 * @returns {string} The origin of the current window, or an empty string if not mounted or window is undefined
 */
export const useOrigin = () => {
  const [mounted, setMounted] = useState(false);
  const origin = typeof window !== "undefined" && window.location.origin ? window.location.origin : "";

  /**
   * Sets the mounted state to true after the component mounts
   * @param {void} None - This effect doesn't take any parameters
   * @returns {void} This effect doesn't return anything
   */
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return "";
  }

  return origin;
};
