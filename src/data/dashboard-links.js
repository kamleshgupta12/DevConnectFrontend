import { ACCOUNT_TYPE } from "../utils/constants";
export const sidebarLinks = [
  {
    id: 1,
    name: "My Profile",
    path: "/dashboard/my-profile",
    icon: "VscAccount",
  },
  {
    id: 2,
    name: "Dashboard",
    path: "/dashboard/admin",
    type: ACCOUNT_TYPE.ADMIN,
    icon: "VscDashboard",
  },
  {
    id: 4,
    name: "Create Post",
    path: "/dashboard/post",
    type: ACCOUNT_TYPE.USER,
    icon: "VscAdd",
  },
  {
    id: 5,
    name: "Learning",
    path: "/dashboard/learning",
    type: ACCOUNT_TYPE.USER,
    icon: "VscFeedback",
  },
  {
    id: 6,
    name: "Quiz",
    path: "/dashboard/quiz",
    type: ACCOUNT_TYPE.USER,
    icon: "VscQuestion",
  },
];
