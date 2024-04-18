import React, { useState } from 'react';
import { FaCreditCard, FaMobile, FaMoneyBill } from 'react-icons/fa';

import Mpesa from './Mpesa';

const Payment = () => {
  const [paymentMethod, setPaymentMethod] = useState('');
  const [showMpesaModal, setShowMpesaModal] = useState(false); // State to control the visibility of the M-Pesa modal

  const handleSelectPaymentMethod = (method) => {
    setPaymentMethod(method);
    if (method === 'mpesa') {
      setShowMpesaModal(true); // Show the M-Pesa modal when selected
    }
  };

  const cashOnDeliveryHandler = async (e) => {
    e.preventDefault();
    // Your cash on delivery logic here
  };

  return (
    <div className="flex flex-col items-center mt-10">
      <h1 className="text-2xl font-bold mb-4">Choose Your Payment Method</h1>
      <div className="flex items-center space-x-4 mb-4">
        <div
          className="flex items-center cursor-pointer"
          onClick={() => handleSelectPaymentMethod('mpesa')}
        >
          <FaMobile size={32} color="#e74c3c" /> {/* Red color */}
          <span className="ml-2">Pesapal</span>
        </div>
      </div>

      {/* Cash on Delivery */}
      <div className="flex flex-col items-center mb-4">
        <div className="w-full pb-5 border-b mb-2">
          <div
            className="w-[25px] h-[25px] rounded-full bg-transparent border-[3px] border-[#1d1a1ab4] relative flex items-center justify-center"
          >
            <div className="w-[13px] h-[13px] bg-[#1d1a1acb] rounded-full" />
          </div>
          <h4 className="text-[18px] pl-2 font-[600] text-[#000000b1]">
            Cash on Delivery
          </h4>
        </div>

        <div className="w-full flex">
          <form className="w-full" onSubmit={cashOnDeliveryHandler}>
            <input
              type="submit"
              value="Confirm"
              className="bg-[#f63b60] text-white h-[45px] rounded-[5px] cursor-pointer text-[18px] font-[600]"
            />
          </form>
        </div>
      </div>
      {/* Cash on Delivery End */}
      {showMpesaModal && ( // Render the M-Pesa modal if showMpesaModal is true
        <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg">
            <Mpesa />
            <button
              onClick={() => setShowMpesaModal(false)} // Close the modal when clicked
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <button className="bg-blue-500 text-white rounded py-2 px-4 hover:bg-blue-600">
        Proceed to Payment
      </button>
    </div>
  );
};

export default Payment;
