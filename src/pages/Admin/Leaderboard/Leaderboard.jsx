import { useEffect } from "react";
import { Box, Typography, Card, Avatar } from "@mui/material";
import Grid from "@mui/material/Grid2";
import rank1 from "../../../assets/images/adminRank1.svg";
import rank2 from "../../../assets/images/adminRank2.svg";
import rank3 from "../../../assets/images/adminRank3.svg";
import background1 from "../../../assets/images/adminBackground1.svg";
import background3 from "../../../assets/images/adminBackground2.svg";
import background2 from "../../../assets/images/adminBackground3.svg";
import Loader from "../../../Components/Loader/Loader";
export const leaderboardData = [
  {
    teamName: "Visual Voyagers",
    points: 510,
    memors: 51,
    rank: 1,
    avatar: "https://images.adsttc.com/media/images/5d44/14fa/284d/d1fd/3a00/003d/medium_jpg/eiffel-tower-in-paris-151-medium.jpg?1564742900",
  },
  {
    teamName: "The Debuggers",
    points: 360,
    memors: 36,
    rank: 2,
    avatar: "https://www.girlfromnowhere.pt/wp-content/uploads/2023/02/Passeio-de-moliceiro-nos-canais-de-Aveiro-1024x768.jpg",
  },
  {
    teamName: "Capital Crew",
    points: 190,
    memors: 19,
    rank: 3,
    avatar: "https://cdn-imgix.headout.com/microbrands-content-image/image/848bbbd82180ddf262893075f225b20d-Christmas%20in%20Prague%20-%20Why%20Spend%20Christmas%20in%20Prague%3F.jpg?auto=format&w=1222.3999999999999&h=687.6&q=90&fit=crop&ar=16%3A9&crop=faces",
  },
  {
    teamName: "The Hackers",
    points: 150,
    memors: 15,
    rank: 4,
    avatar: "https://www.vivernocentrodeportugal.com/Assets/Img/Galeria-regioes/f6f230cf.jpg",
  },
  {
    teamName: "The Coders",
    points: 120,
    memors: 12,
    rank: 5,
    avatar: "https://www.rotadaluz.pt/wp-content/uploads/2021/07/praia-furadouro-topo.jpg",
  },
  {
    teamName: "The Programmers",
    points: 100,
    memors: 10,
    rank: 6,
    avatar: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Cidade_Maravilhosa.jpg/800px-Cidade_Maravilhosa.jpg",
  },
  {
    teamName: "The Developers",
    points: 90,
    memors: 9,
    rank: 7,
    avatar: "https://www.pelago.com/img/destinations/bali/0619-0941_bali.jpg",
  },
  {
    teamName: "The Designers",
    points: 80,
    memors: 8,
    rank: 8,
    avatar: "https://static.nationalgeographicbrasil.com/files/styles/image_3200/public/nationalgeographic2710344.jpg?w=1900&h=1272",
  },
];

const Leaderboard = () => {
  useEffect(() => {
    document.title = `Memor'us | Leaderboard`;
  }, []);

  return (
    <>
      <Loader />

      <div className='container'>
        <img
          src={background1}
          alt=''
          aria-hidden='true'
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
          alt=''
          aria-hidden='true'
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
          alt=''
          aria-hidden='true'
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
          <Typography
            variant='h4'
            sx={{
              fontWeight: "bold",
              color: "white",
              marginBottom: "30px",
            }}
            tabIndex={0}
            aria-label='Leaderboard'
          >
            Leaderboard
          </Typography>

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
                aria-labelledby={`team-${leaderboardData[1].rank}`}
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
                    src={leaderboardData[1].avatar}
                    alt="Rank 2"
                    sx={{
                      width: "40px",
                      height: "40px",
                      border: "2px solid white",
                    }}
                  />
                  <Typography
                    variant='h6'
                    sx={{
                      color: "#82D5C7",
                    }}
                  >
                    {leaderboardData[1].teamName}
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
                  <Typography variant='h4' sx={{ fontWeight: "bold" }}>
                    {leaderboardData[1].points} Points
                  </Typography>
                  <Typography
                    variant='body1'
                    sx={{
                      marginTop: "5px",
                      fontSize: "1.2rem",
                    }}
                  >
                    {leaderboardData[1].memors} Memors
                  </Typography>
                </Box>
                <img
                  src={rank2}
                  alt=''
                  style={{
                    position: "absolute",
                    bottom: "0px",
                    right: "10px",
                    height: "45%",
                  }}
                />
              </Card>
            </Grid>

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
                aria-labelledby={`team-${leaderboardData[0].rank}`}
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
                    src={leaderboardData[0].avatar}
                    alt="Rank 1"
                    sx={{
                      width: "40px",
                      height: "40px",
                      border: "2px solid white",
                    }}
                  />
                  <Typography
                    variant='h6'
                    sx={{
                      color: "#003731",
                      fontWeight: "bold",
                    }}
                  >
                    {leaderboardData[0].teamName}
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
                    variant='h4'
                    sx={{
                      color: "#003731",
                      fontWeight: "bold",
                      fontSize: "3rem",
                    }}
                  >
                    {leaderboardData[0].points} Points
                  </Typography>
                  <Typography
                    variant='body1'
                    sx={{
                      marginTop: "5px",
                      color: "#003731",
                      fontSize: "1.4rem",
                    }}
                  >
                    {leaderboardData[0].memors} Memors
                  </Typography>
                </Box>
                <img
                  src={rank1}
                  alt=''
                  style={{
                    position: "absolute",
                    bottom: "0px",
                    right: "10px",
                    height: "75%",
                  }}
                />
              </Card>
            </Grid>

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
                aria-labelledby={`team-${leaderboardData[2].rank}`}
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
                    src={leaderboardData[2].avatar}
                    alt="Rank 3"
                    sx={{
                      width: "40px",
                      height: "40px",
                      border: "2px solid white",
                    }}
                  />
                  <Typography
                    variant='h6'
                    sx={{
                      color: "#82D5C7",
                    }}
                  >
                    {leaderboardData[2].teamName}
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
                    variant='h4'
                    sx={{
                      fontWeight: "bold",
                      fontSize: "1.8rem",
                    }}
                  >
                    {leaderboardData[2].points} Points
                  </Typography>
                  <Typography variant='body1' sx={{ marginTop: "5px" }}>
                    {leaderboardData[2].memors} Memors
                  </Typography>
                </Box>
                <img
                  src={rank3}
                  alt=''
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
          </Grid>

          {/* Global Ranking */}
          <Typography
            variant='h5'
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
                variant='h6'
                sx={{
                  color: "white",
                }}
              >
                Rank
              </Typography>
              <Typography
                variant='h6'
                sx={{
                  color: "white",
                  textAlign: "center",
                }}
              >
                Team
              </Typography>
              <Typography
                variant='h6'
                sx={{
                  color: "white",
                }}
              >
                Memors Completed
              </Typography>
              <Typography
                variant='h6'
                sx={{
                  color: "white",
                }}
              >
                Total Points
              </Typography>
            </Box>
            {leaderboardData
              .filter((team) => team.rank >= 4)
              .map((team) => (
                <Box
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
                    variant='h6'
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
                      variant='h6'
                      sx={{
                        color: "white",
                        textAlign: "center",
                      }}
                    >
                      {team.teamName}
                    </Typography>
                  </Box>
                  <Typography
                    variant='h6'
                    sx={{
                      color: "white",
                      textAlign: "center",
                    }}
                  >
                    {team.memors}
                  </Typography>
                  <Typography
                    variant='h6'
                    sx={{
                      color: "white",
                      textAlign: "center",
                    }}
                  >
                    {team.points}
                  </Typography>
                </Box>
              ))}
          </Box>
        </Box>
      </div>
    </>
  );
};

export default Leaderboard;
