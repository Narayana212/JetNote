import { create } from "zustand";

type CoverImageStore = {
  url?: string;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onReplace: (url: string) => void;
};

/**
 * Creates a custom hook for managing cover image state
 * @returns {Object} An object containing the following properties and methods:
 *   - url {string|undefined} The current cover image URL
 *   - isOpen {boolean} Whether the cover image modal is open
 *   - onOpen {Function} Opens the modal and resets the URL
 *   - onClose {Function} Closes the modal and resets the URL
 *   - onReplace {Function} Opens the modal with a new URL
 */
export const useCoverImage = create<CoverImageStore>((set) => ({
  url: undefined,
  isOpen: false,
  ```
  /**
   * Opens the component and resets the URL.
   * @param {void} - This function doesn't accept any parameters.
   * @returns {void} This function doesn't return a value, but updates the state.
   */
  ```
  onOpen: () => set({ isOpen: true, url: undefined }),
  ```
  /**
   * Closes the current view or modal
   * @param {void} - This function doesn't accept any parameters
   * @returns {void} This function doesn't return a value
   */
  ```
  onClose: () => set({ isOpen: false, url: undefined }),
  ```
  /**
   * Updates the state by setting isOpen to true and updating the url.
   * @param {string} url - The new URL to be set in the state.
   * @returns {void} This function doesn't return a value.
   */
  ```
  onReplace: (url: string) => set({ isOpen: true, url })
}));
