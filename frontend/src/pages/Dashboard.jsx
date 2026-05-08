import useAuthStore from "../store/authStore";

function Dashboard() {

   const { user } = useAuthStore();

   return (
      <>
         <div style={{ background: "red" }}>
            <h1>{user?.username}</h1>
            <p>{user?.email}</p>
            <p>{user?.role}</p>
         </div>
      </>
   );
}

export default Dashboard;