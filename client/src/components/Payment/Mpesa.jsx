import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '../../context/UserContext'; // Importing useUser hook from UserContext

const Mpesa = () => {
  const [showConfirmation, setShowConfirmation] = useState(true); // Set showConfirmation to true by default
  const [showVerify, setShowVerify] = useState(false);
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [token, setToken] = useState("");
  const [trackingId, setTrackingId] = useState("");
  const [latestOrder, setLatestOrder] = useState(null);

  // Using useUser hook to access user context
  const { user } = useUser();

  useEffect(() => {
    // Fetch latest order from localStorage
    const storedOrder = JSON.parse(localStorage.getItem("latestOrder"));
    if (storedOrder) {
      setLatestOrder(storedOrder);
      setAmount(storedOrder.totalPrice); // Set amount from the latest order
      setPhone(storedOrder.user.phoneNumber); // Set phone from the latest order
    }

    // Check if URL params contain necessary information for verification


  }, [trackingId, token]);

  const createTokenAndRegisterIPN = async () => {
    const data = JSON.stringify({
      "consumer_key": "qkio1BGGYAXTu2JOfm7XSXNruoZsrqEW",
      "consumer_secret": "osGQ364R49cXKeOYSpaOnT++rHs="
    });

    try {
      const tokenResponse = await axios.post("https://cybqa.pesapal.com/pesapalv3/api/Auth/RequestToken", data, {
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        }
      });

      const tokenData = tokenResponse.data;
      const token = tokenData.token;
      console.log(token)
      setToken(token);
          localStorage.setItem("pesapalToken", token);


      const ipnRegistrationUrl = "https://cybqa.pesapal.com/pesapalv3/api/URLSetup/RegisterIPN";

      const ipnData = JSON.stringify({
        "url": "http://localhost:5000/payment/ipn",
        "ipn_notification_type": "GET"
      });
      console.log("ipn data is ",ipnData);

      const ipnHeaders = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      };

      const ipnResponse = await axios.post(ipnRegistrationUrl, ipnData, { headers: ipnHeaders });

      const ipnResponseData = ipnResponse.data;
      const ipnId = ipnResponseData.ipn_id;
      const ipnUrl = ipnResponseData.url;

      console.log("IPN registration successful");
      console.log("IPN ID:", ipnId);
      console.log("IPN URL:", ipnUrl);

      return { token, ipnId, ipnUrl };
    } catch (error) {
      console.error("Error:", error.message);
      throw error;
    }
  };



  const handlePayment = async () => {
    try {
    
      const { token, ipnId } = await createTokenAndRegisterIPN();
      const merchantReference = Math.floor(Math.random() * 1000000000000000000);
      const callbackUrl = 'http://localhost:3000/order/success';
      

      const headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      };

      const data = {
        "id": `${merchantReference}`,
        "currency": "KES",
        "amount": amount,
        "description": "Payment description goes here",
        "callback_url": `${callbackUrl}`,
        "notification_id": `${ipnId}`,
        "branch": "Haventure",
        "billing_address": {
          "email_address": `${user.email}`, // Using userEmail from user context
          "phone_number": phone,
          "country_code": "KE",
          "line_1": "Pesapal Limited",
          "line_2": "",
          "city": "",
          "state": "",
          "postal_code": "",
          "zip_code": ""
        }
        
      };
      console.log("data information",data)
      const response = await axios.post("https://cybqa.pesapal.com/pesapalv3/api/Transactions/SubmitOrderRequest", data, { headers });
      console.log("Order submission successful:");
      console.log("data response ",response.data);
      const redirectURL = response.data.redirect_url;
      window.location.href = redirectURL;
      const  orderTrackingId= response.data.order_tracking_id;
      setTrackingId(orderTrackingId);
      console.log('order tracking id:', orderTrackingId);
      // setShowVerify(true);
    } catch (error) {
      console.error("Error submitting order:", error.message);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
      }
      
    }
  };



  return ( 
    <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50">
    <div className="bg-white p-8 rounded-lg w-80 h-auto">
      {!showConfirmation ? null : (
        <div>
          <h1 className="text-2xl font-bold mb-4">My Order Information</h1>
          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between mb-2">
              <span className="font-semibold">Number:</span>
              <span>{phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Amount:</span>
              <span>{amount}</span>
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button className="bg-blue-500 text-white rounded py-2 px-4 mr-4 hover:bg-blue-600" onClick={handlePayment}>Pay</button>
            {/* {showVerify && (
              <button className="bg-blue-500 text-white rounded py-2 px-4 hover:bg-blue-600" onClick={getTransactionStatus}>Verify Payment</button>
            )} */}
          </div>
        </div>
      )}
    </div>
  </div>);
}  

export default Mpesa;
