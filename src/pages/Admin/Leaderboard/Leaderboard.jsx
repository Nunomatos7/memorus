import { useEffect, useState } from "react";
import { Box, Typography, Card, Avatar, CircularProgress } from "@mui/material";
import Grid from "@mui/material/Grid2";
import rank1 from "../../../assets/images/adminRank1.svg";
import rank2 from "../../../assets/images/adminRank2.svg";
import rank3 from "../../../assets/images/adminRank3.svg";
import background1 from "../../../assets/images/adminBackground1.svg";
import background3 from "../../../assets/images/adminBackground2.svg";
import background2 from "../../../assets/images/adminBackground3.svg";
import Loader from "../../../Components/Loader/Loader";
import { useAuth } from "../../../context/AuthContext";

// Export empty array for leaderboardData that other components might be importing
export const leaderboardData = [];

const Leaderboard = () => {
  const { token, user } = useAuth();
  const [leaderboardTeams, setLeaderboardTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentCompetition, setCurrentCompetition] = useState(null);

  useEffect(() => {
    document.title = `Memor'us | Leaderboard`;
  }, []);

  useEffect(() => {
    const fetchCurrentCompetition = async () => {
      if (!token || !user?.tenant_subdomain) return;

      try {
        // First, get active competitions to find the current one
        const compResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/api/competitions/active`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "X-Tenant": user.tenant_subdomain,
            },
          }
        );

        if (!compResponse.ok) {
          throw new Error("Failed to fetch active competitions");
        }

        const competitions = await compResponse.json();
        if (competitions && competitions.length > 0) {
          setCurrentCompetition(competitions[0]);
        } else {
          throw new Error("No active competitions found");
        }
      } catch (err) {
        console.error("Error fetching current competition:", err);
        setError("Could not load current competition data");
        setLoading(false);
      }
    };

    fetchCurrentCompetition();
  }, [token, user]);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      if (!token || !user?.tenant_subdomain || !currentCompetition?.id) return;

      try {
        setLoading(true);
        // Now fetch the leaderboard for this competition
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/leaderboard/competition/${currentCompetition.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "X-Tenant": user.tenant_subdomain,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch leaderboard data");
        }

        const leaderboardResult = await response.json();

        if (leaderboardResult && leaderboardResult.teams) {
          // Transform API data to match our expected format
          const formattedData = leaderboardResult.teams.map((team, index) => ({
            teamName: team.name || `Team ${team.teamId}`,
            points: team.points,
            memors: Math.ceil(team.points / 10), // Estimating memors count based on points
            rank: team.rank || index + 1,
            avatar: team.avatar || getDefaultAvatar(),
            teamId: team.teamId,
          }));

          setLeaderboardTeams(formattedData);
          setLoading(false);
        } else {
          throw new Error("Leaderboard data is in unexpected format");
        }
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
        // Don't use fallback data, just show an error
        setLeaderboardTeams([]);
        setError("Could not load leaderboard data.");
        setLoading(false);
      }
    };

    fetchLeaderboardData();
  }, [token, user, currentCompetition]);

  // Simple placeholder avatar in case API doesn't provide one
  const getDefaultAvatar = () => {
    return "https://via.placeholder.com/150";
  };

  return (
    <>
      <Loader />

      <div className="container">
        <img
          src={background1}
          alt=""
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "2",
            right: "0",
            width: "15%",
            zIndex: "0",
          }}
        />
        <img
          src={background2}
          alt=""
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "25%",
            left: "5%",
            width: "5%",
            zIndex: "0",
          }}
        />
        <img
          src={background3}
          alt=""
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "35%",
            right: "6%",
            width: "5%",
            zIndex: "0",
          }}
        />
        <Box
          sx={{
            padding: "20px",
            minHeight: "100vh",
            paddingBottom: "40px",
            zIndex: "10",
          }}
        >
          {/* Header */}
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                color: "white",
                marginBottom: "10px",
              }}
              tabIndex={0}
              aria-label="Leaderboard"
            >
              Leaderboard
            </Typography>
            {currentCompetition && (
              <Typography
                variant="subtitle1"
                sx={{
                  color: "#82D5C7",
                  marginBottom: "30px",
                }}
              >
                {currentCompetition.name}
              </Typography>
            )}
          </Box>

          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "300px",
              }}
            >
              <CircularProgress sx={{ color: "#82D5C7" }} />
            </Box>
          ) : error ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                alignItems: "center",
                minHeight: "300px",
                color: "white",
              }}
            >
              <Typography variant="h6" color="error" gutterBottom>
                {error}
              </Typography>
              {!currentCompetition && (
                <Typography variant="body1" color="#82D5C7">
                  No active competition found.
                </Typography>
              )}
            </Box>
          ) : (
            <>
              {/* Top 3  */}
              <Grid
                container
                spacing={3}
                sx={{
                  justifyContent: "center",
                  marginBottom: "40px",
                  alignItems: "end",
                  display: "flex",
                  flexWrap: "wrap",
                }}
              >
                {/* Rank 2 */}
                {leaderboardTeams.length >= 2 && (
                  <Grid
                    sx={{
                      width: "calc(30% - 20px)",
                      maxWidth: "400px",
                      minWidth: "300px",
                    }}
                    xs={12}
                    sm={4}
                  >
                    <Card
                      sx={{
                        backgroundColor: "#003731",
                        borderRadius: "20px",
                        textAlign: "center",
                        color: "white",
                        padding: "20px",
                        position: "relative",
                        height: "15rem",
                      }}
                      tabIndex={0}
                      aria-labelledby={`team-${leaderboardTeams[1].rank}`}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "start",
                          gap: "10px",
                          position: "absolute",
                          top: "15px",
                          left: "15px",
                        }}
                      >
                        <Avatar
                          src={leaderboardTeams[1]?.avatar}
                          alt="Rank 2"
                          sx={{
                            width: "40px",
                            height: "40px",
                            border: "2px solid white",
                          }}
                        />
                        <Typography
                          variant="h6"
                          sx={{
                            color: "#82D5C7",
                          }}
                        >
                          {leaderboardTeams[1]?.teamName}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          height: "100%",
                        }}
                      >
                        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                          {leaderboardTeams[1]?.points} Points
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            marginTop: "5px",
                            fontSize: "1.2rem",
                          }}
                        >
                          {leaderboardTeams[1]?.memors} Memors
                        </Typography>
                      </Box>
                      <img
                        src={rank2}
                        alt=""
                        style={{
                          position: "absolute",
                          bottom: "0px",
                          right: "10px",
                          height: "45%",
                        }}
                      />
                    </Card>
                  </Grid>
                )}

                {/* Rank 1 */}
                {leaderboardTeams.length >= 1 && (
                  <Grid
                    sx={{
                      width: "calc(38% - 20px)",
                      maxWidth: "500px",
                      minWidth: "300px",
                    }}
                    xs={12}
                    sm={4}
                  >
                    <Card
                      sx={{
                        border: "1.358px solid var(--Schemes-Primary, #82D5C7)",
                        background: "var(--Schemes-Primary, #82D5C7)",
                        borderRadius: "20px",
                        textAlign: "center",
                        color: "white",
                        padding: "20px",
                        position: "relative",
                        height: "20rem",
                      }}
                      tabIndex={0}
                      aria-labelledby={`team-${leaderboardTeams[0].rank}`}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "start",
                          gap: "10px",
                          position: "absolute",
                          top: "15px",
                          left: "15px",
                        }}
                      >
                        <Avatar
                          src={leaderboardTeams[0]?.avatar}
                          alt="Rank 1"
                          sx={{
                            width: "40px",
                            height: "40px",
                            border: "2px solid white",
                          }}
                        />
                        <Typography
                          variant="h6"
                          sx={{
                            color: "#003731",
                            fontWeight: "bold",
                          }}
                        >
                          {leaderboardTeams[0]?.teamName}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          height: "100%",
                        }}
                      >
                        <Typography
                          variant="h4"
                          sx={{
                            color: "#003731",
                            fontWeight: "bold",
                            fontSize: "3rem",
                          }}
                        >
                          {leaderboardTeams[0]?.points} Points
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            marginTop: "5px",
                            color: "#003731",
                            fontSize: "1.4rem",
                          }}
                        >
                          {leaderboardTeams[0]?.memors} Memors
                        </Typography>
                      </Box>
                      <img
                        src={rank1}
                        alt=""
                        style={{
                          position: "absolute",
                          bottom: "0px",
                          right: "10px",
                          height: "75%",
                        }}
                      />
                    </Card>
                  </Grid>
                )}

                {/* Rank 3 */}
                {leaderboardTeams.length >= 3 && (
                  <Grid
                    sx={{
                      width: "calc(30% - 20px)",
                      maxWidth: "350px",
                      minWidth: "300px",
                    }}
                    xs={12}
                    sm={4}
                  >
                    <Card
                      sx={{
                        borderRadius: "22.626px",
                        border: "2.715px solid #333738",
                        backgroundColor: "#232627",
                        textAlign: "center",
                        color: "white",
                        padding: "20px",
                        position: "relative",
                        height: "12rem",
                      }}
                      tabIndex={0}
                      aria-labelledby={`team-${leaderboardTeams[2].rank}`}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "start",
                          gap: "10px",
                          position: "absolute",
                          top: "15px",
                          left: "15px",
                        }}
                      >
                        <Avatar
                          src={leaderboardTeams[2]?.avatar}
                          alt="Rank 3"
                          sx={{
                            width: "40px",
                            height: "40px",
                            border: "2px solid white",
                          }}
                        />
                        <Typography
                          variant="h6"
                          sx={{
                            color: "#82D5C7",
                          }}
                        >
                          {leaderboardTeams[2]?.teamName}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          height: "100%",
                        }}
                      >
                        <Typography
                          variant="h4"
                          sx={{
                            fontWeight: "bold",
                            fontSize: "1.8rem",
                          }}
                        >
                          {leaderboardTeams[2]?.points} Points
                        </Typography>
                        <Typography variant="body1" sx={{ marginTop: "5px" }}>
                          {leaderboardTeams[2]?.memors} Memors
                        </Typography>
                      </Box>
                      <img
                        src={rank3}
                        alt=""
                        style={{
                          position: "absolute",
                          bottom: "0px",
                          right: "0px",
                          height: "35%",
                          zIndex: "10",
                        }}
                      />
                    </Card>
                  </Grid>
                )}
              </Grid>

              {/* Global Ranking */}
              <Typography
                variant="h5"
                sx={{
                  color: "white",
                  marginBottom: "20px",
                  marginTop: "50px",
                }}
              >
                Global Ranking
              </Typography>

              <Box sx={{ width: "100%", marginBottom: "20px" }}>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr 1fr",
                    textAlign: "center",
                    gap: "10px",
                    borderRadius: "13.576px",
                    border: "2.715px solid #333738",
                    padding: "10px",
                    background: "#232627",
                    marginBottom: "20px",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      color: "white",
                    }}
                  >
                    Rank
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "white",
                      textAlign: "center",
                    }}
                  >
                    Team
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "white",
                    }}
                  >
                    Memors Completed
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "white",
                    }}
                  >
                    Total Points
                  </Typography>
                </Box>
                {leaderboardTeams
                  .filter((team) => team.rank >= 4)
                  .map((team) => (
                    <Box
                      key={team.teamId || `${team.teamName}-${team.rank}`}
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr 1fr 1fr",
                        alignItems: "center",
                        textAlign: "center",
                        borderRadius: "13.576px",
                        border: "2.715px solid #333738",
                        padding: "10px",
                        marginTop: "-2px",
                      }}
                      tabIndex={0}
                      aria-label={`Rank ${team.rank}: ${team.teamName}, ${team.memors} Memors, ${team.points} Points`}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          color: "white",
                          textAlign: "center",
                        }}
                      >
                        {team.rank}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "left",
                          gap: "10px",
                        }}
                      >
                        <Avatar
                          src={team.avatar}
                          alt={team.teamName}
                          sx={{
                            width: "30px",
                            height: "30px",
                            border: "2px solid white",
                          }}
                        />
                        <Typography
                          variant="h6"
                          sx={{
                            color: "white",
                            textAlign: "center",
                          }}
                        >
                          {team.teamName}
                        </Typography>
                      </Box>
                      <Typography
                        variant="h6"
                        sx={{
                          color: "white",
                          textAlign: "center",
                        }}
                      >
                        {team.memors}
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{
                          color: "white",
                          textAlign: "center",
                        }}
                      >
                        {team.points}
                      </Typography>
                    </Box>
                  ))}
                {leaderboardTeams.filter((team) => team.rank >= 4).length ===
                  0 && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      padding: "20px",
                      borderRadius: "13.576px",
                      border: "2.715px solid #333738",
                      color: "#a0a0a0",
                    }}
                  >
                    <Typography variant="body1">
                      No more teams in the competition
                    </Typography>
                  </Box>
                )}
              </Box>
            </>
          )}
        </Box>
      </div>
    </>
  );
};

export default Leaderboard;
