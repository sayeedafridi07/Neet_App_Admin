// This will prevent authenticated users from accessing this route
import { Navigate } from "react-router-dom";

function OpenRoute({ children }) {
 const token = localStorage.getItem("accessToken");

  if (token === null) {
    return children;
  } else {
    return <Navigate to="/dashboard" />;
  }
}

export default OpenRoute;
