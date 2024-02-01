import React, { useEffect } from "react";
import { Button, Table } from "antd";
// import "antd/dist/antd.css";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Loader from "../Layout/Loader";
import { getAllOrdersOfShop } from "../../redux/actions/order";
import { AiOutlineArrowRight } from "react-icons/ai";

const AllOrders = () => {
  const { orders, isLoading } = useSelector((state) => state.order);
  const { seller } = useSelector((state) => state.seller);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllOrdersOfShop(seller._id));
  }, [dispatch]);

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

  const dataSource = orders.map((item) => ({
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
            pagination={{ pageSize: 10 }}
            scroll={{ x: 'max-content' }}
          />
        </div>
      )}
    </>
  );
};

export default AllOrders;
