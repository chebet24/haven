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
import { useSeller } from "../../context/SellerContext";

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  // const [isLoading, setIsLoading] = useState(true);
  const { userData ,isLoading} = useSeller();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const shopId = userData?.shop?._id ;
        console.log(shopId)
        if (!shopId) {
          console.log('shop not there');
          // Handle the case when shopId is not available
          return;
        }
      
        const response = await axios.get(`http://localhost:5000/product/shop/${shopId}`); // Replace with your API endpoint
        setProducts(response.data);
        // setIsLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        // setIsLoading(false);
      }
    };

    fetchProducts();
  },[ userData]);
  //  [seller._id]

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/product/delete/${id}`); // Replace with your API endpoint

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
          hello
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
                    <TableCell>{`KSH ${item.originalPrice}`}</TableCell>
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
                      <Button onClick={() => handleDelete(item._id)}>
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