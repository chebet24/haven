import React, { useState, useEffect } from "react";
import { MdClose } from "react-icons/md";
import { HiOutlineMinus, HiPlus } from "react-icons/hi";
import { Link } from "react-router-dom";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";

const Cart = () => {
  const storedCart = JSON.parse(localStorage.getItem("cartItems")) || [];
  const [cart, setCart] = useState(storedCart);

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cart));
  }, [cart]);

  const removeFromCartHandler = (itemId) => {
    const updatedCart = cart.filter((item) => item._id !== itemId);
    setCart(updatedCart);
  };

  const totalPrice = cart.reduce(
    (acc, item) => acc + item.qty * item.discountPrice,
    0
  );

  const quantityChangeHandler = (updatedItem) => {
    const updatedCart = cart.map((item) =>
      item._id === updatedItem._id ? updatedItem : item
    );
    setCart(updatedCart);
  };

  const increment = (item) => {
    if (item.stock < item.qty + 1) {
      // Handle limited stock case
    } else {
      const updatedItem = { ...item, qty: item.qty + 1 };
      quantityChangeHandler(updatedItem);
    }
  };

  const decrement = (item) => {
    const updatedItem = { ...item, qty: item.qty === 1 ? 1 : item.qty - 1 };
    quantityChangeHandler(updatedItem);
  };

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex-grow p-4 bg-gray-100 flex">
        <div className="w-3/4">
          <h1 className="text-2xl font-semibold mb-4">Shopping Cart</h1>
          {cart && cart.length === 0 ? (
            <div className="flex flex-grow items-center justify-center">
              <h5>Your cart is empty!</h5>
            </div>
          ) : (
            <>
              {cart.map((item, index) => (
                <CartSingle
                  key={index}
                  item={item}
                  quantityChangeHandler={quantityChangeHandler}
                  removeFromCartHandler={removeFromCartHandler}
                  increment={increment}
                  decrement={decrement}
                />
              ))}
            </>
          )}
        </div>
        <div className="w-1/4 ml-4">
          <OrderSummary cart={cart} totalPrice={totalPrice} />
        </div>
      </div>
      <div>Top picks </div>
      <div>
        <>
        <Footer/>
        </>
        </div>
    </div>
  );
};

const CartSingle = ({
    item,
    quantityChangeHandler,
    removeFromCartHandler,
    increment,
    decrement,
    storeName,
  }) => {
    const totalPrice = item.discountPrice * item.qty;
  
    return (
      <div className="border p-4 mb-4 flex flex-col ">
        {/* Store Name */}
        <Link to="/shop/homepage" className="inline-block">
            <h2 className="text-lg font-bold mb-2 text-left">{item.shop.name}</h2>
            </Link>

        {/* Product Details */}
        <div className="flex items-center justify-between w-full">
          {/* Product Image */}
         
          <div className="mr-4">
            <img
              src={item?.images[0]}
              alt=""
              className="w-24 h-24 rounded-md"
            />
          </div>
          {/* Product Info */}
          <div className="flex-grow flex flex-col">
            {/* Product Name */}
            <h3 className="text-base font-semibold mb-1">{item.name}</h3>
            {/* Price */}
            <h4 className="text-gray-600">KSH {item.discountPrice}</h4>
            {/* Quantity Controls */}
            <div className="flex items-center mt-2">
              <button
                onClick={() => decrement(item)}
                className="rounded-full bg-gray-200 text-gray-600 w-8 h-8 flex items-center justify-center hover:bg-gray-300"
              >
                <HiOutlineMinus />
              </button>
              <div className="mx-2">{item.qty}</div>
              <button
                onClick={() => increment(item)}
                className="rounded-full bg-gray-200 text-gray-600 w-8 h-8 flex items-center justify-center hover:bg-gray-300"
              >
                <HiPlus />
              </button>
            </div>
          </div>
          {/* Total Price and Remove Button */}
          <div className="flex items-center ml-4">
            <div className="text-gray-600">Total: KSH {totalPrice}</div>
            <button
              onClick={() => removeFromCartHandler(item._id)}
              className="text-red-500 hover:text-red-600 ml-2"
            >
              <MdClose size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  };
  
const OrderSummary = ({ cart, totalPrice }) => {
  return (
    <div className="bg-white p-4 rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
      {cart.map((item, index) => (
        <div key={index} className="flex justify-between mb-2">
          <span>{item.name}</span>
          <span>KSH {item.qty * item.discountPrice}</span>
        </div>
      ))}
      <div className="flex justify-between mb-2 border-t pt-2">
        <span>Subtotal:</span>
        <span>KSH {totalPrice}</span>
      </div>
      <Link to="/checkout">
        <button className="w-full py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
          Checkout Now
        </button>
      </Link>
    </div>
  );
};

export default Cart;
