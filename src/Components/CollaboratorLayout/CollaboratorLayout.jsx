import { Outlet } from "react-router-dom";
import Navbar from "../Navbar/Navbar";

function CollaboratorLayout() {
  return (
    <div>
      <Navbar />
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
}

export default CollaboratorLayout;
