import { RiEditBoxLine } from "react-icons/ri";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { formattedDate } from "../../../utils/dateFormatter";
import IconBtn from "../../common/IconBtn";
import SocialApp from "./SocialApp";
import Profile from "../../../pages/UserProfile";

export default function MyProfile() {
  const { user } = useSelector((state) => state.profile);
  const navigate = useNavigate();
  const userId = user?._id;

  return (
    <>
      {/* Breadcrumb Navigation */}
      <nav className="text-sm sm:text-md font-medium text-richblack-300 mb-4 sm:mb-6">
        <ul className="flex space-x-2">
          <li>
            <Link to="/" className="hover:text-[#308d46]">Home</Link>
          </li>
          <span className="text-richblack-400">/</span>
          <li>
            <Link to="/dashboard/my-profile" className="text-[#308d46] font-medium">My Profile</Link>
          </li>
        </ul>
      </nav>

      {/* Page Title */}
      <h1 className="text-xl sm:text-3xl font-medium text-richblack-5 mb-6 sm:mb-10">
        My Profile
      </h1>

      {/* Profile Card */}
      <div className="flex flex-col sm:flex-row justify-between items-center p-6 sm:p-8 rounded-lg border border-richblack-700 bg-richblack-800 gap-4">
        {user?.accountType === "User" ? (
          <Profile />
        ) : (
          <div className="flex items-center gap-x-4">
            <img
              src={user?.image}
              alt={`profile-${user?.firstName}`}
              className="w-16 sm:w-[78px] h-16 sm:h-[78px] rounded-full object-cover"
            />
            <div className="space-y-1">
              <p className="text-lg font-semibold text-richblack-5">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-sm text-richblack-300">{user?.email}</p>
            </div>
          </div>
        )}
        <IconBtn text="Edit" onclick={() => navigate("/dashboard/settings")}>
          <RiEditBoxLine />
        </IconBtn>
      </div>

      {/* SocialApp Section */}
      <div>
        <SocialApp userId={userId} />
      </div>

      {/* About Section */}
      <div className="my-6 sm:my-10 flex flex-col gap-y-6 rounded-md border border-richblack-700 bg-richblack-800 p-6 sm:p-8">
        <div className="flex w-full items-center justify-between">
          <p className="text-lg font-semibold text-richblack-5">About</p>
          <IconBtn text="Edit" onclick={() => navigate("/dashboard/settings")}>
            <RiEditBoxLine />
          </IconBtn>
        </div>
        <p className={`${user?.additionalDetails?.about ? "text-richblack-5" : "text-richblack-400"} text-sm font-medium`}>
          {user?.additionalDetails?.about ?? "Write Something..."}
        </p>
      </div>

      {/* Personal Details Section */}
      <div className="my-6 sm:my-10 flex flex-col gap-y-6 rounded-md border border-richblack-700 bg-richblack-800 p-6 sm:p-8">
        <div className="flex w-full items-center justify-between">
          <p className="text-lg font-semibold text-richblack-5">Personal Details</p>
          <IconBtn text="Edit" onclick={() => navigate("/dashboard/settings")}>
            <RiEditBoxLine />
          </IconBtn>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-lg">
          <div className="space-y-5">
            <div>
              <p className="mb-1 text-sm text-richblack-600">First Name</p>
              <p className="text-sm font-medium text-richblack-5">{user?.firstName}</p>
            </div>
            <div>
              <p className="mb-1 text-sm text-richblack-600">Email</p>
              <p className="text-sm font-medium text-richblack-5">{user?.email}</p>
            </div>
            <div>
              <p className="mb-1 text-sm text-richblack-600">Gender</p>
              <p className="text-sm font-medium text-richblack-5">
                {user?.additionalDetails?.gender ?? "Add Gender"}
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <p className="mb-1 text-sm text-richblack-600">Last Name</p>
              <p className="text-sm font-medium text-richblack-5">{user?.lastName}</p>
            </div>
            <div>
              <p className="mb-1 text-sm text-richblack-600">Phone Number</p>
              <p className="text-sm font-medium text-richblack-5">
                {user?.additionalDetails?.contactNumber ?? "Add Contact Number"}
              </p>
            </div>
            <div>
              <p className="mb-1 text-sm text-richblack-600">Date of Birth</p>
              <p className="text-sm font-medium text-richblack-5">
                {formattedDate(user?.additionalDetails?.dateOfBirth) ?? "Add Date of Birth"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
