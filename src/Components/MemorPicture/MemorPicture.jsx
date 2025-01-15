import { useRef, useState, useEffect } from "react";
import { ReactInfiniteCanvas } from "react-infinite-canvas";
import seedrandom from "seedrandom";
import { allMemors } from "../../pages/Memors/Memors";
import MemorPicture from "../../Components/MemorPicture/MemorPicture";

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
  const [isModalOpen, setIsModalOpen] = useState(false); // Track modal state

  useEffect(() => {
    const positions = [];
    // Filter memors with valid images
    const memorsWithImages = allMemors.filter(
      (memor) => memor.image && memor.image.length > 0
    );

    // Assign positions to memors
    const newPosts = memorsWithImages.map((post) => {
      const position = generateNonOverlappingPosition(positions);
      positions.push(position);
      return { ...post, ...position };
    });

    setPosts(newPosts);
  }, []);

  const openModal = (image, title, submittedDate) => {
    setSelectedMemor({ image, title, submittedDate });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedMemor(null);
    setIsModalOpen(false);
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
            {/* Render stacked cards */}
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
                  } // Open modal with selected data
                  style={{
                    position: "absolute",
                    top: `${cardIndex * 10}px`, // Vertical stacking
                    left: `${cardIndex * 10}px`, // Horizontal stacking
                    width: "100%",
                    height: "100%",
                    backgroundColor: "white",
                    border: "2px solid white",
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                    borderRadius: "8px",
                    transform: `rotate(${cardIndex % 2 === 0 ? -5 : 5}deg)`, // Slight rotation for style
                    zIndex: cardIndex,
                    cursor: "pointer", // Make it clickable
                  }}
                >
                  {/* Submitted Date */}
                  <p
                    style={{
                      color: "black",
                      textAlign: "left",
                      fontFamily: "cursive",
                      fontSize: "10px",
                      margin: "10px",
                    }}
                  >
                    {post.submittedDate}
                  </p>

                  {/* Image */}
                  <img
                    src={imgSrc}
                    alt={`Post image ${cardIndex}`}
                    style={{
                      width: "90%",
                      height: "60%",
                      objectFit: "cover",
                      borderRadius: "8px",
                      margin: "10px auto 0 auto",
                      display: "block",
                    }}
                  />

                  {/* Title */}
                  <p
                    style={{
                      color: "black",
                      textAlign: "center",
                      fontFamily: "cursive",
                      marginTop: "10px",
                      fontSize: "14px",
                    }}
                  >
                    {post.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </ReactInfiniteCanvas>

      {/* Render Modal */}
      {isModalOpen && selectedMemor && (
        <MemorPicture
          image={selectedMemor.image}
          title={selectedMemor.title}
          submitDate={selectedMemor.submittedDate}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default MemoryBoard;
