import React from "react";
import { Link, useLocation } from "react-router-dom";
import Icon from "./Icon";

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  const getBreadcrumbLabel = (segment) => {
    if (
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        segment
      ) ||
      /^\d+$/.test(segment)
    ) {
      return segment;
    }
    return segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  if (pathnames.length === 0) {
    return null;
  }

  return (
    <nav className="flex min-w-0 items-center gap-2 text-base leading-6 text-text font-roboto">
      <Link
        to="/dashboard"
        aria-label="Go to dashboard"
        className="shrink-0 text-textSecondary transition-colors hover:text-text"
      >
        <Icon name="House" size={16} />
      </Link>
      {pathnames.map((segment, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
        const isLast = index === pathnames.length - 1;
        const label = getBreadcrumbLabel(segment);

        return (
          <React.Fragment key={routeTo}>
            {index > 0 && <span className="text-textMuted">/</span>}

            {isLast ? (
              <span className="truncate font-medium text-text">{label}</span>
            ) : (
              <Link
                to={routeTo}
                className="shrink-0 text-textSecondary transition-colors hover:underline"
              >
                {label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;