import { useEffect, useState } from "react";
import { BiSolidMessageDetail } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import ProfileDropdown from "../core/Auth/ProfileDropDown";
import { apiConnector } from "../../services/apiconnector";
import { categories } from "../../services/apis";
import { IoMdNotifications } from "react-icons/io";
import { setNotifications } from "../../slices/notificationSlice";

function Navbar() {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const notifications = useSelector((state) => state.notifications.list);
const dispatch = useDispatch()
  const location = useLocation();

  const [subLinks, setSubLinks] = useState([]);
  const [loading, setLoading] = useState(false);

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

  return (
    <div className={`flex h-16 items-center justify-center border-b-[1px] border-b-richblack-700 z-0 ${location.pathname !== "/" ? "bg-richblack-800" : ""} transition-all duration-200`}>
      <div className="flex w-[100%] pl-4 md:px-8 lg:px-8 items-center justify-between">
        <Link to="/">
          <h1 className="text-white font-extrabold text-2xl">DevConnect</h1>
        </Link>

        <div className="hidden items-center gap-x-4 md:flex">
          {


          }
          {user && user?.accountType !== "Admin" &&  (
            <Link to="/dashboard/message" className="relative">
              <div className=""><BiSolidMessageDetail className="text-3xl text-richblack-100"/></div>
            </Link>
          )}
          {token && (
            <Link to="/dashboard/notification" className="relative">
              <IoMdNotifications className="text-4xl text-richblack-100" />
              {
                notifications.length > 0 && <span className="absolute flex items-center justify-center text-sm
                 font-bold top-2 right-1 bg-[#E60000] w-4 h-4 rounded-full
                  animate-bounce text-white">{notifications && notifications?.length}</span>
              }
            </Link>
          )}
          {!token ? (
            <>
              <Link to="/login">
                <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                  Log in
                </button>
              </Link>
              <Link to="/signup">
                <button className="rounded-[8px] border border-richblack-500 bg-[#308d46] px-[12px] py-[8px] text-white">
                  Sign up
                </button>
              </Link>
            </>
          ) : (
            <div >
              <ProfileDropdown />
            </div>
          )}
        </div>
        <div className="mr-2 md:hidden  flex flex-row-reverse gap-2" >
          <ProfileDropdown />

          <div className="md:hidden">
            {token && (
              <Link to="/dashboard/notification" className="relative">
                <IoMdNotifications className="text-4xl text-richblack-100" />
                {
                  notifications.length > 0 && <span className="absolute flex items-center justify-center text-[12px]
               top-2 right-1 bg-[#E60000] w-4 h-4 rounded-full
                  animate-bounce text-white font-black">{notifications && notifications?.length}</span>
                }
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
