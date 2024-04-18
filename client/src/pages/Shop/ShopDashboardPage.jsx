import React, { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
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
    console.log("Shop ID:", seller?._id);
    console.log("Shop Name:", seller?.name);
    console.log("Is Shop:", isSeller);
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
            <DashboardHero />
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-screen">
          <p>No seller information found. Please</p>
          <Link to="/shop/login" className="ml-2 text-blue-600">
            login
          </Link>
        </div>
      )}
    </div>
  );
};

export default ShopDashboardPage;
