import React, { useEffect } from "react";
import { Button, Table } from "antd";
// import "antd/dist/antd.css";
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getAllProductsShop, deleteProduct } from "../../redux/actions/product";
import Loader from "../Layout/Loader";

const AllProducts = () => {
  const { products, isLoading } = useSelector((state) => state.products);
  const { seller } = useSelector((state) => state.seller);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllProductsShop(seller._id));
  }, [dispatch]);

  const handleDelete = (id) => {
    dispatch(deleteProduct(id));
    window.location.reload();
  };

  const columns = [
    { dataIndex: "id", title: "Product Id", width: 150, ellipsis: true },
    { dataIndex: "name", title: "Name", width: 180, ellipsis: true },
    { dataIndex: "price", title: "Price", width: 100, ellipsis: true },
    { dataIndex: "stock", title: "Stock", type: "number", width: 80, ellipsis: true },
    { dataIndex: "sold", title: "Sold out", type: "number", width: 130, ellipsis: true },
    {
      title: "Preview",
      width: 100,
      render: (_, record) => (
        <Link to={`/product/${record.id}`}>
          <Button>
            <AiOutlineEye size={20} />
          </Button>
        </Link>
      ),
    },
    {
      title: "Delete",
      width: 120,
      render: (_, record) => (
        <Button onClick={() => handleDelete(record.id)}>
          <AiOutlineDelete size={20} />
        </Button>
      ),
    },
  ];

  const dataSource = products.map((item) => ({
    id: item._id,
    name: item.name,
    price: "US$ " + item.discountPrice,
    stock: item.stock,
    sold: item?.sold_out,
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

export default AllProducts;
