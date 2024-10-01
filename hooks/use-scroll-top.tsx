import { useState, useEffect } from "react";

/**
 * Custom React hook that tracks whether the page has been scrolled beyond a specified threshold
 * @param {number} [threshold=10] - The scroll position threshold in pixels
 * @returns {boolean} Whether the page has been scrolled beyond the threshold
 /**
  * Handles the scroll event and updates the scrolled state based on the window's vertical scroll position.
  * @param {void} - This function doesn't take any parameters.
  * @returns {void} This function doesn't return a value, but updates the state using setScrolled.
  */
 */
export const useScrollTop = (threshold = 10) => {
  const [scrolled, setScrolled] = useState(false);

  /**
   * Sets up a scroll event listener to track whether the page has been scrolled beyond a certain threshold.
   * @param {number} threshold - The scroll position threshold in pixels.
   * @returns {function} Cleanup function to remove the scroll event listener.
   */
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > threshold) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    /**
     * Removes the scroll event listener from the window
     * @returns {Function} A cleanup function that removes the scroll event listener when called
     */
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  return scrolled;
}