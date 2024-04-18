import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

import Header from "../components/Layout/Header";
import ProductDetails from "../components/products/ProductDetails";
// import SuggestedProduct from "../components/products/SuggestedProducts";
import axios from "axios";

import Seller from "../components/products/Seller";

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
        const endpoint = isEvent ? ` http://localhost:5000/event/${id}` : ` http://localhost:5000/product/single/${id}`;
        const response = await axios.get(endpoint);
        const fetchedData = response.data;
        if (isEvent) {
          setEventData(fetchedData);
        } else {
          setData(fetchedData);
        }
        console.log("Fetched data:", fetchedData); // Log fetched data here
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [id, isEvent]);
  
  useEffect(() => {
    console.log("Data after setting:", data);
  }, [data]);
  
  console.log("data",data)

  return (
    <div>
     <Header/>
      {loading ? (
        <p>Loading...</p>
      ) : (
      <>
      <Seller data ={ isEvent ? eventData: data}/>
        <ProductDetails data={isEvent ? eventData : data} />
        
        </>
      )}
      {/* {!isEvent && data && <SuggestedProduct data={data} />} */}
     
    </div>
  );
};

export default ProductDetailsPage;
