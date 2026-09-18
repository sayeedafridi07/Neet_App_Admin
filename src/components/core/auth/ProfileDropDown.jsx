import { ChevronDown } from "lucide-react";
import { useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import useOnClickOutside from "../../../hooks/useOnClickOutside";
import { logout } from "../../../services/operations/authAPI";
import { formatRole } from "../../../utils/formatRole";

export default function ProfileDropdown({ profile }) {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useOnClickOutside(ref, () => setOpen(false));

  const { mutate: logoutUser, isPending: isLoggingOut } = useMutation({
    mutationFn: logout,

    onSuccess: () => {
      // Clear local auth data
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");

      setOpen(false);

      toast.success("Logged out successfully");

      navigate("/", { replace: true });
    },

    onError: (error) => {
      console.error("Logout failed:", error);

      // Even if API fails, logout locally
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");

      setOpen(false);

      toast.error(
        error?.response?.data?.message ||
          "Unable to reach the server. You have been logged out locally.",
      );

      navigate("/", { replace: true });
    },
  });

  const handleLogout = () => {
    if (isLoggingOut) return;

    logoutUser();
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex cursor-pointer items-center gap-3 transition-all duration-300 hover:opacity-80"
      >
        <img
          src={`https://api.dicebear.com/10.x/initial-face/svg?seed=${profile?.name}`}
          alt={`profile-${profile?.name}`}
          className="h-8 w-8 rounded-full object-cover"
        />

        <div className="hidden flex-col items-start md:flex">
          <span className="text-text text-sm font-medium">
            {profile?.name}
          </span>

          <span className="text-textSecondary text-xs">
            {formatRole(profile?.role)}
          </span>
        </div>

        <div className="rounded-full border border-gray-200 bg-white p-1 transition-all duration-300 hover:shadow-md">
          <ChevronDown
            strokeWidth={2}
            className="text-textSecondary h-4 w-4"
          />
        </div>
      </button>

      {open && (
        <div className="absolute top-12 right-0 z-50 mt-2 w-64 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
          {/* Profile */}
          <div className="cursor-pointer border-b border-gray-100 p-4 transition-colors hover:bg-gray-50">
            <div className="flex items-center space-x-3">
              <img
                src={`https://api.dicebear.com/10.x/initial-face/svg?seed=${profile?.name}`}
                alt={`profile-${profile?.name}`}
                className="h-12 w-12 rounded-full object-cover"
              />

              <div>
                <p className="text-base font-medium text-gray-900">
                  {profile?.name}
                </p>

                <p className="text-xs text-gray-500">
                  {profile?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Logout */}
          <div className="divide-y divide-gray-100 py-1">
            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="font-quickSand block w-full cursor-pointer px-4 py-2.5 text-left text-base font-semibold text-red-500 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoggingOut ? "Logging out..." : "Log Out"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}