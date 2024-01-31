import React from "react";
import { useLocation } from 'react-router-dom';

import DashboardHeader from "../../components/Shop/Layout/DashboardHeader";
import DashboardSide from "../../components/Shop/Layout/DashboardSide";

const ShopDashboardPage = () => {
  const location = useLocation();
  const isSeller = location.state?.isSeller;

  return (
    <div>
      <h1>Welcome to the Dashboard</h1>
      {isSeller !== undefined ? (
        <>
          <p>{isSeller ? 'You are a seller' : 'You are not a seller'}</p>
          <DashboardHeader />
          <div className="flex items-start justify-between w-full">
            <div className="w-[80px] 800px:w-[330px]">
              <DashboardSide active={1} />
            </div>
            {/* <DashboardHero /> */}
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ShopDashboardPage;
