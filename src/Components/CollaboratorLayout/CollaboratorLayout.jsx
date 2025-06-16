import { Outlet } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import { useState } from "react";

function CollaboratorLayout() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      image: "/assets/images/notifPurple.svg",
      title: "Less than a day to submit your memor!",
      description: "Don't forget to submit your memor 'Virtual Coffee Break'!",
    },
    {
      id: 2,
      image: "/assets/images/notifGreen.svg",
      title: "You've received a new memor",
      description: "A new memor was added to your team's memors.",
    },
  ]);

  const handleDeleteNotification = (id) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((notification) => notification.id !== id)
    );
  };

  return (
    <div>
      <Navbar
        notifications={notifications}
        handleDeleteNotification={handleDeleteNotification}
      />
      <div className='content'>
        <Outlet />
      </div>
    </div>
  );
}

export default CollaboratorLayout;
