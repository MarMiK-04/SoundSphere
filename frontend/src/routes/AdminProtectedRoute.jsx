import { Navigate } from "react-router-dom"
import useAuthStore from "../store/authStore"
import Loading from "../pages/Loading"

function AdminProtectedRoute({children}) {
  const {user,isCheckingAuht} = useAuthStore()
  if(isCheckingAuht){
    return <Loading/>
  }
  else if(!user){
    return <Navigate to="/login" />
  }
  else if(user.role!=="admin"){
    return <Navigate to="/" />
  }
  else{
    return children
  } 

}

export default AdminProtectedRoute

