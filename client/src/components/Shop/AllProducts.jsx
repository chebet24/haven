import React, { useEffect, useState } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Paper,
} from "@mui/material";
import { Link } from "react-router-dom";
import axios from "axios";

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/product/all`); // Replace with your API endpoint
        setProducts(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setIsLoading(false);
      }
    };

    fetchProducts();
  },[]);
  //  [seller._id]

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/product/${id}`); // Replace with your API endpoint

      // Update the product list
      const updatedProducts = products.filter((product) => product._id !== id);
      setProducts(updatedProducts);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <>
      {isLoading ? (
        <div className="w-full mx-8 pt-1 mt-10 bg-white text-center">
          <CircularProgress size={80} />
        </div>
      ) : (
        <div className="w-full mx-8 pt-1 mt-10 bg-white">
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  {/* Your table header cells here */}
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell>{item._id}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{`US$ ${item.discountPrice}`}</TableCell>
                    <TableCell>{item.stock}</TableCell>
                    <TableCell>{item?.sold_out}</TableCell>
                    <TableCell>
                    <Link to={`/product/${item._id}`}>
                       <Button>
                         Preview
                         </Button>
                         </Link>

                    </TableCell>
                    <TableCell>
                      <Button onClick={() => handleDelete(item.id)}>
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )}
    </>
  );
};

export default AllProducts;
