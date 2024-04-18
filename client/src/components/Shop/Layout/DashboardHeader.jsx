import React, { useEffect, useState } from "react";
import { AiOutlineGift } from "react-icons/ai";
import { MdOutlineLocalOffer } from "react-icons/md";
import { FiPackage, FiShoppingBag } from "react-icons/fi";
import { BiMessageSquareDetail } from "react-icons/bi";
import { Link } from "react-router-dom";
import { useSeller } from "../../../context/SellerContext";

const DashboardHeader = () => {
  const { userData } = useSeller();
  const email = userData?.email;
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isSeller, shop } = userData;

  useEffect(() => {
    const fetchSellerData = async () => {
      try {
        console.log(`Fetching data for seller: http://localhost:5000/shop/${email}`);
        const response = await fetch(`http://localhost:5000/shop/${email}`, {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch seller data. Status: ${response.status}`);
        }

        const data = await response.json();

        setSeller(data.shop);
        console.log('Fetched seller data:', data);
      } catch (error) {
        console.error('Error during fetch:', error);
        // Handle the error as needed
      } finally {
        setLoading(false); // Set loading to false after the fetch is complete
      }
    };

    if (email) {
      fetchSellerData();
    }
  }, [email]);

  return (
    <div className="w-full h-[80px] bg-red shadow sticky top-0 left-0 z-30 flex items-center justify-between px-4">
      <div>
        <Link to="/shop/dashboard">
          <img src="" alt="avatar" />
        </Link>
        <p>{userData?.isSeller ? `Welcome ${seller?.name}` : 'You are not a seller'}</p>
      </div>
      {!loading && seller && ( // Check if seller is not null before rendering content
        <div className="flex items-center">
          <div className="flex items-center mr-4">
            <Link to="/shop/dashboard-coupons" className="lg:block ">
              <AiOutlineGift
                color="#555"
                size={30}
                className="mx-5 cursor-pointer"
              />
            </Link>
            <Link to="/shop/dashboard-events" className="lg:block">
              <MdOutlineLocalOffer
                color="#555"
                size={30}
                className="mx-5 cursor-pointer"
              />
            </Link>
            <Link to="/shop/dashboard-products" className="lg:block">
              <FiShoppingBag
                color="#555"
                size={30}
                className="mx-5 cursor-pointer"
              />
            </Link>
            <Link to="/shop/dashboard-orders" className="lg:block">
              <FiPackage color="#555" size={30} className="mx-5 cursor-pointer" />
            </Link>
            <Link to="/shop/dashboard-messages" className="lg:block">
              <BiMessageSquareDetail
                color="#555"
                size={30}
                className="mx-5 cursor-pointer"
              />
            </Link>
            {seller.avatar && (
              <Link to={`/shop/${seller._id}`}>
                <img
                  src={seller.avatar}
                  alt=""
                  className="w-[50px] h-[50px] rounded-full object-cover"
                />
              </Link>
            )}
          </div>
        </div>
      )}
      {console.log('Seller:', seller)}
      {console.log('Is Seller:', isSeller)}
      {console.log('Loading:', loading)}
    </div>
  );
};

export default DashboardHeader;
