import React, { useState, useEffect } from "react";
import { MdClose } from "react-icons/md";
import { BsCartPlus } from "react-icons/bs";
import styles from "../../styles/style";
import { AiOutlineHeart } from "react-icons/ai";


const Wishlist = ({ setOpenWishlist }) => {
  const storedWishlist =
    JSON.parse(localStorage.getItem("wishlistItems")) || [];
  const [wishlist, setWishlist] = useState(storedWishlist);

  useEffect(() => {
    localStorage.setItem("wishlistItems", JSON.stringify(wishlist));
  }, [wishlist]);

  const removeFromWishlistHandler = (itemId) => {
    const updatedWishlist = wishlist.filter((item) => item._id !== itemId);
    setWishlist(updatedWishlist);
  };

  const addToCartHandler = (item) => {
    const newItem = { ...item, qty: 1 };
    // Perform the action to add to the cart
    // ...

    // Optional: If you want to remove the item from the wishlist after adding to the cart
    removeFromWishlistHandler(item._id);
    setOpenWishlist(false);
  };

  return (
    <div className="fixed top-0 left-0 w-full bg-[#0000004b] h-screen z-10">
      <div className="fixed top-0 right-0 h-full w-[80%] overflow-y-scroll 800px:w-[25%] bg-white flex flex-col justify-between shadow-sm">
        {wishlist && wishlist.length === 0 ? (
          <div className="w-full h-screen flex items-center justify-center">
            <div className="flex w-full justify-end pt-5 pr-5 fixed top-3 right-3">
              <MdClose
                size={25}
                className="cursor-pointer"
                onClick={() => setOpenWishlist(false)}
              />
            </div>
            <h5>Wishlist Items is empty!</h5>
          </div>
        ) : (
          <>
            <div>
              <div className="flex w-full justify-end pt-5 pr-5">
                <MdClose
                  size={25}
                  className="cursor-pointer"
                  onClick={() => setOpenWishlist(false)}
                />
              </div>
              {/* Item length */}
              <div className={`${styles.noramlFlex} p-4`}>
                <AiOutlineHeart size={25} />
                <h5 className="pl-2 text-[20px] font-[500]">
                  {wishlist && wishlist.length} items
                </h5>
              </div>

              {/* wishlist Single Items */}
              <br />
              <div className="w-full border-t">
                {wishlist &&
                  wishlist.map((item, index) => (
                    <WishlistSingle
                      key={index}
                      item={item}
                      removeFromWishlistHandler={removeFromWishlistHandler}
                      addToCartHandler={addToCartHandler}
                    />
                  ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const WishlistSingle = ({ item, removeFromWishlistHandler, addToCartHandler }) => {
  return (
    <div className="border-b p-4">
      <div className="w-full flex items-center">
        <MdClose
          className="cursor-pointer 800px:mb-['unset'] 800px:ml-['unset'] mb-2 ml-2"
          onClick={() => removeFromWishlistHandler(item._id)}
        />
        <img
          src={`${item?.images[0]?.url}`}
          alt=""
          className="w-[130px] h-min ml-2 mr-2 rounded-[5px]"
        />

        <div className="pl-[5px]">
          <h1>{item.name}</h1>
          <h4 className="font-[600] pt-3 800px:pt-[3px] text-[17px] text-[#d02222] font-Roboto">
            ${item.discountPrice}
          </h4>
          <BsCartPlus
            size={20}
            className="cursor-pointer"
            title="Add to cart"
            onClick={() => addToCartHandler(item)}
          />
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
