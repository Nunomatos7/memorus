// src/utils/adminRefresh.js
/**
 * Utility for managing Admin Board component refresh operations
 */

/**
 * Force refreshes the Admin Board components data based on the
 * current references available in the window object
 */
export const forceRefreshAdminBoard = () => {
  // Small delay to ensure backend operations have completed
  setTimeout(() => {
    console.log("Force refreshing Admin Board data");

    try {
      // Check if memors reference exists and refresh
      if (window.manageMemorsRef?.fetchMemors) {
        console.log("Refreshing Memors data");
        window.manageMemorsRef.fetchMemors();
      }

      // Check if teams reference exists and refresh
      if (window.manageTeamsRef?.fetchTeams) {
        console.log("Refreshing Teams data");
        window.manageTeamsRef.fetchTeams();
      }

      // Check if competition reference exists and refresh
      if (window.manageCompetitionRef?.fetchCompetitions) {
        console.log("Refreshing Competitions data");
        window.manageCompetitionRef.fetchCompetitions();
      }
    } catch (error) {
      console.error("Error during admin board refresh:", error);
    }
  }, 500); // Half-second delay
};

/**
 * Registers a component's refresh function in the global window object
 * @param {string} componentType - Type of component ("memors", "teams", or "competition")
 * @param {Function} refreshFunction - Function to call to refresh the component
 */
export const registerRefreshFunction = (componentType, refreshFunction) => {
  if (!refreshFunction || typeof refreshFunction !== "function") {
    console.error("Invalid refresh function provided");
    return;
  }

  switch (componentType) {
    case "memors":
      if (!window.manageMemorsRef) window.manageMemorsRef = {};
      window.manageMemorsRef.fetchMemors = refreshFunction;
      break;
    case "teams":
      if (!window.manageTeamsRef) window.manageTeamsRef = {};
      window.manageTeamsRef.fetchTeams = refreshFunction;
      break;
    case "competition":
      if (!window.manageCompetitionRef) window.manageCompetitionRef = {};
      window.manageCompetitionRef.fetchCompetitions = refreshFunction;
      break;
    default:
      console.error(`Unknown component type: ${componentType}`);
  }
};

/**
 * Unregisters a component's refresh function from the global window object
 * @param {string} componentType - Type of component ("memors", "teams", or "competition")
 * @param {Function} refreshFunction - Function that was registered
 */
export const unregisterRefreshFunction = (componentType, refreshFunction) => {
  switch (componentType) {
    case "memors":
      if (window.manageMemorsRef?.fetchMemors === refreshFunction) {
        delete window.manageMemorsRef.fetchMemors;
      }
      break;
    case "teams":
      if (window.manageTeamsRef?.fetchTeams === refreshFunction) {
        delete window.manageTeamsRef.fetchTeams;
      }
      break;
    case "competition":
      if (window.manageCompetitionRef?.fetchCompetitions === refreshFunction) {
        delete window.manageCompetitionRef.fetchCompetitions;
      }
      break;
    default:
      console.error(`Unknown component type: ${componentType}`);
  }
};
