import './App.css';
import React from 'react';
import { BrowserRouter,Routes,Route } from 'react-router-dom';

import {
  EventsPage,
   HomePage,
    LoginPage,
     ProductDetailsPage, 
     ProductsPage, 
     ShopCreatePage,
      ShopLoginPage,
       SignupPage 
      } from './routes/routes';


import {
   ShopAllEvents,
    ShopCreateEvent,
     ShopCreateProduct,
      ShopDashboardPage,
       ShopProducts 
      } from './routes/ShopRoutes';

      // Admin
      import { 
        AdminDashboardCategories,
         AdminDashboardPage,
          AdminDashboardProducts,
           AdminDashboardSellers,
            AdminDashboardUsers 
          } from './routes/AdminRoutes';
import { SellerProvider } from './context/SellerContext';




function App() {
  return (
    <BrowserRouter>
    <Routes>
      
       <Route path ="/" element ={<HomePage/>}/> 
       
     <Route path="/login" element={<LoginPage/>} /> 
    <Route path ="/signup" element ={<SignupPage/>}/>
    <Route path="/product/:id" element={<ProductDetailsPage/>} />
    <Route path="/products" element={<ProductsPage/>} />
    <Route path ="/events" element={<EventsPage/>}/>

    {/* Seller */}
    {/* <Route path="/shop/preview/:id" element={<ShopPreviewPage />} /> */}
        <Route path ="/shopcreate" element ={<ShopCreatePage/>}/>\


        <Route
        path="/shop/*"
        element={
       
          <SellerProvider>
             <Routes>
            <Route path="/login" element={<ShopLoginPage />} />
            <Route path="/dashboard" element={<ShopDashboardPage />} />
            {/* <Route path ="/events" element={<EventsPage/>}/> */}
            <Route
              path="/dashboard-create-product"
             element={
             <ShopCreateProduct />
            
          }
        />
           <Route
          path="/dashboard-create-event"
          element={
           
              <ShopCreateEvent/>
            
          }
        />
               <Route
          path="/dashboard-products"
          element={
              <ShopProducts/>
            
          }
        />
                <Route
          path="/dashboard-events"
          element={
           
              <ShopAllEvents />
            
          }
        />
        </Routes>
          
        </SellerProvider>
  
    }
  />
    {/* <Route path="/shop/:id" element={<ShopHomePage />}/> */}
  


    
       
        
     
        {/*
        <Route
          path="/dashboard-orders"
          element={
           
              <ShopAllOrders />
            
          }
        />
        <Route
          path="/dashboard-refunds"
          element={
        
              <ShopAllRefunds />
            
          }
        />

        <Route
          path="/order/:id"
          element={
              <ShopOrderDetails />
            
          }
        />
 

        <Route
          path="/dashboard-coupouns"
          element={
           
              <ShopAllCoupouns />
            
          }
        />
        <Route
          path="/dashboard-withdraw-money"
          element={
           
              <ShopWithDrawMoneyPage />
            
          }
        />
        <Route
          path="/dashboard-messages"
          element={
            
              <ShopInboxPage />
           
          }
        /> */}

      {/* Admin */}
    <Route path ="/admin" element ={<AdminDashboardPage/>}/> 
    <Route path = "/categories" element ={<AdminDashboardCategories/>}/>
    <Route path = "/users" element ={<AdminDashboardUsers/>}/>
    <Route path = "/shops" element ={<AdminDashboardSellers/>}/>
    <Route path = "admin/products" element ={<AdminDashboardProducts/>}/>


      </Routes>
      </BrowserRouter>
    
  );
}

export default App;













// import React, { useEffect, useState } from "react";
// import "./App.css";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import {
//   LoginPage,
//   SignupPage,
//   ActivationPage,
//   HomePage,
//   ProductsPage,
//   BestSellingPage,
//   EventsPage,
//   FAQPage,
//   CheckoutPage,
//   PaymentPage,
//   OrderSuccessPage,
//   ProductDetailsPage,
//   ProfilePage,
//   ShopCreatePage,
//   SellerActivationPage,
//   ShopLoginPage,
//   OrderDetailsPage,
//   TrackOrderPage,
//   UserInbox,
// } from "./routes/Routes.js";
// import {
//   ShopDashboardPage,
//   ShopCreateProduct,
//   ShopAllProducts,
//   ShopCreateEvents,
//   ShopAllEvents,
//   ShopAllCoupouns,
//   ShopPreviewPage,
//   ShopAllOrders,
//   ShopOrderDetails,
//   ShopAllRefunds,
//   ShopSettingsPage,
//   ShopWithDrawMoneyPage,
//   ShopInboxPage,
// } from "./routes/ShopRoutes";
// import {
//   AdminDashboardPage,
//   AdminDashboardUsers,
//   AdminDashboardSellers,
//   AdminDashboardOrders,
//   AdminDashboardProducts,
//   AdminDashboardEvents,
//   AdminDashboardWithdraw
// } from "./routes/AdminRoutes";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import Store from "./redux/store";
// import { loadSeller, loadUser } from "./redux/actions/user";
// import ProtectedRoute from "./routes/ProtectedRoute";
// import ProtectedAdminRoute from "./routes/ProtectedAdminRoute";
// import { ShopHomePage } from "./ShopRoutes.js";
// import SellerProtectedRoute from "./routes/SellerProtectedRoute";
// import { getAllProducts } from "./redux/actions/product";
// import { getAllEvents } from "./redux/actions/event";
// import axios from "axios";
// import { server } from "./server";
// import { Elements } from "@stripe/react-stripe-js";
// import { loadStripe } from "@stripe/stripe-js";

//  = () => {
//   const [stripeApikey, setStripeApiKey] = useState("");

//   async function getStripeApikey() {
//     const { data } = await axios.get(`${server}/payment/stripeapikey`);
//     setStripeApiKey(data.stripeApikey);
//   }
//   useEffect(() => {
//     Store.dispatch(loadUser());
//     Store.dispatch(loadSeller());
//     Store.dispatch(getAllProducts());
//     Store.dispatch(getAllEvents());
//     getStripeApikey();
//   }, []);

//   return (
//     <BrowserRouter>
//       {stripeApikey && (
//         <Elements stripe={loadStripe(stripeApikey)}>
//           <Routes>
//             <Route
//               path="/payment"
//               element={
//                 <ProtectedRoute>
//                   <PaymentPage />
//                 </ProtectedRoute>
//               }
//             />
//           </Routes>
//         </Elements>
//       )}
//       <Routes>
//         <Route path="/" element={<HomePage />} />
//         <Route path="/login" element={<LoginPage />} />
//         <Route path="/sign-up" element={<SignupPage />} />
//         <Route
//           path="/activation/:activation_token"
//           element={<ActivationPage />}
//         />
//         <Route
//           path="/seller/activation/:activation_token"
//           element={<SellerActivationPage />}
//         />
//         <Route path="/products" element={<ProductsPage />} />
//         <Route path="/product/:id" element={<ProductDetailsPage />} />
//         <Route path="/best-selling" element={<BestSellingPage />} />
//         <Route path="/events" element={<EventsPage />} />
//         <Route path="/faq" element={<FAQPage />} />
//         <Route
//           path="/checkout"
//           element={
//             <ProtectedRoute>
//               <CheckoutPage />
//             </ProtectedRoute>
//           }
//         />
//         <Route path="/order/success" element={<OrderSuccessPage />} />
//         <Route
//           path="/profile"
//           element={
//             <ProtectedRoute>
//               <ProfilePage />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/inbox"
//           element={
//             <ProtectedRoute>
//               <UserInbox />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/user/order/:id"
//           element={
//             <ProtectedRoute>
//               <OrderDetailsPage />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/user/track/order/:id"
//           element={
//             <ProtectedRoute>
//               <TrackOrderPage />
//             </ProtectedRoute>
//           }
//         />
//         <Route path="/shop/preview/:id" element={<ShopPreviewPage />} />
//         {/* shop Routes */}
//         <Route path="/shop-create" element={<ShopCreatePage />} />
//         <Route path="/shop-login" element={<ShopLoginPage />} />
//         <Route
//           path="/shop/:id"
//           element={
//            
//               <ShopHomePage />
//             
//           }
//         />
//         <Route
//           path="/settings"
//           element={
//            
//               <ShopSettingsPage />
//             
//           }
//         />
//         <Route
//           path="/dashboard"
//           element={
//            
//               <ShopDashboardPage />
//             
//           }
//         />
//         <Route
//           path="/dashboard-create-product"
//           element={
//            
//               <ShopCreateProduct />
//             
//           }
//         />
//         <Route
//           path="/dashboard-orders"
//           element={
//            
//               <ShopAllOrders />
//             
//           }
//         />
//         <Route
//           path="/dashboard-refunds"
//           element={
//            
//               <ShopAllRefunds />
//             
//           }
//         />

//         <Route
//           path="/order/:id"
//           element={
//            
//               <ShopOrderDetails />
//             
//           }
//         />
//         <Route
//           path="/dashboard-products"
//           element={
//            
//               <ShopAllProducts />
//             
//           }
//         />
//         <Route
//           path="/dashboard-create-event"
//           element={
//            
//               <ShopCreateEvents />
//             
//           }
//         />
//         <Route
//           path="/dashboard-events"
//           element={
//            
//               <ShopAllEvents />
//             
//           }
//         />
//         <Route
//           path="/dashboard-coupouns"
//           element={
//            
//               <ShopAllCoupouns />
//             
//           }
//         />
//         <Route
//           path="/dashboard-withdraw-money"
//           element={
//            
//               <ShopWithDrawMoneyPage />
//             
//           }
//         />
//         <Route
//           path="/dashboard-messages"
//           element={
//            
//               <ShopInboxPage />
//             
//           }
//         />
//         {/* Admin Routes */}
//         <Route
//           path="/admin/dashboard"
//           element={
//             <ProtectedAdminRoute>
//               <AdminDashboardPage />
//             </ProtectedAdminRoute>
//           }
//         />
//         <Route
//           path="/admin-users"
//           element={
//             <ProtectedAdminRoute>
//               <AdminDashboardUsers />
//             </ProtectedAdminRoute>
//           }
//         />
//         <Route
//           path="/admin-sellers"
//           element={
//             <ProtectedAdminRoute>
//               <AdminDashboardSellers />
//             </ProtectedAdminRoute>
//           }
//         />
//         <Route
//           path="/admin-orders"
//           element={
//             <ProtectedAdminRoute>
//               <AdminDashboardOrders />
//             </ProtectedAdminRoute>
//           }
//         />
//          <Route
//           path="/admin-products"
//           element={
//             <ProtectedAdminRoute>
//               <AdminDashboardProducts />
//             </ProtectedAdminRoute>
//           }
//         />
//          <Route
//           path="/admin-events"
//           element={
//             <ProtectedAdminRoute>
//               <AdminDashboardEvents />
//             </ProtectedAdminRoute>
//           }
//         />
//          <Route
//           path="/admin-withdraw-request"
//           element={
//             <ProtectedAdminRoute>
//               <AdminDashboardWithdraw />
//             </ProtectedAdminRoute>
//           }
//         />
//       </Routes>
//       <ToastContainer
//         position="bottom-center"
//         autoClose={5000}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//         theme="dark"
//       />
//     </BrowserRouter>
//   );
// };


