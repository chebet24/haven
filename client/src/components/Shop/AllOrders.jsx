import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AiOutlineArrowRight } from "react-icons/ai";
import { useSeller } from "../../context/SellerContext";
import axios from "axios";
import { Button, CircularProgress } from "@mui/material";
import { useTable } from "react-table";

const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { userData } = useSeller();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        if (userData && userData.shop && userData.shop._id) {
          const response = await axios.get(`http://localhost:5000/order/get-seller-all-orders/${userData.shop._id}`);
          console.log("Orders:", response.data.orders); 
          setOrders(response.data.orders);
        } else {
          console.error("Shop ID is undefined");
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (userData) {
      fetchOrders();
    }
  }, [userData]); // Update the dependency array

  const columns = React.useMemo(
    () => [
      { Header: "Order ID", accessor: "id" },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ value }) => (
          <span className={value === "Delivered" ? "greenColor" : "redColor"}>
            {value}
          </span>
        ),
      },
      { Header: "Total", accessor: "total" },
      {
        Header: "",
        accessor: "link",
        Cell: ({ row }) => (
          <Link to={`/shop/order/${row.original.id}`}>
            <Button variant="contained" color="primary">
              <AiOutlineArrowRight size={20} />
            </Button>
          </Link>
        ),
      },
    ],
    []
  );
  

  const data = React.useMemo(
    () =>
      orders.map((order) => ({
        id: order._id,
        status: order.status,
        total: `KSH: ${order.totalPrice}`,
      })),
    [orders]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data });

  return (
    <>
      {userData ? (
        isLoading ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
            <CircularProgress />
          </div>
        ) : (
          <div style={{ width: "100%", margin: "0 8px", paddingTop: "1px", marginTop: "10px", backgroundColor: "white" }}>
            <table {...getTableProps()} style={{ borderCollapse: "collapse", width: "100%" }}>
              <thead>
                {headerGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <th {...column.getHeaderProps()} style={{ borderBottom: "2px solid black", padding: "8px" }}>
                        {column.render("Header")}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()}>
                {rows.map((row) => {
                  prepareRow(row);
                  return (
                    <tr {...row.getRowProps()}>
                      {row.cells.map((cell) => (
                        <td {...cell.getCellProps()} style={{ borderBottom: "1px solid black", padding: "8px" }}>
                          {cell.render("Cell")}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )
      ) : (
        <div>Loading seller data...</div>
      )}
    </>
  );
};

export default AllOrders;
