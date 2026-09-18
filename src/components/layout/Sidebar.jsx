import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { sidebarLinks } from "../../data/sidebarLinks";
import { usePermissions } from "../../hooks/usePermissions";
import { matchRoute } from "../../utils/matchRoute";
import SidebarLink from "./SidebarLinks";

export default function Sidebar({ isVisible, onCloseMobile }) {
  const location = useLocation();
  const { isSuperAdmin } = usePermissions();

  const [expandedMenus, setExpandedMenus] = useState({});
  const [activeCollapsedMenuId, setActiveCollapsedMenuId] = useState(null);

  // Compute active + sublink states
  const processedLinks = sidebarLinks
    .filter((link) => (link.role ? isSuperAdmin : true))
    .map((link) => {
      const hasSubLinks = !!link.subLinks?.length;

      const hasActiveSubLink =
        hasSubLinks &&
        link.subLinks.some((subLink) =>
          matchRoute(subLink.path, location.pathname)
        );

      const isActive =
        matchRoute(link.path, location.pathname) || hasActiveSubLink;

      return {
        ...link,
        hasSubLinks,
        hasActiveSubLink,
        isActive,
      };
    });

  // Auto expand based on route
  useEffect(() => {
    const newExpandedMenus = {};

    processedLinks.forEach((link) => {
      if (link.hasActiveSubLink) {
        newExpandedMenus[link.id] = true;
      }
    });

    setExpandedMenus(newExpandedMenus);
  }, [location.pathname]);

  const toggleMenu = (linkId) => {
    setExpandedMenus((prev) => {
      if (prev[linkId]) {
        const newState = { ...prev };
        delete newState[linkId];
        return newState;
      }
      return { [linkId]: true };
    });
  };

  const toggleCollapsedMenu = (linkId) => {
    setActiveCollapsedMenuId((prev) =>
      prev === linkId ? null : linkId
    );
  };

  const closeCollapsedMenu = () => {
    setActiveCollapsedMenuId(null);
  };

  return (
    <div className="flex-1 flex flex-col px-3 py-4 overflow-y-auto overflow-x-hidden relative z-50">
      {processedLinks.map((link) => (
        <SidebarLink
          key={link.id}
          link={link}
          isMenuExpanded={expandedMenus[link.id]}
          isCollapsed={!isVisible}
          activeCollapsedMenuId={activeCollapsedMenuId}
          onToggleMenu={() => toggleMenu(link.id)}
          onToggleCollapsedMenu={() => toggleCollapsedMenu(link.id)}
          onCloseCollapsedMenu={closeCollapsedMenu}
          onCloseMobile={onCloseMobile}
        />
      ))}
    </div>
  );
}