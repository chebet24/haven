import React from "react";
import { AiOutlineGift } from "react-icons/ai";
import { MdOutlineLocalOffer } from "react-icons/md";
import { FiPackage, FiShoppingBag } from "react-icons/fi";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BiMessageSquareDetail } from "react-icons/bi";


const DashboardHeader = (props) => {
  const email = props.location?.state?.email;
  const [seller, setSeller] = useState(null);

  useEffect(() => {
    const fetchSellerData = async () => {
      try {
        const response = await fetch(`https://localhost:5000/api/shop/${email}`, {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch seller data');
        }

        const data = await response.json();
        setSeller(data.seller);
        console.log(data.seller)
      } catch (error) {
        console.error('Error during fetch:', error);
        // Handle the error as needed
      }
    };

    if (email) {
      fetchSellerData();
    }
  }, [email]);

  return (
    <div className="w-full h-[80px] bg-red shadow sticky top-0 left-0 z-30 flex items-center justify-between px-4">
      <div>
        <Link to="/dashboard">
          <img
            src=""
            alt="avatar"
          />
        </Link>
      </div>
      {seller && ( // Check if seller is not null before rendering content
        <div className="flex items-center">
          <div className="flex items-center mr-4">
          <Link to="/dashboard/cupouns" className="800px:block hidden">
            <AiOutlineGift
              color="#555"
              size={30}
              className="mx-5 cursor-pointer"
            />
          </Link>
          <Link to="/dashboard-events" className="800px:block hidden">
            <MdOutlineLocalOffer
              color="#555"
              size={30}
              className="mx-5 cursor-pointer"
            />
          </Link>
          <Link to="/dashboard-products" className="800px:block hidden">
            <FiShoppingBag
              color="#555"
              size={30}
              className="mx-5 cursor-pointer"
            />
          </Link>
          <Link to="/dashboard-orders" className="800px:block hidden">
            <FiPackage color="#555" size={30} className="mx-5 cursor-pointer" />
          </Link>
          <Link to="/dashboard-messages" className="800px:block hidden">
            <BiMessageSquareDetail
              color="#555"
              size={30}
              className="mx-5 cursor-pointer"
            />
          </Link>
            {/* ... (rest of the component) */}
            <Link to={`/shop/${seller.email}`}>
              <img
                src={`${seller.avatar?.url}`}
                alt=""
                className="w-[50px] h-[50px] rounded-full object-cover"
              />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardHeader;
