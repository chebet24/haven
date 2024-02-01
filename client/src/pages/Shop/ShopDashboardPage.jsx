import React, { useEffect } from "react";
import { useLocation } from 'react-router-dom';

import DashboardHeader from "../../components/Shop/Layout/DashboardHeader";
import DashboardSide from "../../components/Shop/Layout/DashboardSide";

const ShopDashboardPage = () => {
  const location = useLocation();
  const isSeller = location.state?.isSeller;
  const shop = location.state?.shop ;

  useEffect(() => {
    // Log seller information when the component mounts
    console.log("Seller Information:", isSeller);
  }, [isSeller]);

  return (
    <div>
      <h1>Welcome to the Dashboard</h1>
      {isSeller !== undefined ? (
        <>
          <p>{isSeller ? 'You are a seller' : 'You are not a seller'}</p>
          {/* <div>
        <h2>Seller Information:</h2>
        <p>Name: {shop.name}</p>
        {/* Add other shop details as needed */}
      {/* </div>  */}
          <DashboardHeader isSeller={isSeller} shop={shop} />
           {/* <div className="flex items-start justify-between w-full">
            <div className="w-[80px] 800px:w-[330px]">
              <DashboardSide active={1} />
            </div>
            {/* <DashboardHero /> */}
          {/* </div> */} 
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ShopDashboardPage;
