import React, { useState, useEffect, useRef } from "react";
import { ReactInfiniteCanvas } from "react-infinite-canvas";
import MemorPicture from "../../../Components/MemorPicture/MemorPicture";
import imgTest from "../../../assets/images/goat.png";
import { COMPONENT_POSITIONS } from "../../../assets/Helpers/constants";

const MIN_SPACING = 250;

// Function to check if a new position overlaps with existing positions
const doesOverlap = (position, existingPositions) => {
  return existingPositions.some((existing) => {
    return (
      Math.abs(existing.x - position.x) < MIN_SPACING &&
      Math.abs(existing.y - position.y) < MIN_SPACING
    );
  });
};

// Function to generate a single new non-overlapping position
const generateNonOverlappingPosition = (existingPositions, width, height) => {
  let position;
  let attempts = 0;

  do {
    position = {
      x: Math.floor(Math.random() * (width - 200)), // Subtract card width to keep within bounds
      y: Math.floor(Math.random() * (height - 200)), // Subtract card height to keep within bounds
    };

    if (attempts++ > 100) {
      // Avoid infinite loops
      throw new Error("Too many attempts to find a non-overlapping position");
    }
  } while (doesOverlap(position, existingPositions));

  console.log("Generated position: ", position); // Debug log
  return position;
};

const posts = [
  {
    date: "16/12/2024",
    imgSrc:
      "https://cdn.shopify.com/s/files/1/0469/3927/5428/files/Bildschirmfoto_2024-04-22_um_10.45.24.png?v=1713775565",
    title: "Share Di Maria",
    teamName: "Visual Voyagers",
  },
  {
    date: "01/12/2024",
    imgSrc: "../src/assets/images/lunch.jpg",
    title: "Share Di Maria",
    teamName: "Visual Voyagers",
  },
  {
    date: "16/12/2024",
    imgSrc: "../src/assets/images/colages.jpg",
    title: "Share Di Maria",
    teamName: "Visual Voyagers",
  },
  {
    date: "16/12/2024",
    imgSrc: "../src/assets/images/hats.jpg",
    title: "Share Di Maria",
    teamName: "Visual Voyagers",
  },
  {
    date: "01/12/2024",
    imgSrc: imgTest,
    title: "Share Di Maria",
    teamName: "Visual Voyagers",
  },
  {
    date: "16/12/2024",
    imgSrc: imgTest,
    title: "Share Di Maria",
    teamName: "Visual Voyagers",
  },
  {
    date: "16/12/2024",
    imgSrc: imgTest,
    title: "Share Di Maria",
    teamName: "Visual Voyagers",
  },
];

const MemoryBoard = () => {
  const canvasRef = useRef();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState({});
  const [positions, setPositions] = useState([]);

  useEffect(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const newPositions = posts.reduce((acc, _) => {
      const newPos = generateNonOverlappingPosition(acc, width, height);
      return [...acc, newPos];
    }, []);
    setPositions(newPositions);
    console.log("Initial positions set: ", newPositions); // Debug log
  }, []); // Empty dependency array ensures this runs only once

  const handleCardClick = (post, index) => {
    setCurrentPost(post);
    setIsModalOpen(true);
  };

  const renderPosts = () => {
    return positions.map((position, index) => {
      const post = posts[index];
      return (
        <div
          key={index}
          style={{
            position: "absolute",
            top: position.y,
            left: position.x,
            height: "200px", // Set a consistent height
            width: "200px", // Set a consistent width
            border: "5px solid white",
            backgroundColor: "white",
            display: "flex",
            flexDirection: "column",
            justifyContent: "start",
            cursor: "pointer",
            overflow: "hidden", // Ensures nothing extends outside the card
          }}
          onClick={() => handleCardClick(post, index)}
        >
          <p
            style={{
              color: "black",
              textAlign: "left",
              fontFamily: "cursive",
              fontSize: "10px",
              margin: "5px",
            }}
          >
            {post.date}
          </p>
          <img
            src={post.imgSrc}
            alt="Post Image"
            style={{
              height: "70%",
              width: "100%",
              objectFit: "cover",
              overflow: "hidden",
            }}
          />
          <p
            style={{
              color: "black",
              textAlign: "center",
              fontFamily: "cursive",
              marginTop: "10px",
              margin: "5px",
            }}
          >
            {post.title}
          </p>
        </div>
      );
    });
  };

  return (
    <div style={{ width: "100%", height: "90vh", position: "relative" }}>
      {isModalOpen && (
        <MemorPicture
          image={currentPost.imgSrc}
          teamName={currentPost.teamName}
          title={currentPost.title}
          submitDate={currentPost.date}
          onClose={() => setIsModalOpen(false)}
        />
      )}
      <ReactInfiniteCanvas
        ref={canvasRef}
        onCanvasMount={(mountFunc) => mountFunc.fitContentToView({ scale: 1 })}
        customComponents={[
          {
            component: (
              <button
                onClick={() =>
                  canvasRef.current?.fitContentToView({ scale: 1 })
                }
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
