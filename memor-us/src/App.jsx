import { Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home/Home";
import Memors from "./pages/Memors/Memors";
import Leaderboard from "./pages/Leaderboard/Leaderboard";
import MemoryBoard from "./pages/MemoryBoard/MemoryBoard";
import AdminHome from "./pages/Admin/Home/Home";
import AdminLeaderboard from "./pages/Admin/Leaderboard/Leaderboard";
import AdminMemoryBoard from "./pages/Admin/MemoryBoard/MemoryBoard";
import AdminBoard from "./pages/Admin/AdminBoard/AdminBoard";
import AdminLayout from "./Components/AdminLayout/AdminLayout";
import CollaboratorLayout from "./Components/CollaboratorLayout/CollaboratorLayout";
import "./index.css";

function App() {
  return (
    <Routes>
      {/* Collaborator Routes */}
      <Route path="/" element={<CollaboratorLayout />}>
        <Route index element={<Home />} />
        <Route path="memors" element={<Memors />} />
        <Route path="leaderboard" element={<Leaderboard />} />
        <Route path="memoryboard" element={<MemoryBoard />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminHome />} />
        <Route path="leaderboard" element={<AdminLeaderboard />} />
        <Route path="memoryboard" element={<AdminMemoryBoard />} />
        <Route path="adminboard" element={<AdminBoard />} />
      </Route>
    </Routes>
  );
}

export default App;
