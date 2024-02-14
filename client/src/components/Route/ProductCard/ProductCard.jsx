// ProductCard.js
import React, { useState, useEffect } from "react";
import { AiFillHeart, AiOutlineEye, AiOutlineShoppingCart,AiOutlineHeart } from "react-icons/ai";
import { Link } from "react-router-dom";
import styles from "../../../styles/style";
import ProductDetailsCard from "../ProductDetailsCard/ProductDetails";
import Ratings from "../../products/Ratings";
import { toast } from "react-toastify";

const ProductCard = ({ data }) => {
  const [click, setClick] = useState(false);
  const [open, setOpen] = useState(false);

  const [cart, setCart] = useState(
    localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems"))
      : []
  );
  const [wishlist, setWishlist] = useState(
    localStorage.getItem("wishlistItems")
      ? JSON.parse(localStorage.getItem("wishlistItems"))
      : []
  );
  
  useEffect(() => {
    if (wishlist && wishlist.find((i) => i._id === data._id)) {
      setClick(true);
    } else {
      setClick(false);
    }
  }, [wishlist]);
  
  const removeFromWishlistHandler = (data) => {
    setClick(!click);
    const updatedWishlist = wishlist.filter((item) => item._id !== data._id);
    setWishlist(updatedWishlist);
    localStorage.setItem("wishlistItems", JSON.stringify(updatedWishlist));
  };
  
  const addToWishlistHandler = (data) => {
    setClick(!click);
    // shop: { name: data.shop.name, _id: data.shop._id }
    // Omit circular references before saving to local storage
    const dataToSave = { ...data };
  
    const updatedWishlist = [...wishlist, dataToSave];
    setWishlist(updatedWishlist);
  
    // Use JSON.stringify with a replacer function to handle circular references
    localStorage.setItem("wishlistItems", JSON.stringify(updatedWishlist, replacer));
    toast.success("Item added to wishlist successfully!");
  };
  
  const addToCartHandler = (id) => {
    const isItemExists = cart && cart.find((i) => i._id === id);
    if (isItemExists) {
      toast.error("Item already in cart!");
    } else {
      if (data.stock < 1) {
        toast.error("Product stock limited!");
      } else {
        // shop: { name: data.shop.name, _id: data.shop._id }
        // Omit circular references before saving to local storage
        const dataToSave = { ...data ,
          window: undefined,  // Omit 'window' property
          self: undefined };
  
        const cartData = { ...dataToSave, qty: 1 };
        const updatedCart = [...cart, cartData];
        setCart(updatedCart);
  
        // Use JSON.stringify with a replacer function to handle circular references
        localStorage.setItem("cartItems", JSON.stringify(updatedCart, replacer));
        toast.success("Item added to cart successfully!");
      }
    }
  };
  
  // replacer function to handle circular references
  const replacer = (key, value) => {
    if (key === 'window' || key === 'stateNode' || key === '__reactFiber$ulba6t54hzf') {
      return undefined;
    }
    return value;
  };
  

  return (
 <>
      <div className="w-full h-[370px] bg-white rounded-lg shadow-sm p-3 relative cursor-pointer">
      {/* ${ isEvent === true ? `/product/${data._id}?isEvent=true`: `/product/${data._id}`} */}
      <Link to={``} >
         <img
           src={`${data.images && data.images[0]}`}
           alt=""
           className="w-full h-[170px] object-contain"
         />
      </Link>
        {/* <Link to={`/shop/preview/${data?.shop._id}`}>
          <h5 className={`${styles.shop_name}`}>{data.shop.name}</h5>
        </Link> */}
        <Link to={`/product/${data._id}`}>
          <h4 className="pb-3 font-[500]">
            {data.name.length > 40 ? data.name.slice(0, 40) + "..." : data.name}
          </h4>

          <div className="flex">
            <Ratings rating={data?.ratings} />
          </div>

          <div className="py-2 flex items-center justify-between">
            <div className="flex">
              <h5 className={`${styles.productDiscountPrice}`}>
                {data.originalPrice === 0 ? data.originalPrice : data.discountPrice}$
              </h5>
              <h4 className={`${styles.price}`}>
                {data.originalPrice ? data.originalPrice + " $" : null}
              </h4>
            </div>
            <span className="font-[400] text-[17px] text-[#68d284]">
              {data?.sold_out} sold
            </span>
          </div>
        </Link>

        {/* side options */}
        <div>
          {click ? (
            <AiFillHeart
              size={22}
              className="cursor-pointer absolute right-2 top-5"
              onClick={removeFromWishlistHandler}
              color={click ? "red" : "#333"}
              title="Remove from wishlist"
            />
          ) : (
            <AiOutlineHeart
              size={22}
              className="cursor-pointer absolute right-2 top-5"
              onClick={addToWishlistHandler}
              color={click ? "red" : "#333"}
              title="Add to wishlist"
            />
          )}
          <AiOutlineEye
            size={22}
            className="cursor-pointer absolute right-2 top-14"
            onClick={() => setOpen(!open)}
            color="#333"
            title="Quick view"
          />
          <AiOutlineShoppingCart
            size={25}
            className="cursor-pointer absolute right-2 top-24"
            onClick={() => addToCartHandler(data._id)}
            color="#444"
            title="Add to cart"
          />
          {open ? <ProductDetailsCard setOpen={setOpen} data={data} wishlist={wishlist} setWishlist={setWishlist} /> : null}
        </div>
      </div>
    </>
  );
};

export default ProductCard;
