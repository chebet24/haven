import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  CircularProgress,
  FormControl,
  InputLabel,
  Input,
  Select,
  MenuItem,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
} from "@mui/material";
import { AiOutlineDelete } from "react-icons/ai";
import axios from "axios";
import { toast } from "react-toastify";
import { useSeller } from "../../context/SellerContext";

const AllCoupons = () => {
  const [name, setName] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [value, setValue] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const { userData } = useSeller();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (!userData || !userData.shop || !userData.shop._id) {
          console.error("Shop data not available.");
          return;
        }
        const shopId = userData.shop._id;
        const productsResponse = await axios.get(`http://localhost:5000/product/shop/${shopId}`);
        const couponsResponse = await axios.get(`http://localhost:5000/coupon/shop/${shopId}`);
        setProducts(productsResponse.data);
        setCoupons(couponsResponse.data);
      } catch (error) {
        toast.error("Error fetching data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userData]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/coupon/delete-coupon/${id}`);
      toast.success("Coupon code deleted successfully!");
      setCoupons(coupons.filter((coupon) => coupon._id !== id));
    } catch (error) {
      toast.error("Error deleting coupon");
    }
  };

  const handleSubmit = async () => {
    try {
      if (!selectedProduct) {
        toast.error("Please select a product!");
        return;
      }

      const response = await axios.post("http://localhost:5000/coupon/create", {
        name,
        value,
        minAmount,
        maxAmount,
        selectedProduct,
        shopId: userData.shop._id,
      });

      if (response.data.success) {
        toast.success("Coupon code created successfully!");
        setCoupons([...coupons, response.data.couponCode]);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error creating coupon");
    }
  };

  const columns = [
    { field: "id", headerName: "Id", width: 150 },
    { field: "name", headerName: "Coupon Code", width: 180 },
    { field: "price", headerName: "Value", width: 100 },
    {
      field: "Delete",
      headerName: "Delete",
      width: 120,
      renderCell: (params) => (
        <Button variant="text" color="primary" onClick={() => handleDelete(params.row.id)}>
          <AiOutlineDelete size={20} />
        </Button>
      ),
    },
  ];

  return (
    <div className="w-full max-w-[800px] mx-auto bg-white shadow rounded p-4">
      <h2 className="text-2xl font-semibold mb-4 text-center">Coupons Management</h2>
      <div className="modal-content" style={{ width: "400px" }}>
        <FormControl fullWidth className="mb-4">
          <InputLabel htmlFor="name">Name</InputLabel>
          <Input
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your coupon code name..."
          />
        </FormControl>
        <FormControl fullWidth className="mb-4">
          <InputLabel htmlFor="value">Discount Percentage</InputLabel>
          <Input
            id="value"
            type="text"
            required
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter your coupon code value..."
          />
        </FormControl>
        <FormControl fullWidth className="mb-4">
          <InputLabel htmlFor="minAmount">Min Amount</InputLabel>
          <Input
            id="minAmount"
            type="number"
            value={minAmount}
            onChange={(e) => setMinAmount(e.target.value)}
            placeholder="Enter your coupon code min amount..."
          />
        </FormControl>
        <FormControl fullWidth className="mb-4">
          <InputLabel htmlFor="maxAmount">Max Amount</InputLabel>
          <Input
            id="maxAmount"
            type="number"
            value={maxAmount}
            onChange={(e) => setMaxAmount(e.target.value)}
            placeholder="Enter your coupon code max amount..."
          />
        </FormControl>
        <FormControl fullWidth className="mb-4">
          <InputLabel htmlFor="selectedProduct">Selected Product</InputLabel>
          <Select
            id="selectedProduct"
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {products.map((product) => (
              <MenuItem value={product.name} key={product._id}>
                {product.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="contained" color="primary" className="w-full" onClick={handleSubmit}>
          Create
        </Button>
      </div>
      <TableContainer component={Paper} className="mt-4">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Coupon Code</TableCell>
              <TableCell>Value</TableCell>
              <TableCell>Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {coupons.map((coupon) => (
              <TableRow key={coupon._id}>
                <TableCell>{coupon._id}</TableCell>
                <TableCell>{coupon.name}</TableCell>
                <TableCell>{`${coupon.value} %`}</TableCell>
                <TableCell>
                  <Button
                    variant="text"
                    color="primary"
                    onClick={() => handleDelete(coupon._id)}
                  >
                    <AiOutlineDelete size={20} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default AllCoupons;
