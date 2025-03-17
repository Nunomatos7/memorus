import { useRef, useState, useEffect } from "react";
import { ReactInfiniteCanvas } from "react-infinite-canvas";
import seedrandom from "seedrandom";
import { COMPONENT_POSITIONS } from "../../assets/Helpers/constants";
import { memorsData } from "../../Data/Memors.json";
import MemorPicture from "../../Components/MemorPicture/MemorPicture";
import "./MemoryBoard.css";
import Loader from "../../Components/Loader/Loader";

const canvasWidth = 2000;
const canvasHeight = 2000;
const cardWidth = 350;
const cardHeight = 400;
const spacing = 200;

const rng = seedrandom("fixed-seed");

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

const MemoryBoard = () => {
  const canvasRef = useRef();
  const [posts, setPosts] = useState([]);
  const [selectedMemor, setSelectedMemor] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [loadedImages, setLoadedImages] = useState(new Set());
  const [filteredTeam, setFilteredTeam] = useState("The Debuggers");

  const teams = [...new Set(memorsData.map((memor) => memor.team))];

  useEffect(() => {
    document.title = `Memor'us | Memory Board`;
  }, []);

  useEffect(() => {
    const positions = [];
    const memorsWithImages = memorsData.filter(
      (memor) =>
        memor.image && memor.image.length > 0 && memor.team === filteredTeam
    );

    const newPosts = memorsWithImages.map((post) => {
      const position = generateNonOverlappingPosition(positions);
      positions.push(position);
      return { ...post, ...position };
    });

    setPosts(newPosts);
  }, [filteredTeam]);

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
    const interval = setInterval(syncZoomLevel, 200); // Sync every 200ms

    return () => {
      window.removeEventListener("wheel", handleWheel);
      clearInterval(interval);
    };
  }, []);

  const openModal = (imageIndex, postIndex) => {
    const post = posts[postIndex];
    setSelectedMemor({
      images: post.image,
      currentIndex: imageIndex,
      title: post.title,
      submittedDate: post.submittedDate,
      team: post.team,
      postIndex
    });
  };

  const closeModal = () => {
    setSelectedMemor(null);
  };

  const handleImageNavigation = (newIndex) => {
    setSelectedMemor(prev => ({
      ...prev,
      currentIndex: newIndex
    }));
  };

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

  return (
    <>
      <Loader />
      <div
        style={{
          width: "100%",
          height: "93vh",
          position: "relative",
          backgroundColor: "#9990d8",
        }}
      >
        <div className='filter-controls'>
          <label
            htmlFor='team-filter'
            className='sr-only'
            style={{ color: "#341881", fontWeight: "600" }}
          >
            Filter by team:
          </label>
          <select
            id='team-filter'
            value={filteredTeam}
            onChange={(e) => setFilteredTeam(e.target.value)}
            className='filter-dropdown'
          >
            {teams.map((team, index) => (
              <option key={index} value={team}>
                {team}
              </option>
            ))}
          </select>
        </div>

        <ReactInfiniteCanvas
          ref={canvasRef}
          onCanvasMount={(mountFunc) => {
            mountFunc.fitContentToView({ scale: 0.5 });
          }}
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
          {posts.map((post, postIndex) => (
            <div
              key={postIndex}
              className="polaroid-container"
              style={{
                position: "absolute",
                top: post.y + canvasHeight / 2,
                left: post.x + canvasWidth / 2,
                width: `${cardWidth}px`,
                height: `${cardHeight}px`,
              }}
            >
              <div
                style={{ position: "relative", width: "100%", height: "100%" }}
              >
                {post.image
                  .slice()
                  .reverse()
                  .map((imgSrc, cardIndex, reversedArray) => (
                    <div
                      key={cardIndex}
                      className="polaroid-card"
                      onClick={() => openModal(reversedArray.length - 1 - cardIndex, postIndex)}
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
                        transform: `rotate(${cardIndex % 2 === 0 ? -1 : 1}deg)`,
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
                        alt={`Post image ${cardIndex}`}
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
                  ))}
              </div>
            </div>
          ))}
        </ReactInfiniteCanvas>

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