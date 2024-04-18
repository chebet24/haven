const axios = require('axios');

const createTokenAndRegisterIPN = async () => {
    const data = JSON.stringify({
        "consumer_key": "2rfRlP0O5BQs9+aTJJllphuTBPsaW8T7",
        "consumer_secret": "0tNNCjTEvsOUtQfYLRuOtBzE8/s="
    });

    try {
        // Create token request
        const tokenResponse = await axios.post("https://cybqa.pesapal.com/pesapalv3/api/Auth/RequestToken", data, {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        });

        const tokenData = tokenResponse.data;
        const token = tokenData.token;

        // Register IPN request
        const ipnRegistrationUrl = "https://cybqa.pesapal.com/pesapalv3/api/URLSetup/RegisterIPN";

        const ipnData = JSON.stringify({
            "url": "http://localhost:5000/payment/ipn",
            "ipn_notification_type": "GET"
        });

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




const submitOrder = async (req,res,next) => {
    const { phone, amount,emailAddress } = req.body;

    try {
        const { token, ipnId } = await createTokenAndRegisterIPN();
        const merchantReference = Math.floor(Math.random() * 1000000000000000000);
        const callbackUrl = "http://localhost:3000/order/success";
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
            "branch": `${branch}`,
            "billing_address": {
                "email_address": `${emailAddress}`,
                "phone_number": `${phone}`,
                "country_code": "KE",
                "line_1": "Pesapal Limited",
                "line_2": "",
                "city": "",
                "state": "",
                "postal_code": "",
                "zip_code": ""
            }
        };
        const response = await axios.post("https://cybqa.pesapal.com/pesapalv3/api/Transactions/SubmitOrderRequest", data, { headers });
        console.log("Order submission successful:");
        console.log(response.data);
       const  IPNtoken=token
        res.status(200).json({ data: response.data, IPNtoken });
    } catch (error) {
        console.error("Error submitting order:", error.message);
        if (error.response) {
            console.error("Response data:", error.response.data);
            console.error("Response status:", error.response.status);
        }
    }
};

const confirmPayment = async (req, res) => {
    try {    
        console.log('the req for get transaction',req)    
    } catch (error) {
        console.error("Error confirming payment:", error.message);
        res.status(500).send("Internal Server Error");
    }
};

const getTransactionStatus = async (req, res) => {
    try {
        const transactionID = req.transactionID;
        const response = await axios.get(`https://cybqa.pesapal.com/pesapalv3/api/Transactions/GetTransactionStatus?orderTrackingId=${transactionID}`, {
            headers: {
                "Authorization": `Bearer ${req.token}`
            }
        });

        console.log("Transaction status:", response.data);
        // Handle transaction status
        
        res.status(200).send("Transaction status retrieved successfully");
    } catch (error) {
        console.error("Error retrieving transaction status:", error.message);
        res.status(500).send("Internal Server Error");
    }
};

module.exports = {
    submitOrder,
    confirmPayment,
    getTransactionStatus
}