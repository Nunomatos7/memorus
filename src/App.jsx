import { Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home/Home";
import Memors from "./pages/Memors/Memors";
import Leaderboard from "./pages/Leaderboard/Leaderboard";
import MemoryBoard from "./pages/MemoryBoard/MemoryBoard";
import AdminBoard from "./pages/AdminBoard/AdminBoard";
import Navbar from "./Components/Navbar/Navbar";
import "./index.css";

function App() {
  return (
    <>
      <Navbar />
      <div>
        <Routes>
          <Route index element={<Home />} />
          {/* <Route path="about" element={<About />} />

        <Route element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>

        <Route path="concerts">
          <Route index element={<ConcertsHome />} />
          <Route path=":city" element={<City />} />
          <Route path="trending" element={<Trending />} />
        </Route> */}

          <Route path='/memors' element={<Memors />} />
          <Route path='/leaderboard' element={<Leaderboard />} />
          <Route path='/memoryboard' element={<MemoryBoard />} />
          {/* The adminBoard page only appears if the user is an admin */}
          <Route path='/adminboard' element={<AdminBoard />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
