import * as Icons from "react-icons/vsc"
import { useDispatch } from "react-redux"
import { NavLink, matchPath, useLocation } from "react-router-dom"


export default function SidebarLinkMobile({ link, iconName }) {
  const Icon = Icons[iconName]
  const location = useLocation()
  const dispatch = useDispatch()

  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname)
  }

  return (
    <NavLink
      to={link.path}
      className={`relative px-4 py-2 text-sm font-medium ${
        matchRoute(link.path)
          ? "bg-[#0f4b1d] text-white"
          : "bg-opacity-0 text-richblack-300"
      } transition-all duration-200`}
    >
      <span
        className={`absolute left-0 bottom-0 w-full h-[0.15rem] bg-[#308d46] ${
          matchRoute(link.path) ? "opacity-100" : "opacity-0"
        }`}
      ></span>
      <div className="flex items-center justify-center gap-x-1 py-2">
        <Icon className="text-2xl" />
      </div>
    </NavLink>
  )
}