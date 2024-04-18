import React, { useEffect } from "react";
import Footer from "../components/Layout/Footer";
import Header from "../components/Layout/Header";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const OrderSuccessPage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    getTransactionStatus();
  }, []);
  

  const server ="http://localhost:5000"
  const getTransactionStatus = async () => {
    try {
      console.log('hello transactions');
      const token = localStorage.getItem("pesapalToken");
      
      const urlParams = new URLSearchParams(window.location.search);
      const trackingId = urlParams.get('OrderTrackingId');

      const response = await axios.get(`https://cybqa.pesapal.com/pesapalv3/api/Transactions/GetTransactionStatus?orderTrackingId=${trackingId}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      console.log("Transaction status:", response.data);
      const paymentInfo = {
        ...response.data // Initialize response.data to paymentInfo
      };
      console.log("payment info ",paymentInfo);
      const paymentStatusCode = response.data.payment_status_description;
      
      if (paymentStatusCode === "Failed") {
        alert("The transaction was terminated by the user.");
        // Redirect to checkout or any other appropriate page
        window.location.href = '/checkout';
      } else if (paymentStatusCode === "Completed") {
        const orderInfo = JSON.parse(localStorage.getItem("latestOrder")); // Retrieve order information from localhost
        if (orderInfo) {
          console.log("order info",orderInfo)
          const transactionData = {
            paymentInfo:paymentInfo,
            orderInfo: orderInfo // Append order information
          };
          console.log("TRANSACTION data",transactionData)
          console.log("orderInfo",orderInfo)
          await sendToDatabase(transactionData); // Send transaction data to the database
          alert("Order successful!");
          console.log(orderInfo)
          console.log("orderId",response.data.orderId)
          navigate(`/profile`);
        } else {
          // Handle case where order information couldn't be retrieved
          alert(" error retrieving order information.");
        }
      } else if(paymentStatusCode === "INVALID") {
        alert("Unknown payment status. Kindly try again.");
        // Redirect to checkout or any other appropriate page
        window.location.href = '/checkout';
      }
    } catch (error) {
      console.error("Error retrieving transaction status:", error.message);
    }
  };

  const sendToDatabase = async (transactionData) => {
    try {
      // const config = {
      //   // Add any headers or configurations required for your request
      // };
      // Send order data to your backend for creating the order
      await axios
        .post(`${server}/order/create-order`, transactionData)
        .then((res) => {
          // setOpen(false); // Close any modal or dialog box related to the order process
          // navigate("/order/success"); // Redirect the user to the order success page
        // Display a success toast message
          localStorage.setItem("cartItems", JSON.stringify([])); // Clear the cart items stored in the localStorage
          localStorage.removeItem("latestOrder"); // Clear the latest order stored in the localStorage
          window.location.reload(); // Reload the page to reflect the changes (optional)
        });
    } catch (error) {
      console.error("Error sending transaction data to the database:", error.message);
      // Handle error while sending data to the database
    }
  };
  

  return (
    <div>
      <Header />
      <Success />
      <Footer />
    </div>
  );
};

const Success = () => {
  const defaultOptions = {
    loop: false,
    autoplay: true,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <div>
      {/* <Lottie options={defaultOptions} width={300} height={300} /> */}
      <h5 className="text-center mb-14 text-[25px] text-[#000000a1]">
        Processing your order  😍
      </h5>
      <br />
      <br />
    </div>
  );
};

export default OrderSuccessPage;
