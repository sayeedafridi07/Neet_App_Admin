import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("accessToken");

  if (token !== null) {
    return children;
  } else {
    return <Navigate to="/" />;
  }
};

export default PrivateRoute;
