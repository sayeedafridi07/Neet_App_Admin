import { ROLES } from "../data/roles";

export const usePermissions = () => {
  const profile = localStorage.getItem("profile")
    ? JSON.parse(localStorage.getItem("profile"))
    : null;

  const isSuperAdmin = profile?.role === ROLES.SUPER_ADMIN;

  return { isSuperAdmin };
};
