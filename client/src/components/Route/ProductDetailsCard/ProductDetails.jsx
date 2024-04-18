import React, { useEffect, useState } from "react";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineMessage,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
import { Link } from "react-router-dom";
import styles from "../../../styles/style";
import { toast } from "react-toastify";
import axios from "axios";

const ProductDetailsCard = ({ setOpen, data, wishlist, setWishlist }) => {
  const [count, setCount] = useState(1);
  const [click, setClick] = useState(false);
  const [cart, setCart] = useState([]);
  const [shopInfo, setShopInfo] = useState(null);

  useEffect(() => {
    const fetchShopInfo = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/shop/get/${data.shopId}`);
          setShopInfo(response.data);
          console.log("Shop Info:", response.data); 
       
      } catch (error) {
        console.error("Error fetching shop info:", error);
      }
    };

    fetchShopInfo();
  }, [data]);

  useEffect(() => {
    const isItemInWishlist = wishlist && wishlist.find((i) => i._id === data._id);
    setClick(!!isItemInWishlist);
  }, [wishlist]);

  const removeFromWishlistHandler = () => {
    setClick(false);
    setWishlist((prevWishlist) => prevWishlist.filter((item) => item._id !== data._id));
  };

  const addToWishlistHandler = () => {
    setClick(true);
    const dataToSave = { ...data };
    const updatedWishlist = [...wishlist, dataToSave];
    setWishlist(updatedWishlist);
    localStorage.setItem("wishlistItems", JSON.stringify(updatedWishlist));
    toast.success("Item added to wishlist successfully!");
  };

  const addToCartHandler = () => {
    const isItemExists = cart && cart.find((i) => i._id === data._id);
    if (isItemExists) {
      toast.error("Item already in cart!");
    } else {
      if (data.stock < count) {
        toast.error("Product stock limited!");
      } else {
        const dataToSave = { ...data };
        const cartData = { ...dataToSave, qty: count };
        setCart((prevCart) => [...prevCart, cartData]);
        localStorage.setItem("cartItems", JSON.stringify([...cart, cartData]));
        toast.success("Item added to cart successfully!");
      }
    }
  };

  const decrementCount = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

  const incrementCount = () => {
    setCount(count + 1);
  };

  const handleMessageSubmit = () => {
    // Implement your message submission logic here
  };

  return (
    <div className="bg-[#fff]">
      {data ? (
        <div className="fixed w-full h-screen top-0 left-0 bg-[#00000030] z-40 flex items-center justify-center">
          <div className="w-[90%] 800px:w-[60%] h-[90vh] overflow-y-scroll 800px:h-[75vh] bg-white rounded-md shadow-sm relative p-4">
            <RxCross1
              size={30}
              className="absolute right-3 top-3 z-50"
              onClick={() => setOpen(false)}
            />

            <div className="block w-full 800px:flex">
              <div className="w-full 800px:w-[50%]">
                <img src={`${data.images && data.images[0]}`} alt="" />
                <div className="flex">
                <Link to={`/shop/preview/${data.shopId}`} className="flex">
                    <img
                      src={`${shopInfo?.shop?.avatar}`}
                      alt=""
                      className="w-[50px] h-[50px] rounded-full mr-2"
                    />
                    <div>
                      <h3 className={`${styles.shop_name}`}>{shopInfo?.name}</h3> {/* Updated shop name */}
                      <h5 className="pb-3 text-[15px]">{data?.ratings} Ratings</h5>
                    </div>
                  </Link>
                </div>
               
                <h5 className="text-[16px] text-[red] mt-5">{data.sold_out} Sold out</h5>
              </div>
              <div className="w-full 800px:w-[50%] pt-5 pl-[5px] pr-[5px]">
                <h1 className={`${styles.productTitle} text-[20px]`}>
                  {data.name}
                </h1>
                <p>{data.description}</p>

                <div className="flex pt-3">
                  <h4 className={`${styles.productDiscountPrice}`}>
                    {data.discountPrice}$
                  </h4>
                  <h3 className={`${styles.price}`}>
                    {data.originalPrice ? data.originalPrice + "$" : null}
                  </h3>
                </div>
                <div className="flex items-center mt-12 justify-between pr-3">
                  <div>
                    <button
                      className="bg-gradient-to-r from-teal-400 to-teal-500 text-white font-bold rounded-l px-4 py-2 shadow-lg hover:opacity-75 transition duration-300 ease-in-out"
                      onClick={decrementCount}
                    >
                      -
                    </button>
                    <span className="bg-gray-200 text-gray-800 font-medium px-4 py-[11px]">
                      {count}
                    </span>
                    <button
                      className="bg-gradient-to-r from-teal-400 to-teal-500 text-white font-bold rounded-l px-4 py-2 shadow-lg hover:opacity-75 transition duration-300 ease-in-out"
                      onClick={incrementCount}
                    >
                      +
                    </button>
                  </div>
                  <div>
                    {click ? (
                      <AiFillHeart
                        size={30}
                        className="cursor-pointer"
                        onClick={removeFromWishlistHandler}
                        color={click ? "red" : "#333"}
                        title="Remove from wishlist"
                      />
                    ) : (
                      <AiOutlineHeart
                        size={30}
                        className="cursor-pointer"
                        onClick={addToWishlistHandler}
                        title="Add to wishlist"
                      />
                    )}
                  </div>
                </div>
                <div
                  className={`${styles.button} mt-6 rounded-[4px] h-11 flex items-center`}
                  onClick={addToCartHandler}
                >
                  <span className="text-[#fff] flex items-center">
                    Add to cart <AiOutlineShoppingCart className="ml-1" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ProductDetailsCard;


             
