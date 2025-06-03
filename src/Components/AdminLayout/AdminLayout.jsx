import { Outlet } from "react-router-dom";
import Navbar from "../AdminNavbar/AdminNavbar";

function AdminLayout() {
  return (
    <>
      <Navbar />
      <div className="admin-container">
        <Outlet />
      </div>
    </>
  );
}

export default AdminLayout;
