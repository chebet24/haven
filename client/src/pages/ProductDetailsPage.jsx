import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

import Header from "../components/Layout/Header";
import ProductDetails from "../components/products/ProductDetails";
// import SuggestedProduct from "../components/products/SuggestedProducts";
import axios from "axios";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);

  const searchParams = new URLSearchParams(window.location.search);
  const isEvent = searchParams.get("isEvent");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const endpoint = isEvent ? ` http://localhost:5000/events/${id}` : ` http://localhost:5000/product/${id}`;
        const response = await axios.get(endpoint);
        const fetchedData = response.data;
        if (isEvent) {
          setEventData(fetchedData);
        } else {
          setData(fetchedData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isEvent]);

  return (
    <div>
      <Header />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ProductDetails data={isEvent ? eventData : data} />
      )}
      {/* {!isEvent && data && <SuggestedProduct data={data} />} */}
     
    </div>
  );
};

export default ProductDetailsPage;
