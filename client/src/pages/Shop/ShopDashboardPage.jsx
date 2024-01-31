import React from "react";

import DashboardHeader from "../../components/Shop/Layout/DashboardHeader";
// import DashboardHero from "../../components/Shop/DashboardHero";
import DashboardSide from "../../components/Shop/Layout/DashboardSide";
const ShopDashboardPage = () => {
  return (
        <div>
          <DashboardHeader />
          <div className="flex items-start justify-between w-full">
            hi
             <div className="w-[80px] 800px:w-[330px]">
              <DashboardSide active={1} />
            </div> 
              {/* <DashboardHero /> */}
          </div> 
        </div> 
  );
};

export default ShopDashboardPage;
