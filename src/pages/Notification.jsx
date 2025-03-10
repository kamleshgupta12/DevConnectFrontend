import React, { useEffect, useState } from "react";
import { FaBell } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { setNotifications, clearNotifications } from "../slices/notificationSlice";
import "aos/dist/aos.css";

const ReceiveNotification = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.profile);
  const notifications = useSelector((state) => state.notifications.list);
  const [loading, setLoading] = useState(true);
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return;

      try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/alert/get-notifications/${user._id}`);
        const data = await response.json();

        if (data.success) {
          dispatch(setNotifications(data.notifications));
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [dispatch, user]);

  const handleClearNotifications = async () => {
    if (!user) return;
    setFadingOut(true);

    setTimeout(async () => {
      try {
        await fetch(`${process.env.REACT_APP_BASE_URL}/alert/notifications/clear/${user._id}`, { method: "DELETE" });
        dispatch(clearNotifications());
        setFadingOut(false);
      } catch (error) {
        console.error("Error clearing notifications:", error);
      }
    }, 500); 
  };

  return (
    <div className="relative w-full mx-auto mt-5 mb-8 ">
      <div className="flex items-center gap-2 p-4 bg-richblack-800 rounded-t-lg shadow-md border border-richblack-600">
        <FaBell className="text-[#ff9900] text-2xl" />
        <h2 className="text-lg font-bold text-richblack-5 text-center">Notifications</h2>
      </div>

      <div className={`bg-richblack-600 rounded-b-lg max-h-100 overflow-y-auto transition-opacity duration-500 ${fadingOut ? 'opacity-0' : 'opacity-100'}`}>
        {loading ? (
          <p className="p-4 text-richblack-400 text-center">Loading...</p>
        ) : notifications.length > 0 ? (
          notifications.map((notification, index) => (
            <div
              key={index}
              className="p-3 border-b border-richblack-800 text-white flex items-center space-x-3 transition-opacity duration-500"
            >
              {/* User Image */}
              {notification.user?.image && (
                <img
                  src={notification.user.image}
                  alt={notification.user?.name}
                  className="w-10 h-10 rounded-full object-cover border border-richblack-5"
                />
              )}

              <p>
                <strong>{notification.user?.name}</strong> {notification.message}
              </p>
            </div>
          ))
        ) : (
          <p className="p-4 text-richblack-50 text-center">No new notifications</p>
        )}
      </div>

      <div className="flex justify-end">
        {notifications.length > 0 && (
          <button
            onClick={handleClearNotifications}
            className="mt-5 p-1 px-2 border font-bold text-[#eb314a] rounded-md"
          >
            Clear All
          </button>
        )}
      </div>
    </div>
  );
};

export default ReceiveNotification;
