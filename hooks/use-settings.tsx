import { create } from "zustand";

type SettingsStore = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

/**
 * Creates a custom hook for managing settings state using Zustand
 * @returns {Object} An object containing the settings state and functions to manipulate it
 * @returns {boolean} isOpen - Indicates whether the settings panel is open
 * @returns {Function} onOpen - Function to open the settings panel
 * @returns {Function} onClose - Function to close the settings panel
 */
export const useSettings = create<SettingsStore>((set) => ({
  isOpen: false,
  /**
   * Opens the component by setting the isOpen state to true.
   * @returns {void} This function doesn't return a value.
   */
  onOpen: () => set({ isOpen: true }),
  /**
   * Closes the current component or modal
   * @param {void} - This function doesn't accept any parameters
   * @returns {void} This function doesn't return a value
   */
  onClose: () => set({ isOpen: false }),
}));
