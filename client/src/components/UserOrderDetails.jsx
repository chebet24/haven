import React, { useEffect, useState } from "react";
import styles from "../styles/style";
import { BsFillBagFill } from "react-icons/bs";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { RxCross1 } from "react-icons/rx"; // Import RxCross1
import { AiFillStar, AiOutlineStar } from "react-icons/ai"; // Import AiFillStar and AiOutlineStar
import { useUser } from "../context/UserContext";
import { CircularProgress } from "@mui/material"; 

const UserOrderDetails = () => {
    const { user } = useUser();
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [rating, setRating] = useState(1);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true); 
  const { id } = useParams();
  const server = "http://localhost:5000";

  useEffect(() => {
    if (user) {
      fetchOrders(user._id);
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(`${server}/order/get-all/${user._id}`);
      setOrders(data.orders);
      setLoading(false);
    } catch (error) {
    //   console.error("Error fetching orders:");
      toast.error("Error fetching orders");
    }
  };
  useEffect(() => {
    fetchOrders(); // Call fetchOrders initially
}, [user?._id]);

  const data = orders.find((item) => item._id === id);
  console.log("data",data)

  const reviewHandler = async () => {
    try {
      // Fetch token from localStorage
      const token = localStorage.getItem("Token");
  
      // If token doesn't exist in localStorage, fetch it from the server
  
      // Send review request with token
      const response = await axios.put(
        `${server}/product/create-new-review`,
        {
          user,
          rating,
          comment,
          productId: selectedItem?._id,
          orderId: id,
        },
        { 
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );
  
      toast.success(response.data.message);
      fetchOrders();
      setComment("");
      setRating(1);
      setOpen(false);
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review");
    }
  };
  

  const refundHandler = async () => {
    try {
      await axios.put(`${server}/order/order-refund/${id}`, {
        status: "Processing refund",
      });
      toast.success("Refund initiated successfully!");
      fetchOrders();
    } catch (error) {
      console.error("Error initiating refund:", error);
      toast.error(error.response?.data?.message || "Failed to initiate refund");
    }
  };
  if (loading) {
    return (
        <div className="py-4 min-h-screen flex justify-center items-center">
            <CircularProgress />
        </div>
    );
}

  return (
    <div className={`py-4 min-h-screen ${styles.section}`}>
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center">
          <BsFillBagFill size={30} color="crimson" />
          <h1 className="pl-2 text-[25px]">Order Details</h1>
        </div>
      </div>

     {data && (
  <div className="w-full flex items-center justify-between pt-6">
    <h5 className="text-[#00000084]">
      Order ID: <span>#{data._id?.slice(0, 8)}</span>
    </h5>
    <h5 className="text-[#00000084]">
      Placed on: <span>{data.createdAt?.slice(0, 10)}</span>
    </h5>
  </div>
)}


      {/* order items */}
      <br />
      <br />
      {data &&
        data?.cart.map((item, index) => {
          return (
            <div key={item._id} className="w-full flex items-start mb-5">
              <img
                src={`${item.images[0]}`}
                alt=""
                className="w-[80x] h-[80px]"
              />
              <div className="w-full">
                <h5 className="pl-3 text-[20px]">{item.name}</h5>
                <h5 className="pl-3 text-[20px] text-[#00000091]">
                  KSH:{item.discountPrice} x {item.qty}
                </h5>
              </div>
              
              {!item.isReviewed && data.status === "Delivered" ? (
                <div
                  className={`${styles.button} text-[#fff]`}
                  onClick={() => setOpen(true) || setSelectedItem(item)}
                >
                  Write a review
                </div>
              ) : null}
            </div>
          );
        })}

      {/* review popup */}
     {/* Review Popup */}
     {open && (
        <div className="w-full fixed top-0 left-0 h-screen bg-[#0005] z-50 flex items-center justify-center">
          <div className="w-[50%] h-min bg-[#fff] shadow rounded-md p-3">
            <div className="w-full flex justify-end p-3">
              <RxCross1
                size={30}
                onClick={() => setOpen(false)}
                className="cursor-pointer"
              />
            </div>
            <h2 className="text-[30px] font-[500] font-Poppins text-center">
              Give a Review
            </h2>
            <br />
            <div className="w-full flex">
              <img
                src={`${selectedItem?.images[0]?.url}`}
                alt=""
                className="w-[80px] h-[80px]"
              />
              <div>
                <div className="pl-3 text-[20px]">{selectedItem?.name}</div>
                <h4 className="pl-3 text-[20px]">
                  KSH:{selectedItem?.discountPrice} x {selectedItem?.qty}
                </h4>
              </div>
            </div>

            <br />
            <br />

            {/* Ratings */}
            <h5 className="pl-3 text-[20px] font-[500]">
              Give a Rating <span className="text-red-500">*</span>
            </h5>
            <div className="flex w-full ml-2 pt-1">
              {[1, 2, 3, 4, 5].map((i) =>
                rating >= i ? (
                  <AiFillStar
                    key={i}
                    className="mr-1 cursor-pointer"
                    color="rgb(246,186,0)"
                    size={25}
                    onClick={() => setRating(i)}
                  />
                ) : (
                  <AiOutlineStar
                    key={i}
                    className="mr-1 cursor-pointer"
                    color="rgb(246,186,0)"
                    size={25}
                    onClick={() => setRating(i)}
                  />
                )
              )}
            </div>
            <br />
            <div className="w-full ml-3">
                <h1>hello</h1>
              <label className="block text-[20px] font-[500]">
                Write a comment
                <span className="ml-1 font-[400] text-[16px] text-[#00000052]">
                  (optional)
                </span>
              </label>
              <textarea
                name="comment"
                id=""
                cols="20"
                rows="5"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="How was your product? Write your expression about it!"
                className="mt-2 w-[95%] border p-2 outline-none"
              ></textarea>
            </div>
            <div
              className={`${styles.button} text-white text-[20px] ml-3`}
              onClick={rating > 1 ? reviewHandler : null}
            >
              Submit
            </div>
          </div>
        </div>
      )}

      <div className="border-t w-full text-right">
        <h5 className="pt-3 text-[18px]">
          Total Price: <strong>KSH:{data?.totalPrice}</strong>
        </h5>
      </div>
      <br />
      <br />
      <div className="w-full 800px:flex items-center">
        <div className="w-full 800px:w-[60%]">
          <h4 className="pt-3 text-[20px] font-[600]">Shipping Address:</h4>
          <h4 className="pt-3 text-[20px]">
            {data?.shippingAddress.address1 +
              " " +
              data?.shippingAddress.address2}
          </h4>
          <h4 className=" text-[20px]">{data?.shippingAddress.country}</h4>
          <h4 className=" text-[20px]">{data?.shippingAddress.city}</h4>
          <h4 className=" text-[20px]">{data?.user?.phoneNumber}</h4>
        </div>
        <div className="w-full 800px:w-[40%]">
          <h4 className="pt-3 text-[20px]">Payment Info:</h4>
          <h4>
            Status:{" "}
            {data?.paymentInfo?.payment_status_description ? data?.paymentInfo?.payment_status_description  : "Not Paid"}
          </h4>
          <br />
          {data?.status === "Delivered" && (
            <div
              className={`${styles.button} text-white`}
              onClick={refundHandler}
            >
              Give a Refund
            </div>
          )}
        </div>
      </div>
      <br />
      <Link to="/">
        <div className={`${styles.button} text-white`}>Send Message</div>
      </Link>
      <br />
      <br />
    </div>
  );
};

export default UserOrderDetails;
