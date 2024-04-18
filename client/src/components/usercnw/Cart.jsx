import React, { useState, useEffect } from "react";
import { MdClose } from "react-icons/md";
import { IoBagHandleOutline } from "react-icons/io5";
import { HiOutlineMinus, HiPlus } from "react-icons/hi";
import styles from "../../styles/style";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const Cart = ({ setOpenCart }) => {
  const storedCart =
    JSON.parse(localStorage.getItem("cartItems")) || [];
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
      toast.error("Product stock limited!");
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
    <div className="fixed top-0 left-0 w-full bg-[#0000004b] h-screen z-10">
      <div className="fixed top-0 right-0 h-full w-[80%] 800px:w-[25%] bg-white flex flex-col overflow-y-scroll justify-between shadow-sm">
        {cart && cart.length === 0 ? (
          <div className="w-full h-screen flex items-center justify-center">
            <div className="flex w-full justify-end pt-5 pr-5 fixed top-3 right-3">
              <MdClose
                size={25}
                className="cursor-pointer"
                onClick={() => setOpenCart(false)}
              />
            </div>
            <h5>Cart Items is empty!</h5>
          </div>
        ) : (
          <>
            <div>
              <div className="flex w-full justify-end pt-5 pr-5">
                <MdClose
                  size={25}
                  className="cursor-pointer"
                  onClick={() => setOpenCart(false)}
                />
              </div>
              {/* Item length */}
              <div className={`${styles.noramlFlex} p-4`}>
                <IoBagHandleOutline size={25} />
                <h5 className="pl-2 text-[20px] font-[500]">
                  {cart && cart.length} items
                </h5>
              </div>

              {/* cart Single Items */}
              <br />
              <div className="w-full border-t">
                {cart &&
                  cart.map((item, index) => (
                    <CartSingle
                      key={index}
                      item={item}
                      quantityChangeHandler={quantityChangeHandler}
                      removeFromCartHandler={removeFromCartHandler}
                      increment={increment}
                      decrement={decrement}
                    />
                  ))}
              </div>
            </div>
            <div className="px-5 mb-3">
            <Link to={"/cart"}>
              <div className= {`h-[20px] flex items-center justify-center w-[100%] bg-[#e44343] rounded-[5px]`}> 
              View Cart
              </div>
            </Link>
            </div>

            <div className="px-5 mb-3">
              {/* checkout buttons */}
              <Link to="/checkout">
                <div
                  className={`h-[45px] flex items-center justify-center w-[100%] bg-[#e44343] rounded-[5px]`}
                >
                  <h1 className="text-[#fff] text-[18px] font-[600]">
                    Checkout Now (KSH:{totalPrice})
                  </h1>
                </div>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const CartSingle = ({ item, quantityChangeHandler, removeFromCartHandler, increment, decrement }) => {
  const totalPrice = item.discountPrice * item.qty;

  return (
    <div className="border-b p-4">
      <div className="w-full flex items-center">
        <div>
          <div
            className={`bg-[#e44343] border border-[#e4434373] rounded-full w-[25px] h-[25px] ${styles.noramlFlex} justify-center cursor-pointer`}
            onClick={() => increment(item)}
          >
            <HiPlus size={18} color="#fff" />
          </div>
          <span className="pl-[10px]">{item.qty}</span>
          <div
            className="bg-[#a7abb14f] rounded-full w-[25px] h-[25px] flex items-center justify-center cursor-pointer"
            onClick={() => decrement(item)}
          >
            <HiOutlineMinus size={16} color="#7d879c" />
          </div>
        </div>
        <img
          src={item?.images[0]}
          alt=""
          className="w-[130px] h-min ml-2 mr-2 rounded-[5px]"
        />
        <div className="pl-[5px]">
          <h1>{item.name}</h1>
          <h4 className="font-[400] text-[15px] text-[#00000082]">
            KSH:{item.discountPrice} * {item.qty}
          </h4>
          <h4 className="font-[600] text-[17px] pt-[3px] text-[#d02222] font-Roboto">
            KSH:{totalPrice}
          </h4>
        </div>
        <MdClose
          className="cursor-pointer"
          onClick={() => removeFromCartHandler(item._id)}
        />
      </div>
    </div>
  );
};

export default Cart;








