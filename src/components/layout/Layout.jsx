import { useState } from "react";
import { Outlet } from "react-router-dom";
import Breadcrumbs from "../common/Breadcrumbs";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function Layout() {
  // useInitialData();
  const [isSidebarVisible, setIsSidebarVisible] = useState(window.innerWidth >= 768);

  // useEffect(() => {
  //   document.querySelector("html").style.scrollBehavior = "auto";
  //   window.scroll({ top: 0 });
  //   document.querySelector("html").style.scrollBehavior = "";
  // }, [location.pathname]);

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Navbar
        onToggleSidebar={toggleSidebar}
        isSidebarVisible={isSidebarVisible}
      />
      <div className="flex flex-1 min-h-0 overflow-hidden relative">
        {/* Mobile Sidebar Overlay */}
        {isSidebarVisible && (
          <div 
            className="absolute inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setIsSidebarVisible(false)}
          />
        )}
        <div
          className={`${
            isSidebarVisible
              ? "absolute inset-y-0 left-0 w-64 md:relative translate-x-0"
              : "absolute inset-y-0 left-0 w-64 md:relative -translate-x-full md:translate-x-0 md:w-16"
          } bg-white shrink-0 transition-all duration-300 ease-in-out overflow-hidden z-40`}
        >
          {/* We pass a close function to Sidebar */}
          <Sidebar 
            isVisible={isSidebarVisible} 
            onCloseMobile={() => {
              if (window.innerWidth < 768) {
                setIsSidebarVisible(false);
              }
            }} 
          />
        </div>
        <main
          className={`flex flex-1 flex-col overflow-x-hidden overflow-y-auto rounded-2xl md:border border-gray-200 transition-all duration-300 ease-in-out`}
        >
          <div className="flex-1 p-4">
            <Breadcrumbs />
            <Outlet />
          </div>

          {/* Pages portal bottom bars (e.g. audio player) here; flex-1 above keeps it at the bottom */}
          <div id="bottom-bar-slot" className="sticky bottom-0 z-20 empty:hidden" />

        </main>
      </div>
    </div>
  );
}

export default Layout;
