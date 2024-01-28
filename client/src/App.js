import './App.css';
import { BrowserRouter,Routes,Route } from 'react-router-dom';

import SignupPage from './pages/Signup/SignupPage';
import LoginPage from './pages/Login/loginPage';
import Homepage from "./pages/HomePage";
import AdminDashboardPage from './pages/Admin/dashboard';
import AdminDashboardCategories from './pages/Admin/categories';
import AdminDashboardUsers from './pages/Admin/users';
import AdminDashboardSellers from './pages/Admin/sellers';


function App() {
  return (
    <BrowserRouter>
    <Routes>
      
       <Route path ="/" element ={<Homepage/>}/> 
       
     <Route path="/login" element={<LoginPage/>} /> 
    <Route path ="/signup" element ={<SignupPage/>}/>

    {/* Seller */}

      {/* Admin */}
    <Route path ="/admin" element ={<AdminDashboardPage/>}/> 
    <Route path = "/categories" element ={<AdminDashboardCategories/>}/>
    <Route path = "/users" element ={<AdminDashboardUsers/>}/>
    <Route path = "/shops" element ={<AdminDashboardSellers/>}/>
      </Routes>
      </BrowserRouter>
    
  );
}

export default App;
