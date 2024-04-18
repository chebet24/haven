import { toast } from "react-toastify";
import React, { useEffect, useState } from "react";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import styles from "../../styles/style";
import ProductDetailsInfo from "./ProductDetailsinfo";

const ProductDetails = ({ data }) => {
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const [count, setCount] = useState(1);
  const [click, setClick] = useState(false);
  const [select, setSelect] = useState(0);

  useEffect(() => {
    // Load wishlist from localStorage
    const savedWishlist = localStorage.getItem("wishlistItems");
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist));
    }

    // Load cart from localStorage
    const savedCart = localStorage.getItem("cartItems");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }

    if (wishlist.find((item) => item._id === data?._id)) {
      setClick(true);
    } else {
      setClick(false);
    }
  }, [data]);

  useEffect(() => {
    // Update localStorage whenever wishlist changes
    localStorage.setItem("wishlistItems", JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    // Update localStorage whenever cart changes
    localStorage.setItem("cartItems", JSON.stringify(cart));
  }, [cart]);

  const incrementCount = () => {
    setCount(count + 1);
  };

  const decrementCount = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

  const removeFromWishlistHandler = () => {
    const updatedWishlist = wishlist.filter((item) => item._id !== data._id);
    setWishlist(updatedWishlist);
  };

  const addToWishlistHandler = () => {
    const isItemExists = wishlist.find((item) => item._id === data._id);
    if (isItemExists) {
      toast.error("Item already in wishlist!");
    } else {
      const updatedWishlist = [...wishlist, data];
      setWishlist(updatedWishlist);
      toast.success("Item added to wishlist successfully!");
    }
  };

  const addToCartHandler = () => {
    const isItemExists = cart.find((item) => item._id === data._id);
    if (isItemExists) {
      toast.error("Item already in cart!");
    } else {
      if (data.stock < 1) {
        toast.error("Product stock limited!");
      } else {
        const cartData = { ...data, qty: count };
        const updatedCart = [...cart, cartData];
        setCart(updatedCart);
        toast.success("Item added to cart successfully!");
      }
    }
  };

  return (
    <div className="bg-white">
      {data ? (
        <div className={`${styles.section}`}>
           {/* w-[90%] 800px:w-[80%] */}
          <div className="w-full py-5">
            <div className="block w-full 800px:flex">
              <div className="w-full 800px:w-[50%]">
                <img
                  src={`${data && data.images[select]}`}
                  alt=""
                  className="w-[80%]"
                />
                <div className="w-full flex">
                  {data &&
                    data.images.map((i, index) => (
                      <div
                        className={`${
                          select === index ? "border" : ""
                        } cursor-pointer`}
                        key={index}
                        onClick={() => setSelect(index)}
                      >
                        <img
                          src={`${i?.url}`}
                          alt=""
                          className="h-[200px] overflow-hidden mr-3 mt-3"
                        />
                      </div>
                    ))}
                </div>
              </div>
              <div className="w-full 800px:w-[50%] pt-5">
              <div className="flex pt-3">
                  {data.originalPrice === data.discountPrice ? (
                  <h3 className={`$`}>
                    {data.originalPrice}KSH:
                    </h3>
                    ) : (
                    <>
                    <h4 className={`${styles.productDiscountPrice}`}>
                      {data.discountPrice}KSH:
                      </h4>
                      <h3 className={`${styles.price}`}>
                        {data.originalPrice}KSH:
                        </h3>
                        </>
                        )}
                        </div>
                <h1 className={`${styles.productTitle}`}>{data.name} </h1> <p>{data.description}</p>
                <p className="detail-item">{data.ratings} ratings | {data.reviews.length} reviews |{data.sold_out} sold</p>
                <div className="mt-6">
                  <h2 className="font-bold text-lg mb-2">Color:</h2>
                  {/* Display color information here */}
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
                        color={click ? "red" : "#333"}
                        title="Add to wishlist"
                      />
                    )}
                  </div>
                </div>
                <div
                  className={`${styles.button} !mt-6 !rounded !h-11 flex items-center`}
                  onClick={addToCartHandler}
                >
                  <span className="text-white flex items-center">
                    Add to cart <AiOutlineShoppingCart className="ml-1" />
                  </span>
                </div>
              </div>
            </div>
          </div>
          <h1>Related items </h1>
          {/* <Recommender system/> */}
          <ProductDetailsInfo 
          data={data}/>
        </div>
      ) : null}
    </div>
  );
};

export default ProductDetails;
