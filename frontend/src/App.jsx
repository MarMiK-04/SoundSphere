import AppRoutes from './routes/AppRoutes'
import './App.css'
import {Toaster} from "react-hot-toast"


function App() {
   return( 
    <>
    <Toaster position='top-right' />
   <AppRoutes/>
    </>  
   )
}

export default App
