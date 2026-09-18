import { Menu } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import ProfileDropdown from "../core/auth/ProfileDropDown";

function Navbar({ onToggleSidebar }) {
  const token = localStorage.getItem("accessToken");
  const profile = localStorage.getItem("profile")
    ? JSON.parse(localStorage.getItem("profile"))
    : null;

  return (
    <nav className="sticky top-0 right-0 left-0 z-50 p-4">
      {/* Flex Container For Nav Items */}
      <div className="flex items-center justify-between space-x-10">
        {/* Sidebar Toggle Button and Logo */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onToggleSidebar}
            className="border-border hidden cursor-pointer rounded-md border p-2 transition-all duration-300 hover:shadow-md md:block"
          >
            <Menu strokeWidth={2} className="text-primary h-5 w-5" />
          </button>

          <button
            onClick={onToggleSidebar}
            className="cursor-pointer md:hidden"
          >
            <Menu strokeWidth={2} className="text-primary h-6 w-6" />
          </button>

          <Link to={`/`}>
            <img
              src={logo}
              className="h-10 w-auto cursor-pointer object-cover"
            />
          </Link>
        </div>
        {/* Menu Items */}
        <div className="flex items-center space-x-6">
          {token !== null && profile !== null && (
            <>
              <ProfileDropdown profile={profile} />
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
