import { useRef } from "react";
import { ReactInfiniteCanvas } from "react-infinite-canvas";
import { COMPONENT_POSITIONS } from "../../assets/Helpers/constants";
import imgTest from "../../assets/images/goat.png";

// Minimum spacing between posts to avoid overlap
const MIN_SPACING = 220;

const generateNonOverlappingPosition = (existingPositions) => {
  let position;
  let isOverlapping;

  do {
    position = {
      x: Math.floor(Math.random() * window.innerWidth),
      y: Math.floor(Math.random() * window.innerHeight),
    };

    // Check for overlap with existing positions
    isOverlapping = existingPositions.some(
      (existing) =>
        Math.abs(existing.x - position.x) < MIN_SPACING &&
        Math.abs(existing.y - position.y) < MIN_SPACING
    );
  } while (isOverlapping);

  return position;
};

const posts = [
  {
    date: "16/12/2024",
    imgSrc: imgTest,
    title: "Share Di Maria",
  },
  {
    date: "01/12/2024",
    imgSrc: imgTest,
    title: "Share Di Maria",
  },
  {
    date: "16/12/2024",
    imgSrc: imgTest,
    title: "Share Di Maria",
  },
  {
    date: "16/12/2024",
    imgSrc: imgTest,
    title: "Share Di Maria",
  },
  {
    date: "01/12/2024",
    imgSrc: imgTest,
    title: "Share Di Maria",
  },
  {
    date: "16/12/2024",
    imgSrc: imgTest,
    title: "Share Di Maria",
  },
  {
    date: "16/12/2024",
    imgSrc: imgTest,
    title: "Share Di Maria",
  },
  {
    date: "01/12/2024",
    imgSrc: imgTest,
    title: "Share Di Maria",
  },
  {
    date: "16/12/2024",
    imgSrc: imgTest,
    title: "Share Di Maria",
  },
  {
    date: "16/12/2024",
    imgSrc: imgTest,
    title: "Share Di Maria",
  },
  {
    date: "01/12/2024",
    imgSrc: imgTest,
    title: "Share Di Maria",
  },
  {
    date: "16/12/2024",
    imgSrc: imgTest,
    title: "Share Di Maria",
  },
  {
    date: "16/12/2024",
    imgSrc: imgTest,
    title: "Share Di Maria",
  },
  {
    date: "01/12/2024",
    imgSrc: imgTest,
    title: "Share Di Maria",
  },
];

const renderPosts = () => {
  const positions = [];

  return posts.map((post, index) => {
    const position = generateNonOverlappingPosition(positions);
    positions.push(position); // Store the position for overlap checks

    return (
      <div
        key={index}
        style={{
          position: "absolute",
          top: position.y,
          left: position.x,
          height: "200px",
          width: "200px",
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
        <img src={post.imgSrc} alt='1' style={{ height: "60%" }} />
        <h1
          style={{
            color: "black",
            textAlign: "center",
            fontFamily: "cursive",
            marginTop: "10px",
          }}
        >
          {post.title}
        </h1>
      </div>
    );
  });
};

const MemoryBoard = () => {
  const canvasRef = useRef();

  return (
    <div style={{ width: "100%", height: "90vh", position: "relative" }}>
      <ReactInfiniteCanvas
        ref={canvasRef}
        onCanvasMount={(mountFunc) => {
          mountFunc.fitContentToView({ scale: 1 });
        }}
        customComponents={[
          {
            component: (
              <button
                onClick={() => {
                  canvasRef.current?.fitContentToView({ scale: 1 });
                }}
              >
                Start
              </button>
            ),
            position: COMPONENT_POSITIONS.TOP_LEFT,
            offset: { x: 120, y: 10 },
          },
        ]}
      >
        {renderPosts()}
      </ReactInfiniteCanvas>
    </div>
  );
};

export default MemoryBoard;
