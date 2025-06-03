// src/pages/QRMemorAccess.jsx
// This is essentially a wrapper around SubmitMemorModal for QR code access

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import SubmitMemorModal from "../SubmitMemorModal/SubmitMemorModal";

const QRMemorAccess = () => {
  const { id } = useParams(); // Gets memor ID from URL: /qr-memor/123
  const [searchParams] = useSearchParams(); // Gets ?tempToken=xyz from URL

  const [memor, setMemor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 1. Extract temp token from URL
    const tempToken = searchParams.get("tempToken");

    // 2. Use temp token to load memor data
    loadMemorWithTempToken(tempToken);
  }, []);

  const loadMemorWithTempToken = async (tempToken) => {
    try {
      // Call your API with the temp token
      const response = await fetch(`/api/memors/${id}?tempToken=${tempToken}`);
      const memorData = await response.json();
      setMemor(memorData);
    } catch (err) {
      setError("Failed to load memor");
    } finally {
      setLoading(false);
    }
  };

  // Show loading while fetching data
  if (loading) return <div>Loading...</div>;

  // Show error if something went wrong
  if (error) return <div>Error: {error}</div>;

  // Show the submission interface
  return (
    <div style={{ backgroundColor: "#121212", minHeight: "100vh" }}>
      <SubmitMemorModal
        memor={memor}
        onClose={() => window.close()} // Close the mobile browser tab
        onSubmit={() => window.close()} // Close after successful submission
      />
    </div>
  );
};

export default QRMemorAccess;
