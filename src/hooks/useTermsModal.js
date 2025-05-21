import { useState, useEffect } from "react";

/**
 * Custom hook to manage Terms of Service and Cookie Policy modal
 *
 * @param {Object} options Configuration options
 * @param {boolean} options.requireAcceptance Whether to force the user to accept terms before using the app
 * @param {number} options.reminderDays Days before reminding user to accept terms again
 * @returns {Object} Modal control methods and state
 */
const useTermsModal = (options = {}) => {
  const { requireAcceptance = false, reminderDays = 180 } = options;

  const [isOpen, setIsOpen] = useState(false);
  const [initialTab, setInitialTab] = useState("terms");
  const [hasAccepted, setHasAccepted] = useState(false);

  // On mount, check if the user has accepted the terms
  useEffect(() => {
    const termsAccepted = localStorage.getItem("termsAccepted") === "true";
    const cookiesAccepted = localStorage.getItem("cookiesAccepted") === "true";

    // Set the accepted state based on localStorage
    setHasAccepted(termsAccepted && cookiesAccepted);

    // If terms haven't been accepted and acceptance is required, show the modal
    if (requireAcceptance && (!termsAccepted || !cookiesAccepted)) {
      setIsOpen(true);
      return;
    }

    // If terms have been accepted, check if we need to remind the user
    if (termsAccepted && cookiesAccepted) {
      const lastAcceptedDate = localStorage.getItem("termsAcceptedDate");

      if (lastAcceptedDate) {
        const daysSinceAccepted = Math.floor(
          (new Date() - new Date(lastAcceptedDate)) / (1000 * 60 * 60 * 24)
        );

        // If it's been more than reminderDays since last acceptance, show the modal
        if (daysSinceAccepted > reminderDays) {
          setIsOpen(true);
        }
      }
    }
  }, [requireAcceptance, reminderDays]);

  // Function to open the modal
  const openTermsModal = (tab = "terms") => {
    setInitialTab(tab);
    setIsOpen(true);
  };

  // Function to close the modal
  const closeTermsModal = () => {
    setIsOpen(false);
  };

  // Function to mark terms as accepted
  const acceptTerms = () => {
    localStorage.setItem("termsAccepted", "true");
    localStorage.setItem("cookiesAccepted", "true");
    localStorage.setItem("termsAcceptedDate", new Date().toISOString());
    setHasAccepted(true);
    setIsOpen(false);
  };

  return {
    isOpen,
    initialTab,
    hasAccepted,
    openTermsModal,
    closeTermsModal,
    acceptTerms,
  };
};

export default useTermsModal;
