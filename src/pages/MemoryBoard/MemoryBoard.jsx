import { useRef, useState, useEffect } from "react";
import { ReactInfiniteCanvas } from "react-infinite-canvas";
import { COMPONENT_POSITIONS } from "../../assets/Helpers/constants";
import seedrandom from "seedrandom";
import MemorPicture from "../../Components/MemorPicture/MemorPicture";
import "./MemoryBoard.css";
import Loader from "../../Components/Loader/Loader";
import { useAuth } from "../../context/AuthContext";
import { CircularProgress } from "@mui/material";

// Canvas dimensions
const canvasWidth = 2000;
const canvasHeight = 2000;
const cardWidth = 350;
const cardHeight = 400;
const spacing = 200;

// Create a fixed seed for consistent randomness
const rng = seedrandom("fixed-seed");

const MemoryBoard = () => {
  // References
  const canvasRef = useRef(null);
  const { token, user } = useAuth();

  // Basic state
  const [selectedMemor, setSelectedMemor] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [loadedImages, setLoadedImages] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [posts, setPosts] = useState([]);

  // Filter state
  const [competitions, setCompetitions] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedCompetition, setSelectedCompetition] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("");

  // Helper function to generate non-overlapping positions
  const generateNonOverlappingPosition = (positions) => {
    let position;
    let overlaps;

    do {
      position = {
        x: rng() * canvasWidth - canvasWidth / 2,
        y: rng() * canvasHeight - canvasHeight / 2,
      };

      overlaps = positions.some(
        (pos) =>
          Math.abs(pos.x - position.x) < cardWidth + spacing &&
          Math.abs(pos.y - position.y) < cardHeight + spacing
      );
    } while (overlaps);

    return position;
  };

  // Initialize page title
  useEffect(() => {
    document.title = `Memor'us | Memory Board`;
  }, []);

  // Load initial data: competitions and teams
  useEffect(() => {
    if (!token || !user) return;

    const fetchInitialData = async () => {
      setLoading(true);

      try {
        // Fetch ALL competitions instead of just active ones
        const competitionsResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/api/competitions`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "X-Tenant": user?.tenant_subdomain || "",
            },
          }
        );

        if (competitionsResponse.ok) {
          const competitionsData = await competitionsResponse.json();
          setCompetitions(competitionsData);

          // Find currently active competition
          const today = new Date().toISOString().split("T")[0];
          const activeCompetition = competitionsData.find(
            (comp) =>
              comp.is_active &&
              comp.start_date <= today &&
              comp.end_date >= today
          );

          // Set default to active competition, or first in list if none are active
          if (activeCompetition) {
            setSelectedCompetition(activeCompetition.id);
          } else if (competitionsData.length > 0) {
            setSelectedCompetition(competitionsData[0].id);
          }
        }

        // Fetch teams
        const teamsResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/api/teams`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "X-Tenant": user?.tenant_subdomain || "",
            },
          }
        );

        if (teamsResponse.ok) {
          const teamsData = await teamsResponse.json();
          setTeams(teamsData);

          // Set default team (user's team or first team)
          if (user?.teamsId) {
            setSelectedTeam(user.teamsId);
          } else if (teamsData.length > 0) {
            setSelectedTeam(teamsData[0].id);
          }
        }
      } catch (err) {
        console.error("Error fetching initial data:", err);
        setError("Failed to load initial data");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [token, user]);

  // Fetch memory board data when competition or team selection changes
  useEffect(() => {
    if (
      !selectedCompetition ||
      !selectedTeam ||
      !token ||
      !user?.tenant_subdomain
    ) {
      return;
    }

    console.log(
      `Fetching data for competition: ${selectedCompetition}, team: ${selectedTeam}`
    );
    setLoading(true);

    // Get team name for static data filtering
    const teamName =
      teams.find((t) => t.id === parseInt(selectedTeam))?.name || "Your Team";
    console.log(`Selected team name: ${teamName}`);

    // Reset posts first to avoid showing old data
    setPosts([]);

    // Then try to fetch from API
    const fetchMemorData = async () => {
      try {
        // Attempt to fetch from the completed memors endpoint
        const memorUrl = `${
          import.meta.env.VITE_API_URL
        }/api/memors/team/${selectedTeam}/competition/${selectedCompetition}/completed`;
        console.log(`Fetching from API: ${memorUrl}`);

        const response = await fetch(memorUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Tenant": user.tenant_subdomain,
          },
        });

        if (!response.ok) {
          throw new Error(
            `Failed to fetch memor data: ${response.status} ${response.statusText}`
          );
        }

        const memorData = await response.json();
        console.log(`API response from ${memorUrl}:`, memorData);

        if (memorData && memorData.length > 0) {
          // Process memor data
          const positions = [];
          const apiPosts = memorData
            .filter((memor) => memor.pictures && memor.pictures.length > 0)
            .map((memor) => {
              const position = generateNonOverlappingPosition(positions);
              positions.push(position);

              // Extract images
              const images = memor.pictures.map((pic) => ({
                img_src: pic.img_src,
                alt_text: pic.alt_text || `Image for ${memor.title}`,
              }));

              return {
                ...position,
                title: memor.title,
                description: memor.description || "",
                team: memor.team || teamName,
                submittedDate: memor.created_at
                  ? new Date(
                      memor.created_at.replace(" ", "T")
                    ).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "Unknown date",
                image: images.length > 0 ? images : null,
              };
            })
            .filter((post) => post.image && post.image.length > 0);

          if (apiPosts.length > 0) {
            setPosts(apiPosts);
          }
        }
      } catch (err) {
        console.error("Error fetching from API:", err);
        // We already loaded static data, so no need to update error state
      } finally {
        setLoading(false);
      }
    };

    fetchMemorData();
  }, [selectedCompetition, selectedTeam, token, user, teams]);

  // Handle lazy loading of images
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setLoadedImages(
              (prev) => new Set([...prev, entry.target.dataset.src])
            );
          }
        });
      },
      { root: null, rootMargin: "150px" }
    );

    const imageElements = document.querySelectorAll("[data-src]");
    imageElements.forEach((img) => observer.observe(img));

    return () => observer.disconnect();
  }, [posts]);

  // Handle zoom controls
  useEffect(() => {
    const handleWheel = (e) => {
      if (e.ctrlKey) {
        e.preventDefault();
        const canvasState = canvasRef.current?.getCanvasState?.();
        if (canvasState) {
          const { currentPosition } = canvasState;
          const { k: currentScale } = currentPosition || {};
          const newScale = currentScale + (e.deltaY > 0 ? -0.1 : 0.1);
          if (newScale >= 0.1 && newScale <= 3) {
            canvasState.d3Zoom.scaleTo(
              canvasState.canvasNode.transition().duration(0),
              newScale
            );
            setZoomLevel(newScale);
          }
        }
      }
    };

    const syncZoomLevel = () => {
      const canvasState = canvasRef.current?.getCanvasState?.();
      if (canvasState) {
        const { currentPosition } = canvasState;
        const { k: currentScale } = currentPosition || {};
        setZoomLevel(currentScale);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    const interval = setInterval(syncZoomLevel, 200);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      clearInterval(interval);
    };
  }, []);

  // Event handlers
  const handleZoom = (action = "out") => {
    const canvasState = canvasRef.current?.getCanvasState?.();
    if (!canvasState) return;

    const { canvasNode, currentPosition, d3Zoom } = canvasState;
    const { k: currentScale } = currentPosition || {};
    const diff = action === "out" ? -0.25 : 0.25;

    const newScale = currentScale + diff;
    if (newScale >= 0.1 && newScale <= 3) {
      d3Zoom.scaleTo(canvasNode.transition().duration(500), newScale);
      setZoomLevel(newScale);
    }
  };

  const openModal = (imageIndex, postIndex) => {
    console.log(
      `MemoryBoard: openModal called with imageIndex: ${imageIndex}, postIndex: ${postIndex}`
    );

    // Get the post from the posts array
    const post = posts[postIndex];
    console.log("MemoryBoard: post data:", post);

    // Just use the post images directly, don't modify the format
    let images = [];

    if (post.image && Array.isArray(post.image)) {
      // Just use the post images directly, don't modify the format
      images = post.image;
      console.log("MemoryBoard: Using post images directly:", images);
    }

    // Create the selectedMemor object
    setSelectedMemor({
      images: images,
      currentIndex: imageIndex,
      title: post.title,
      submittedDate: post.submittedDate || post.created_at,
      team: post.team?.name || post.team,
      postIndex,
    });
  };

  const closeModal = () => {
    setSelectedMemor(null);
  };

  const handleImageNavigation = (newIndex) => {
    setSelectedMemor((prev) => ({
      ...prev,
      currentIndex: newIndex,
    }));
  };

  const handleCompetitionChange = (event) => {
    // Clear posts when changing competition to avoid showing old data
    setPosts([]);
    setSelectedCompetition(event.target.value);
  };

  const handleTeamChange = (event) => {
    // Clear posts when changing team to avoid showing old data
    setPosts([]);
    setSelectedTeam(event.target.value);
  };

  // Render
  return (
    <>
      <Loader />
      <div
        className='memory-board-container'
        style={{
          width: "100%",
          height: "100vh", // Changed to full viewport height
          position: "relative",
          backgroundColor: "#9990d8",
        }}
      >
        {/* Filter Controls */}
        <div className='filter-controls'>
          {/* Competition Filter */}
          <label
            htmlFor='competition-filter'
            className='sr-only'
            style={{ color: "#341881", fontWeight: "600" }}
          >
            Filter by competition:
          </label>
          <select
            id='competition-filter'
            value={selectedCompetition}
            onChange={handleCompetitionChange}
            className='filter-dropdown'
          >
            {competitions.map((competition) => (
              <option key={competition.id} value={competition.id}>
                {competition.name}
              </option>
            ))}
          </select>

          {/* Team Filter */}
          <label
            htmlFor='team-filter'
            className='sr-only'
            style={{ color: "#341881", fontWeight: "600" }}
          >
            Filter by team:
          </label>
          <select
            id='team-filter'
            value={selectedTeam}
            onChange={handleTeamChange}
            className='filter-dropdown'
          >
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>

        {loading && posts.length === 0 ? (
          <div className='loading-container'>
            <CircularProgress size={60} sx={{ color: "#d0bcfe" }} />
          </div>
        ) : posts.length === 0 ? (
          <div className='empty-container'>
            <p className='empty-message'>
              No memors found for this team in the selected competition
            </p>
          </div>
        ) : (
          <ReactInfiniteCanvas
            ref={canvasRef}
            onCanvasMount={(mountFunc) => {
              mountFunc.fitContentToView({ scale: 0.5 });
            }}
            backgroundType='none' // This disables the dotted background
            customComponents={[
              {
                component: (
                  <button
                    className='start-btn'
                    onClick={() => {
                      canvasRef.current?.fitContentToView({ scale: 1 });
                    }}
                  >
                    Start
                  </button>
                ),
                position: COMPONENT_POSITIONS.BOTTOM_LEFT,
                offset: { x: 20, y: 70 },
              },
            ]}
          >
            {/* Rest of your canvas content */}
            {posts.map((post, postIndex) => (
              <div
                key={postIndex}
                className='polaroid-container'
                style={{
                  position: "absolute",
                  top: post.y + canvasHeight / 2,
                  left: post.x + canvasWidth / 2,
                  width: `${cardWidth}px`,
                  height: `${cardHeight}px`,
                }}
              >
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  {post.image
                    .slice()
                    .reverse()
                    .map((image, cardIndex, reversedArray) => {
                      // Extract img_src and alt_text based on the image format
                      const imgSrc =
                        typeof image === "string"
                          ? image
                          : image && image.img_src
                          ? image.img_src
                          : "";

                      const altText =
                        image && image.alt_text
                          ? image.alt_text
                          : `Image for ${post.title}`;

                      return (
                        <div
                          key={cardIndex}
                          className='polaroid-card'
                          onClick={() =>
                            openModal(
                              reversedArray.length - 1 - cardIndex,
                              postIndex
                            )
                          }
                          style={{
                            position: "absolute",
                            top: `${cardIndex * 5}px`,
                            left: `${cardIndex * 40}px`,
                            width: "100%",
                            height: "100%",
                            backgroundColor: "white",
                            border: "2px solid white",
                            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                            borderRadius: "8px",
                            transform: `rotate(${
                              cardIndex % 2 === 0 ? -1 : 1
                            }deg)`,
                            zIndex: cardIndex,
                            cursor: "pointer",
                          }}
                        >
                          {/* Submitted Date */}
                          <p className='card-date'>{post.submittedDate}</p>

                          {/* Image */}
                          <img
                            data-src={imgSrc}
                            src={loadedImages.has(imgSrc) ? imgSrc : ""}
                            alt={altText}
                            style={{
                              width: "90%",
                              height: "60%",
                              objectFit: "cover",
                              borderRadius: "8px",
                              margin: "10px auto",
                              display: "block",
                            }}
                          />

                          {/* Title - Only for the first image */}
                          {cardIndex === reversedArray.length - 1 && (
                            <p className='card-title'>{post.title}</p>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>
            ))}
          </ReactInfiniteCanvas>
        )}

        {selectedMemor && (
          <MemorPicture
            images={selectedMemor.images}
            currentIndex={selectedMemor.currentIndex}
            title={selectedMemor.title}
            submitDate={selectedMemor.submittedDate}
            teamName={selectedMemor.team}
            onClose={closeModal}
            onNavigate={handleImageNavigation}
          />
        )}

        <div className='zoom-controls'>
          <button className='zoom-btn' onClick={() => handleZoom("out")}>
            -
          </button>
          <span className='zoom-display'>{Math.round(zoomLevel * 100)}%</span>
          <button className='zoom-btn' onClick={() => handleZoom("in")}>
            +
          </button>
        </div>
      </div>
    </>
  );
};

export default MemoryBoard;
