import React, { useEffect, useState } from "react";
import styles from "../../../styles/style";
import ProductCard from "../ProductCard/ProductCard";
import CircularProgress from "@mui/material/CircularProgress";

const BestDeals = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/product/all");
        const products = await response.json();
        // Sort products based on sold_out property
        const sortedData = products.sort((a, b) => b.sold_out - a.sold_out);
        const firstFive = sortedData.slice(0, 5);
        setData(firstFive);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <div className={`${styles.section}`}>
        <div className={`${styles.heading}`}>
          <h1>Best Deals</h1>
        </div>
        {isLoading ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
            <CircularProgress />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12 border-0">
            {data && data.map((product, index) => <ProductCard data={product} key={index} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default BestDeals;
