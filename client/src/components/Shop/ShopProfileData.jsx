import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import styles from "../../styles/style";
import ProductCard from "../Route/ProductCard/ProductCard";
import Ratings from "../products/Ratings";

const ShopProfileData = ({ isOwner }) => {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [events, setEvents] = useState([]);
  const [active, setActive] = useState(1);
  const server ="http://localhost:5000";

  useEffect(() => {
    const fetchShopData = async () => {
      try {
        const productsResponse = await axios.get(`${server}/product/shop/${id}`);
        setProducts(productsResponse.data);

        const eventsResponse = await axios.get(`${server}/event/shop/${id}`);
        setEvents(eventsResponse.data);
      } catch (error) {
        console.error("Error fetching shop data:", error);
      }
    };

    fetchShopData();
  }, [id]);

  const allReviews = products.map((product) => product.reviews).flat();

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <div className="w-full flex">
          <div className="flex items-center" onClick={() => setActive(1)}>
            <h5
              className={`font-[600] text-[20px] ${
                active === 1 ? "text-red-500" : "text-[#333]"
              } cursor-pointer pr-[20px]`}
            >
              Shop Products
            </h5>
          </div>
          <div className="flex items-center" onClick={() => setActive(2)}>
            <h5
              className={`font-[600] text-[20px] ${
                active === 2 ? "text-red-500" : "text-[#333]"
              } cursor-pointer pr-[20px]`}
            >
              Running Events
            </h5>
          </div>

          <div className="flex items-center" onClick={() => setActive(3)}>
            <h5
              className={`font-[600] text-[20px] ${
                active === 3 ? "text-red-500" : "text-[#333]"
              } cursor-pointer pr-[20px]`}
            >
              Shop Reviews
            </h5>
          </div>
        </div>
        <div>
          {isOwner && (
            <div>
              <Link to="/shop/dashboard">
                <div className={`${styles.button} !rounded-[4px] h-[42px]`}>
                  <span className="text-[#fff]">Go Dashboard</span>
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>

      <br />
      {active === 1 && (
        <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-3 lg:gap-[25px] xl:grid-cols-4 xl:gap-[20px] mb-12 border-0">
          {products.map((i, index) => (
            <ProductCard data={i} key={index} isShop={true} />
          ))}
        </div>
      )}

      {active === 2 && (
        <div className="w-full">
          <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-3 lg:gap-[25px] xl:grid-cols-4 xl:gap-[20px] mb-12 border-0">
            {events.map((i, index) => (
              <ProductCard data={i} key={index} isShop={true} isEvent={true} />
            ))}
          </div>
          {events.length === 0 && (
            <h5 className="w-full text-center py-5 text-[18px]">
              No Events available for this shop!
            </h5>
          )}
        </div>
      )}

      {active === 3 && (
        <div className="w-full">
          {allReviews.map((item, index) => (
            <div className="w-full flex my-4" key={index}>
              <img
                src={`${item.user.avatar?.url}`}
                className="w-[50px] h-[50px] rounded-full"
                alt=""
              />
              <div className="pl-2">
                <div className="flex w-full items-center">
                  <h1 className="font-[600] pr-2">{item.user.name}</h1>
                  <Ratings rating={item.rating} />
                </div>
                <p className="font-[400] text-[#000000a7]">{item?.comment}</p>
                <p className="text-[#000000a7] text-[14px]">{"2 days ago"}</p>
              </div>
            </div>
          ))}
          {allReviews.length === 0 && (
            <h5 className="w-full text-center py-5 text-[18px]">
              No Reviews available for this shop!
            </h5>
          )}
        </div>
      )}
    </div>
  );
};

export default ShopProfileData;

               
