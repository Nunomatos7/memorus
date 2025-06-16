export const LEADERBOARD_VISIBILITY_CHANGE = "leaderboardVisibilityChange";

export const getLeaderboardVisibility = () => {
  const stored = localStorage.getItem("showLeaderboard");
  return stored === null ? true : JSON.parse(stored);
};

export const setLeaderboardVisibility = (value) => {
  localStorage.setItem("showLeaderboard", JSON.stringify(value));

  window.dispatchEvent(
    new CustomEvent(LEADERBOARD_VISIBILITY_CHANGE, {
      detail: { visible: value },
    })
  );

  return value;
};
