import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from 'react';
import { singleUserApi, viewUserApi } from '../../services/api/allUserAPI';
import { singleuserData, viewUser } from '../../slices/Allusers';
import cover from '../../assets/Images/cover.jpg'
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineMessage } from "react-icons/md";
import { RiUserFollowFill, RiUserUnfollowFill } from "react-icons/ri";
import { jwtDecode } from "jwt-decode";

export default function UserProfile() {
  const dispatch = useDispatch();
  const allUsers = useSelector((state) => state.allusers.selectedUser);
  const { user } = useSelector((state) => state.allusers.singleUser) || [];
  const _id = localStorage.getItem('id');
  const token = localStorage.getItem('token');
  const currentId = jwtDecode(token);
  const navigate = useNavigate()

  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      if (!_id) {
        console.log("No user ID found in localStorage");
        return;
      }
      try {
        const response = await viewUserApi(_id);
        if (response?.user) {
          dispatch(viewUser(response.user));
          // Check if the current user is following this profile
          setIsFollowing(response.user.followers?.includes(currentId.id));
        } else {
          console.warn("No user data received");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, [_id, dispatch, currentId.id]);

  useEffect(() => {
    const fetchUser = async () => {
      if (!_id) {
        console.log("No user ID found in localStorage");
        return;
      }
      try {
        const response = await singleUserApi(_id);
        dispatch(singleuserData(response));
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, [_id, dispatch]);

  // Toggle follow/unfollow
  const handleFollowToggle = () => {
    if (isFollowing) {
      console.log("Unfollowing user",currentId.id);
      
    } else {
      console.log("Following user", currentId.id);
     
    }
    setIsFollowing(!isFollowing); 
  };
  const handleMessage = ()=>{
    navigate('/dashboard/message')
  }

  return (
    <div>
      <nav className="text-md font-medium text-richblack-300 mb-6">
        <ul className="flex space-x-2">
          <li><Link to="/" className="hover:text-[#308d46] transition">Home</Link></li>
          <span className="text-richblack-400">/</span>
          <li><Link to="/dashboard/user-profile" className="text-[#308d46] font-medium">User Profile</Link></li>
        </ul>
      </nav>

      <div className="bg-richblack-800 shadow-lg rounded-2xl w-100">
        <img
          src={cover}
          alt="Cover"
          className="w-full h-40 rounded-t-2xl border border-richblack-600 object-cover"
        />

        <div className="p-6 text-center z-10">
          <img
            src={user?.image}
            alt="Profile"
            className="w-40 h-40 rounded-full mx-auto border border-richblack-600 -mt-12 shadow-md"
          />
          <div>
            <span className="text-2xl text-richblack-50 font-bold mt-2">
              {user?.firstName} {user?.lastName}
            </span>
          </div>

          {_id !== currentId.id && (
            <div className="flex justify-center items-center text-2xl mt-2 gap-2 text-richblack-900">
              <div className="flex items-center justify-center gap-1 border border-richblack-200 px-2 rounded-lg text-richblack-50 p-1 px-2">
                <span><MdOutlineMessage /></span>
                <span onClick={()=>handleMessage()} className="font-semibold text-xl cursor-pointer">Message</span>
              </div>

              {/* Follow / Unfollow Button */}
              <button 
                onClick={handleFollowToggle} 
                className={`flex items-center justify-center gap-1 text-richblack-50 border border-richblack-200 px-2 rounded-lg p-1 px-2 ${isFollowing ? "bg-red-500" : "bg-[#308d46]"}`}
              >
                {isFollowing ? <RiUserUnfollowFill /> : <RiUserFollowFill />}
                <span className="font-semibold text-xl">
                  {isFollowing ? "Unfollow" : "Follow"}
                </span>
              </button>
            </div>
          )}

          <div className="flex justify-around mt-4 text-gray-700">
            <div>
              <p className="text-lg font-semibold text-richblack-5">{allUsers?.length}</p>
              <p className="text-md text-[#308d46] font-bold">Total Posts</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-richblack-5">{user?.followers?.length || 0}</p>
              <p className="text-md text-[#308d46] font-bold">Followers</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-richblack-5">{user?.following?.length || 0}</p>
              <p className="text-md text-[#308d46] font-bold">Following</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
