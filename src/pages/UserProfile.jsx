import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { viewUserApi } from "../services/api/allUserAPI";
import { viewUser } from "../slices/Allusers";

export default function UserProfile() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.profile);
  const allUsers = useSelector((state) => state.allusers.selectedUser);
  const [like, setLike] = useState([]);
  const [comment, setComment] = useState([]);
  const id = user?._id;

  useEffect(() => {
    if (allUsers && allUsers.length > 0) {
      // Total Likes
      setLike(allUsers.flatMap((item) => item.likes));

      // Total Comments
      setComment(allUsers.flatMap((item) => item.comments));
    }
  }, [allUsers]);

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) {
        console.log("No user ID found");
        return;
      }

      try {
        const response = await viewUserApi(id);
        if (response?.user) {
          dispatch(viewUser(response.user));
        } else {
          console.warn("No user data received");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, [id, dispatch]);

  return (
    <div className="flex justify-center items-center p-4">
      <div className="w-full max-w-md bg-[#161D29] p-2 rounded-2xl  text-center md:border md:border-richblack-700">
        
        {/* Profile Image */}
        <img
          src={user?.image}
          alt="Profile"
          className="h-[120px] w-[120px] rounded-full mx-auto border border-richblack-600 shadow-md"
        />

        {/* User Name & Email */}
        <div className="mt-4">
          <h2 className="text-lg sm:text-2xl font-bold text-richblack-50">
            {user?.firstName} {user?.lastName}
          </h2>
          <p className="text-sm sm:text-md text-richblack-300 mt-1">
            {user?.email}
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-3 gap-4 mt-6 text-gray-300">
          <div className="text-center">
            <p className="text-base sm:text-lg font-semibold text-richblack-5">{allUsers?.length}</p>
            <p className="text-xs sm:text-sm text-[#308d46] font-medium">Total Posts</p>
          </div>
          
          <div className="text-center">
            <p className="text-base sm:text-lg font-semibold text-richblack-5">{like?.length}</p>
            <p className="text-xs sm:text-sm text-[#308d46] font-medium">Total Likes</p>
          </div>
          
          <div className="text-center">
            <p className="text-base sm:text-lg font-semibold text-richblack-5">{comment?.length}</p>
            <p className="text-xs sm:text-sm text-[#308d46] font-medium">Total Comments</p>
          </div>
        </div>
      </div>
    </div>
  );
}
