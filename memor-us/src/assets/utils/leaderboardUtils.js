export const getLeaderboardVisibility = () => {
  const stored = localStorage.getItem("showLeaderboard");
  return stored === null ? true : JSON.parse(stored);
};

export const setLeaderboardVisibility = (value) => {
  localStorage.setItem("showLeaderboard", JSON.stringify(value));
  return value;
};
