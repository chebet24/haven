import React, { useEffect } from "react";
import { Button, Table } from "antd";
// import "antd/dist/antd.css";
import { AiOutlineArrowRight } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getAllOrdersOfShop } from "../../redux/actions/order";
import Loader from "../Layout/Loader";

const AllRefundOrders = () => {
  const { orders, isLoading } = useSelector((state) => state.order);
  const { seller } = useSelector((state) => state.seller);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllOrdersOfShop(seller._id));
  }, [dispatch]);

  const refundOrders = orders && orders.filter((item) => item.status === "Processing refund" || item.status === "Refund Success");

  const columns = [
    { dataIndex: "id", title: "Order ID", width: 150, ellipsis: true },
    {
      dataIndex: "status",
      title: "Status",
      width: 130,
      render: (_, record) => (
        <span className={record.status === "Delivered" ? "greenColor" : "redColor"}>
          {record.status}
        </span>
      ),
    },
    { dataIndex: "itemsQty", title: "Items Qty", width: 130 },
    { dataIndex: "total", title: "Total", width: 130 },
    {
      title: "",
      width: 150,
      render: (_, record) => (
        <Link to={`/order/${record.id}`}>
          <Button>
            <AiOutlineArrowRight size={20} />
          </Button>
        </Link>
      ),
    },
  ];

  const dataSource = refundOrders.map((item) => ({
    id: item._id,
    itemsQty: item.cart.length,
    total: "US$ " + item.totalPrice,
    status: item.status,
  }));

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full mx-8 pt-1 mt-10 bg-white">
          <Table
            dataSource={dataSource}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            autoHeight
          />
        </div>
      )}
    </>
  );
};

export default AllRefundOrders;
