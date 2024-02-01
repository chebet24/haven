import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { SyncLoader } from "react-spinners"; // Import SyncLoader from react-spinners

import Header from "../components/Layout/Header";
import ProductCard from "../components/Route/ProductCard/ProductCard";
import styles from "../styles/style";

const ProductsPage = () => {
  const [searchParams] = useSearchParams();
  const categoryData = searchParams.get("category");
  const [allProducts, setAllProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/product/all`
        );
        setAllProducts(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []); // The empty dependency array ensures the useEffect runs only once on mount

  useEffect(() => {
    if (categoryData === null) {
      setData(allProducts);
    } else {
      setData(allProducts.filter((i) => i.title.includes(categoryData)));
    }
  }, [allProducts, categoryData]);

  return (
    <>
      <div>
        <Header activeHeading={3} />
        <br />
        <br />
        <div className={`${styles.section}`}>
          {isLoading ? (
            <div className="text-center">
              <SyncLoader color="#36D7B7" size={15} margin={5} />
            </div>
          ) : (
            <div  className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12">
            {data.map((i, index) => (
              <ProductCard data={i} key={index} />
            ))}
          </div>
          
          
          )}
          {data.length === 0 && !isLoading ? (
            <h1 className="text-center w-full pb-[100px] text-[20px]">
              No products Found!
            </h1>
          ) : null}
        </div>
        {/* Footer component goes here if you have one */}
      </div>
    </>
  );
};

export default ProductsPage;
 