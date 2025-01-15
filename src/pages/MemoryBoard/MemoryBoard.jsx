import { useRef, useState, useEffect } from "react";
import { ReactInfiniteCanvas } from "react-infinite-canvas";
import seedrandom from "seedrandom";
import { allMemors } from "../Memors/Memors";
import MemorPicture from "../../Components/MemorPicture/MemorPicture";
import "./MemoryBoard.css";

const canvasWidth = 10000;
const canvasHeight = 10000;
const cardWidth = 250;
const cardHeight = 300;
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
  const [selectedMemor, setSelectedMemor] = useState(null); // Track the selected memor
  const [zoomLevel, setZoomLevel] = useState(1); // Track zoom level

  const getCanvasState = () => {
    return canvasRef.current?.getCanvasState?.();
  };

  useEffect(() => {
    const positions = [];
    const memorsWithImages = allMemors.filter(
      (memor) => memor.image && memor.image.length > 0
    );

    const newPosts = memorsWithImages.map((post) => {
      const position = generateNonOverlappingPosition(positions);
      positions.push(position);
      return { ...post, ...position };
    });

    setPosts(newPosts);
  }, []);

  const openModal = (image, title, submittedDate) => {
    setSelectedMemor({ image, title, submittedDate });
  };

  const closeModal = () => {
    setSelectedMemor(null);
  };

  // Zoom controls using d3Zoom
  const handleZoom = (action = "out") => {
    const canvasState = getCanvasState();
    if (!canvasState) return;

    const { canvasNode, currentPosition, d3Zoom } = canvasState;
    const { k: currentScale } = currentPosition || {};
    const diff = action === "out" ? -0.25 : 0.25;

    const newScale = currentScale + diff;
    if (newScale >= 0.1) {
      d3Zoom.scaleTo(canvasNode.transition().duration(500), newScale);
      setZoomLevel(newScale); // Update the zoom level state
    }
  };

  return (
    <div style={{ width: "100%", height: "90vh", position: "relative" }}>
      <ReactInfiniteCanvas
        ref={canvasRef}
        onCanvasMount={(mountFunc) => {
          mountFunc.fitContentToView({ scale: 1 });
        }}
      >
        {posts.map((post, index) => (
          <div
            key={index}
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
              {post.image.map((imgSrc, cardIndex) => (
                <div
                  key={cardIndex}
                  onClick={() =>
                    openModal(imgSrc, post.title, post.submittedDate)
                  }
                  style={{
                    position: "absolute",
                    top: `${cardIndex * 10}px`,
                    left: `${cardIndex * 10}px`,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "white",
                    border: "2px solid white",
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                    borderRadius: "8px",
                    transform: `rotate(${cardIndex % 2 === 0 ? -5 : 5}deg)`,
                    zIndex: cardIndex,
                    cursor: "pointer",
                  }}
                >
                  <p style={{ fontSize: "10px", margin: "10px" }}>
                    {post.submittedDate}
                  </p>
                  <img
                    src={imgSrc}
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
                  <p style={{ textAlign: "center", fontSize: "14px" }}>
                    {post.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </ReactInfiniteCanvas>

      {selectedMemor && (
        <MemorPicture
          image={selectedMemor.image}
          title={selectedMemor.title}
          submitDate={selectedMemor.submittedDate}
          onClose={closeModal}
        />
      )}

      {/* Zoom Controls */}
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
  );
};

export default MemoryBoard;
