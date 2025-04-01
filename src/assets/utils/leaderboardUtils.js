// Create a custom event to notify components when visibility changes
export const LEADERBOARD_VISIBILITY_CHANGE = 'leaderboardVisibilityChange';

export const getLeaderboardVisibility = () => {
  const stored = localStorage.getItem("showLeaderboard");
  return stored === null ? true : JSON.parse(stored);
};

export const setLeaderboardVisibility = (value) => {
  localStorage.setItem("showLeaderboard", JSON.stringify(value));
  
  // Dispatch a custom event when visibility changes
  window.dispatchEvent(
    new CustomEvent(LEADERBOARD_VISIBILITY_CHANGE, { 
      detail: { visible: value } 
    })
  );
  
  return value;
};