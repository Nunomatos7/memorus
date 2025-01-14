import { useRef, useState, useEffect } from "react";
import { ReactInfiniteCanvas } from "react-infinite-canvas";
import imgTest from "../../assets/images/goat.png";
import seedrandom from "seedrandom";

const canvasWidth = 10000; // Logical canvas width
const canvasHeight = 10000; // Logical canvas height
const cardWidth = 200; // Width of each card
const cardHeight = 200; // Height of each card
const spacing = 200; // Minimum spacing between cards

// Seeded random number generator, fixed seed ensures the same random sequence
const rng = seedrandom("fixed-seed");

// Mock data for the posts
const mockPosts = Array.from({ length: 160 }, (_, index) => ({
  date: index % 2 === 0 ? "16/12/2024" : "01/12/2024",
  imgSrc: imgTest,
  title: `Share Di Maria ${index + 1}`,
}));

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

  useEffect(() => {
    const positions = [];
    const newPosts = mockPosts.map((post) => {
      const position = generateNonOverlappingPosition(positions);
      positions.push(position); // Store the position to avoid overlaps
      return { ...post, ...position };
    });
    setPosts(newPosts);
  }, []);

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
              height: `${cardHeight}px`,
              width: `${cardWidth}px`,
              border: "5px solid white",
              backgroundColor: "white",
              display: "flex",
              flexDirection: "column",
              justifyContent: "start",
            }}
          >
            <p
              style={{
                color: "black",
                textAlign: "left",
                fontFamily: "cursive",
                fontSize: "10px",
              }}
            >
              {post.date}
            </p>
            <img src={post.imgSrc} alt="Post image" style={{ height: "60%" }} />
            <p
              style={{
                color: "black",
                textAlign: "center",
                fontFamily: "cursive",
                marginTop: "10px",
              }}
            >
              {post.title}
            </p>
          </div>
        ))}
      </ReactInfiniteCanvas>
    </div>
  );
};

export default MemoryBoard;
