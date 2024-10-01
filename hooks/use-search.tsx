import { create } from "zustand";

type SearchStore = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  toggle: () => void;
};

/**
 * Creates a custom hook for managing search functionality state
 * @returns {Object} An object containing search-related state and functions
 * @returns {boolean} isOpen - Indicates whether the search is open or closed
 * @returns {Function} onOpen - Function to set the search state to open
 * @returns {Function} onClose - Function to set the search state to closed
 * @returns {Function} toggle - Function to toggle the search state between open and closed
 */
export const useSearch = create<SearchStore>((set, get) => ({
  isOpen: false,
  /**
   ```
   /**
    * Closes the current modal or dialog by setting isOpen to false
    * @param {void} None - This function doesn't take any parameters
    * @returns {void} This function doesn't return a value
    */
   ```
   * Opens the component or dialog by setting the isOpen state to true.
   * @returns {void} This function doesn't return a value.
   */
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  /**
   * Toggles the open state of the component.
   * @returns {void} Does not return a value, but updates the isOpen state.
   */
  toggle: () => set({ isOpen: !get().isOpen }),
}));
