import React, { useEffect, useState } from "react";
import { productData } from "../../static/data";
import styles from "../../styles/style";
import ProductCard from "../Route/ProductCard/ProductCard";

const SuggestedProduct = ({ data }) => {
  const [productData, setProductData] = useState([]);

  useEffect(() => {
    // Fetch the product data or set it from some other source
    // For example, you can fetch it from an API endpoint
    // const fetchProductData = async () => {
    //   const response = await fetch("/api/products");
    //   const data = await response.json();
    //   setProductData(data);
    // };
    // fetchProductData();

    // For demonstration purposes, using the provided static data
    const d = productData.filter((i) => i.category === data.category);
    setProductData(d);
  }, [data]);

  return (
    <div>
      {data ? (
        <div className={`p-4 ${styles.section}`}>
          <h2
            className={`${styles.heading} text-[25px] font-[500] border-b mb-5`}
          >
            Related Product
          </h2>
          <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12">
             {
                productData.map((i, index) => (
                    <ProductCard data={i} key={index} />
                ))
             }
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default SuggestedProduct;
