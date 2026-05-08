import { Navigate } from "react-router-dom";
import useAuthStore from "../store/authStore.js";
import Loading from "../pages/Loading.jsx";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  const { isCheckingAuht } = useAuthStore()
  if(isCheckingAuht){
     return <Loading/>
  }
  else if (!token) {
    return <Navigate to="/login" />;
  } else {
    return children;
  }
}

export default ProtectedRoute;
