// utils/matchRoute.js
import { matchPath } from "react-router-dom";

export const matchRoute = (route, pathname) => {
  if (!route) return false;

  // Dashboard should match ONLY exact /dashboard
  if (route === "/dashboard") {
    return pathname === "/dashboard";
  }

  return matchPath(
    {
      path: `/dashboard/${route}`,
      end: false,
    },
    pathname
  );
};