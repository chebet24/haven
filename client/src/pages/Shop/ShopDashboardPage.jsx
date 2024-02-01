import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import DashboardHeader from "../../components/Shop/Layout/DashboardHeader";
import DashboardSide from "../../components/Shop/Layout/DashboardSide";
import DashboardHero from "../../components/Shop/DashboardHero";
import { useSeller } from "../../context/SellerContext";

const ShopDashboardPage = () => {
  const location = useLocation();
  const { shop, seller, isSeller } = useSeller(); // Include isSeller from useSeller

  useEffect(() => {
    // Log seller information when the component mounts
    console.log("Seller Information:", seller);

    // Add additional logging for seller properties
    console.log("Seller ID:", seller?._id);
    console.log("Seller Name:", seller?.name);
    console.log("Is Seller:", isSeller);
  }, [seller, isSeller]);

  return (
    <div>
      {seller !== null ? (
        <>

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
