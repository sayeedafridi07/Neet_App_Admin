import { NavLink } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { useRef } from "react";
import Icon from "../common/Icon";

export default function SidebarLink({
  link,
  isMenuExpanded,
  isCollapsed,
  activeCollapsedMenuId,
  onToggleMenu,
  onToggleCollapsedMenu,
  onCloseCollapsedMenu,
  onCloseMobile,
}) {
  const {
    id,
    name,
    path,
    subLinks,
    hasSubLinks,
    isActive,
    hasActiveSubLink,
  } = link;


  const triggerRef = useRef(null);

  const isCollapsedExpanded = activeCollapsedMenuId === id;

  const handleClick = (e) => {
    if (!hasSubLinks) {
      if (onCloseMobile) onCloseMobile();
      return;
    }

    e.preventDefault();

    if (isCollapsed) {
      onToggleCollapsedMenu();
    } else {
      onToggleMenu();
    }
  };

  const handleSubLinkClick = () => {
    if (isCollapsed) {
      onCloseCollapsedMenu();
    }
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  // ================= COLLAPSED VIEW =================
  if (isCollapsed) {
    return (
      <>
        <div className="mb-1 relative">
          <NavLink
            ref={triggerRef}
            to={hasSubLinks ? "#" : path}
            onClick={handleClick}
            title={name}
            className={`relative group flex items-center justify-center p-3 rounded-lg text-sm font-normal font-roboto ${isActive
              ? "bg-primary text-white"
              : "text-text hover:bg-primary/20 hover:text-primary"
              } transition-all duration-200`}
          >
            <Icon
              name={link.icon}
              className="w-5 h-5 shrink-0"
            />
          </NavLink>
        </div>

        {/* Overlay */}
        {hasSubLinks && isCollapsedExpanded && (
          <div
            className="fixed inset-0 z-9998"
            onClick={handleSubLinkClick}
          />
        )}

        {/* Floating submenu */}
        {hasSubLinks && isCollapsedExpanded && (
          <div
            className="fixed bg-white shadow-xl rounded-lg border border-gray-200 py-2 z-[9999] min-w-52"
            style={{
              left: "4.5rem",
              top:
                triggerRef.current?.getBoundingClientRect().top || 0,
            }}
          >
            <div className="px-4 py-3 text-sm font-semibold text-gray-800 border-b">
              {name}
            </div>

            <div className="py-1">
              {subLinks.map((subLink) => (
                <NavLink
                  key={subLink.id}
                  to={subLink.path}
                  onClick={handleSubLinkClick}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 text-sm ${isActive
                      ? "bg-primary/10 text-primary border-r-2 border-primary"
                      : "text-text hover:bg-primary/20 hover:text-primary"
                    }`
                  }
                >
                  {subLink.name}
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </>
    );
  }

  // ================= EXPANDED VIEW =================
  return (
    <div className="mb-1">
      <NavLink
        to={hasSubLinks ? "#" : path}
        onClick={handleClick}
        className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-normal font-roboto ${isActive
          ? "bg-primary text-white"
          : "text-text hover:bg-primary/20 hover:text-primary"
          } transition-all duration-200`}
      >
        <div className="flex items-center space-x-2">
          <Icon name={link.icon} className="w-5 h-5 shrink-0" />
          <span>{name}</span>
        </div>

        {hasSubLinks && (
          <ChevronDown
            className={`w-4 h-4 transition-transform ${isMenuExpanded ? "rotate-180" : ""
              }`}
          />
        )}
      </NavLink>

      {/* Submenu */}
      {hasSubLinks && (
        <div
          className={`ml-4 mt-1 space-y-1 overflow-hidden transition-all duration-300 ${isMenuExpanded || hasActiveSubLink
            ? "max-h-96 opacity-100"
            : "max-h-0 opacity-0"
            }`}
        >
          {subLinks.map((subLink) => (
            <NavLink
              key={subLink.id}
              to={subLink.path}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg text-sm ${isActive
                  ? "bg-primary/20 text-primary border-l-2 border-primary"
                  : "text-text hover:bg-primary/20 hover:text-primary"
                }`
              }
            >
              {subLink.name}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}