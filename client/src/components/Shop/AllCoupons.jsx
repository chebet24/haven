import React, { useEffect, useState } from "react";
import { Button, Modal, Form, Input, Select, Table } from "antd";
// import "antd/dist/antd.css";
import { AiOutlineDelete } from "react-icons/ai";
// import { RxCross1 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import styles from "../../styles/style";
import Loader from "../Layout/Loader";
import { toast } from "react-toastify";

const { Option } = Select;

const AllCoupons = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [minAmount, setMinAmout] = useState(null);
  const [maxAmount, setMaxAmount] = useState(null);
  const [value, setValue] = useState(null);
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [coupouns, setCoupouns] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState(null);
  const { seller } = useSelector((state) => state.seller);
  const { products } = useSelector((state) => state.products);

  const dispatch = useDispatch();

  // Initialize server to localhost:5000
  const server = "http://localhost:5000";

  useEffect(() => {
    setIsLoading(true);
    fetch(`${server}/coupon/get-coupon/${seller._id}`, { credentials: 'include' })
      .then((response) => response.json())
      .then((data) => {
        setIsLoading(false);
        setCoupouns(data.couponCodes);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  }, [dispatch, seller._id]);

  const handleDelete = async (id) => {
    fetch(`${server}/coupon/delete-coupon/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((res) => {
        toast.success("Coupon code deleted successfully!");
        setCoupouns(coupouns.filter((coupon) => coupon._id !== id));
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const handleSubmit = async (values) => {
    try {
      const response = await fetch(`${server}/coupon/create-coupon-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          ...values,
          shopId: seller._id,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Coupon code created successfully!");
        setVisible(false);
        setCoupouns([...coupouns, data.couponCode]);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const columns = [
    { dataIndex: "id", title: "Id", key: "id", width: 150 },
    { dataIndex: "name", title: "Coupon Code", key: "name", width: 180 },
    { dataIndex: "price", title: "Value", key: "price", width: 100 },
    {
      dataIndex: "Delete",
      key: "Delete",
      width: 120,
      render: (_, record) => (
        <Button type="link" onClick={() => handleDelete(record.id)}>
          <AiOutlineDelete size={20} />
        </Button>
      ),
    },
  ];

  const dataSource = coupouns.map((item) => ({
    key: item._id,
    id: item._id,
    name: item.name,
    price: item.value + " %",
    sold: 10,
  }));

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full mx-8 pt-1 mt-10 bg-white">
          <div className="w-full flex justify-end">
            <Button
              type="primary"
              className={`${styles.button} !w-max !h-[45px] px-3 !rounded-[5px] mr-3 mb-3`}
              onClick={() => setVisible(true)}
            >
              <span className="text-white">Create Coupon Code</span>
            </Button>
          </div>
          <Table
            dataSource={dataSource}
            columns={columns}
            pagination={{ pageSize: 10 }}
            rowKey="key"
            scroll={{ x: 'max-content' }}
          />
          <Modal
            title="Create Coupon code"
            visible={visible}
            onCancel={() => setVisible(false)}
            footer={null}
          >
            <Form
              form={form}
              onFinish={handleSubmit}
              initialValues={{
                name: "",
                value: null,
                minAmount: null,
                maxAmount: null,
                selectedProducts: null,
              }}>
            <div>
              <label className="pb-2">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                required
                value={name}
                className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your coupon code name..."
              />
            </div>
            <br />
            <div>
              <label className="pb-2">
                Discount Percentenge{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="value"
                value={value}
                required
                className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                onChange={(e) => setValue(e.target.value)}
                placeholder="Enter your coupon code value..."
              />
            </div>
            <br />
            <div>
              <label className="pb-2">Min Amount</label>
              <input
                type="number"
                name="value"
                value={minAmount}
                className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                onChange={(e) => setMinAmout(e.target.value)}
                placeholder="Enter your coupon code min amount..."
              />
            </div>
            <br />
            <div>
              <label className="pb-2">Max Amount</label>
              <input
                type="number"
                name="value"
                value={maxAmount}
                className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                onChange={(e) => setMaxAmount(e.target.value)}
                placeholder="Enter your coupon code max amount..."
              />
            </div>
            <br />
            <div>
              <label className="pb-2">Selected Product</label>
              <select
                className="w-full mt-2 border h-[35px] rounded-[5px]"
                value={selectedProducts}
                onChange={(e) => setSelectedProducts(e.target.value)}
              >
                <option value="Choose your selected products">
                  Choose a selected product
                </option>
                {products &&
                  products.map((i) => (
                    <option value={i.name} key={i.name}>
                      {i.name}
                    </option>
                  ))}
              </select>
            </div>
            <br />
            <div>
              <input
                type="submit"
                value="Create"
                className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            </Form>
          </Modal>
        </div>
      )}
    </>
  );
};

export default AllCoupons;
