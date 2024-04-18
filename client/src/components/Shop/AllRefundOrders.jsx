import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { AiOutlineArrowRight } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useSeller } from "../../context/SellerContext";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import { useTable } from "react-table";

// Define columns outside of the component
const columns = [
  { Header: "Order ID", accessor: "id", width: 150 },
  { Header: "Status", accessor: "status", width: 130 },
  { Header: "Items Qty", accessor: "itemsQty", width: 130 },
  { Header: "Total", accessor: "total", width: 130 },
  {
    Header: "",
    accessor: "actions",
    width: 150,
    Cell: ({ row }) => (
      <Link to={`/shop/order/${row.original.id}`}>
        <Button>
          <AiOutlineArrowRight size={20} />
        </Button>
      </Link>
    ),
  },
];

const AllRefundOrders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { userData } = useSeller();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        console.log("Fetching orders...");
        setIsLoading(true);
        if (userData && userData.shop && userData.shop._id) {
          console.log("Shop ID:", userData.shop._id);
          const response = await axios.get(`http://localhost:5000/order/get-seller-all-orders/${userData.shop._id}`);
          console.log("Response data:", response.data);
          setOrders(response.data.orders);
        } else {
          console.error("Shop ID is undefined");
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        console.log("Finished fetching orders.");
        setIsLoading(false);
      }
    };

    if (userData) {
      fetchOrders();
    }
  }, [userData]); 

  console.log("UserData:", userData);
  console.log("Orders:", orders);

  const refundOrders =
    orders &&
    orders.filter(
      (item) =>
        item.status === "Processing refund" || item.status === "Refund Success"
    );

  // Move the data creation outside of the component
  const data = refundOrders.map((item) => ({
    id: item._id,
    itemsQty: item.cart.length,
    total: "KSH: " + item.totalPrice,
    status: item.status,
    actions: "action",
  }));

  const tableInstance = useTable({ columns, data });

  return (
    <>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <div className="w-full mx-8 pt-1 mt-10 bg-white">
          <table {...tableInstance.getTableProps()} className="table">
            <thead>
              {tableInstance.headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th {...column.getHeaderProps()}>{column.render("Header")}</th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...tableInstance.getTableBodyProps()}>
              {tableInstance.rows.map((row, i) => {
                tableInstance.prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map((cell) => {
                      return (
                        <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default AllRefundOrders;
