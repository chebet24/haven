import React, { useEffect, useState } from "react";
import styles from "../../styles/style";
import { AiOutlineArrowRight, AiOutlineMoneyCollect } from "react-icons/ai";
import { MdBorderClear } from "react-icons/md";
import { Link } from "react-router-dom";
import { DataGrid } from '@mui/x-data-grid';
import { Button } from '@mui/material';


import axios from 'axios'; // Import axios for HTTP requests

const AdminDashboard = () => {
  const [adminOrders, setAdminOrders] = useState([]);
  const [adminOrderLoading, setAdminOrderLoading] = useState(true);
  const [sellers, setSellers] = useState([]);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const ordersResponse = await axios.get("API_ENDPOINT/admin-orders");
        const sellersResponse = await axios.get("API_ENDPOINT/admin-sellers");

        setAdminOrders(ordersResponse.data);
        setSellers(sellersResponse.data);
        setAdminOrderLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setAdminOrderLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  const adminEarning = adminOrders.reduce((acc, item) => acc + item.totalPrice * 0.10, 0);
  const adminBalance = adminEarning.toFixed(2);

  const columns = [
    // Columns definition remains the same
  ];

  const row = adminOrders.map((item) => ({
    id: item._id,
    itemsQty: item.cart.reduce((acc, item) => acc + item.qty, 0),
    total: `${item.totalPrice} $`,
    status: item.status,
    createdAt: item.createdAt.slice(0, 10),
  }));

  return (
    <>
      {adminOrderLoading ? (
        // Loader component or loading message
        <div>Loading...</div>
      ) : (
        // Your component rendering logic
        <div className="w-full p-4">
        <h3 className="text-[22px] font-Poppins pb-2">Overview</h3>
        <div className="w-full block 800px:flex items-center justify-between">
          <div className="w-full mb-4 800px:w-[30%] min-h-[20vh] bg-white shadow rounded px-2 py-5">
            <div className="flex items-center">
              <AiOutlineMoneyCollect
                size={30}
                className="mr-2"
                fill="#00000085"
              />
              <h3
                className={`${styles.productTitle} !text-[18px] leading-5 !font-[400] text-[#00000085]`}
              >
                Total Earning
              </h3>
            </div>
            <h5 className="pt-2 pl-[36px] text-[22px] font-[500]">$ {adminBalance}</h5>
          </div>
  
          <div className="w-full mb-4 800px:w-[30%] min-h-[20vh] bg-white shadow rounded px-2 py-5">
            <div className="flex items-center">
              <MdBorderClear size={30} className="mr-2" fill="#00000085" />
              <h3
                className={`${styles.productTitle} !text-[18px] leading-5 !font-[400] text-[#00000085]`}
              >
                All Sellers
              </h3>
            </div>
            <h5 className="pt-2 pl-[36px] text-[22px] font-[500]">{sellers && sellers.length}</h5>
            <Link to="/admin-sellers">
              <h5 className="pt-4 pl-2 text-[#077f9c]">View Sellers</h5>
            </Link>
          </div>
  
          <div className="w-full mb-4 800px:w-[30%] min-h-[20vh] bg-white shadow rounded px-2 py-5">
            <div className="flex items-center">
              <AiOutlineMoneyCollect
                size={30}
                className="mr-2"
                fill="#00000085"
              />
              <h3
                className={`${styles.productTitle} !text-[18px] leading-5 !font-[400] text-[#00000085]`}
              >
                All Orders
              </h3>
            </div>
            <h5 className="pt-2 pl-[36px] text-[22px] font-[500]">{adminOrders && adminOrders.length}</h5>
            <Link to="/admin-orders">
              <h5 className="pt-4 pl-2 text-[#077f9c]">View Orders</h5>
            </Link>
          </div>
        </div>
  
        <br />
        <h3 className="text-[22px] font-Poppins pb-2">Latest Orders</h3>
        <div className="w-full min-h-[45vh] bg-white rounded">
          <DataGrid
            rows={row}
            columns={columns}
            pageSize={4}
            disableSelectionOnClick
            autoHeight
          />
        </div>
      </div>
      )}
    </>
  );
};

export default AdminDashboard;
