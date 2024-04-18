import React, { useState } from "react";
import {
  AiOutlineArrowRight,
  AiOutlineCamera,
  AiOutlineDelete,
} from "react-icons/ai";

import { DataGrid } from '@mui/x-data-grid';

import { Button } from '@mui/material';
import { Link } from "react-router-dom";
import { MdTrackChanges } from "react-icons/md";
import { RxCross1 } from "react-icons/rx";
import { useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import {useUser} from "../../context/UserContext";
import styles from "../../styles/style";




const ProfileContent = ({ active }) => {
    const { user } = useUser();
  const [name, setName] = useState(user && user.name);
  console.log("user",user)
  const [email, setEmail] = useState(user && user.email);
  const [phoneNumber, setPhoneNumber] = useState(user && user.phoneNumber);
  const [orders, setOrders] = useState([]);
  const userId = user._id
 
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState({

    address1: "",
    address2: "",
    addressType: "",
  });

  const [avatar, setAvatar] = useState(null);
  const server ="http://localhost:5000"



 
  const loadUser = async () => {
    try {
      const { data } = await axios.get(`${server}/user/get/${userId}`, {
        withCredentials: true,
      });
      toast.success("user  loaded successfully!");
      // Handle success
    } catch (error) {
        toast.success("user   not loaded successfully!");
    }
  };

  useEffect(() => {
  const getAllOrders = async () => {

    try {
      const { data } = await axios.get(
        `${server}/order/get-all/${userId}`
      );
      setOrders(data.orders);
    } catch (error) {
      console.error("Error fetching orders:", error.response.data.message);
    }
  };

  getAllOrders();
}, [userId]);


const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        // Handle the case when the token is not available
        console.error('Token not found in local storage');
        return;
      }
      const { data } = await axios.put(
        `${server}/user/update-user`,
        {
          email,
          password,
          phoneNumber,
          name,
        },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
            "Access-Control-Allow-Credentials": true,
          },
        }
      );
       // Update user info in the context
      toast.success("User information updated successfully");
    } catch (error) {
      console.log(error.response.data.message);
      toast.error("Failed to update user information");
    }
  };

  const handleImage = async (e) => {
    const reader = new FileReader();

    reader.onload = async () => {
        if (reader.readyState === 2) {
          setAvatar(reader.result);
          try {
            const avatarData = reader.result;
            const token = localStorage.getItem('token');
           // Assuming user information is stored in localStorage


            await axios.put(
              `${server}/user/update-avatar`,
             { email: user.email,
              avatar: [avatarData] },
              {
                withCredentials: true,
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Access-Control-Allow-Credentials": true,
                },
              
              }
            );
            loadUser(); // Load updated user data
            toast.success("Avatar updated successfully!");
          } catch (error) {
            console.log(error.response.data.message);
            toast.error("Failed to update avatar");
          }
        }
      };
    

    reader.readAsDataURL(e.target.files[0]);
  };

  return (
    <div className="w-full">
      {/* profile */}
      <h1>Hello there</h1>
      {active === 1 && (
        <>
          <div className="flex justify-center w-full">
            <div className="relative">
              <img
                src={`${user?.avatar}`}
                className="w-[150px] h-[150px] rounded-full object-cover border-[3px] border-[#3ad132]"
                alt=""
              />
              <div className="w-[30px] h-[30px] bg-[#E3E9EE] rounded-full flex items-center justify-center cursor-pointer absolute bottom-[5px] right-[5px]">
                <input
                  type="file"
                  id="image"
                  accept=".jpg,.jpeg,.png"
                  className="hidden"
                  onChange={handleImage}
                />
                <label htmlFor="image">
                  <AiOutlineCamera />
                </label>
              </div>
            </div>
          </div>
          <br />
          <br />
          <div className="w-full px-5">
            <form onSubmit={handleSubmit} aria-required={true}>
              <div className="w-full 800px:flex block pb-3">
                <div className=" w-[100%] 800px:w-[50%]">
                  <label className="block pb-2">Full Name</label>
                  <input
                    type="text"
                    className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className=" w-[100%] 800px:w-[50%]">
                  <label className="block pb-2">Email Address</label>
                  <input
                    type="text"
                    className={`${styles.input} !w-[95%] mb-1 800px:mb-0`}
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="w-full 800px:flex block pb-3">
                <div className=" w-[100%] 800px:w-[50%]">
                  <label className="block pb-2">Phone Number</label>
                  <input
                    type="number"
                    className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>

                <div className=" w-[100%] 800px:w-[50%]">
                  <label className="block pb-2">Enter your password</label>
                  <input
                    type="password"
                    className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              <input
                className={`w-[250px] h-[40px] border border-[#3a24db] text-center text-[#3a24db] rounded-[3px] mt-8 cursor-pointer`}
                required
                value="Update"
                type="submit"
              />
            </form>
          </div>
        </>
      )}

      {/* order */}
      {active === 2 && (
        <div>
          <AllOrders />
        </div>
      )}

      {/* Refund */}
      {active === 3 && (
        <div>
          <AllRefundOrders />
        </div>
      )}

      {/* Track order */}
      {active === 5 && (
        <div>
          <TrackOrder />
        </div>
      )}

      {/* Change Password */}
      {active === 6 && (
        <div>
          <ChangePassword />
        </div>
      )}

      {/*  user Address */}
      {active === 7 && (
        <div>
          <Address />
        </div>
      )}
    </div>
  );
};

const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const server ="http://localhost:5000"
  const { user } = useUser();
  const userId = user._id;

  useEffect(() => {
   
    const fetchOrders = async () => {
      try {
        const response = await axios.get( `${server}/order/get-all/${userId}`);
        setOrders(response.data.orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },
    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      // cellClassName: (params) =>
      //   params.getValue(params.id, "status") === "Delivered"
      //     ? "greenColor"
      //     : "redColor",
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "total",
      headerName: "Total",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },
    {
      field: " ",
      flex: 1,
      minWidth: 150,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => (
        <Link to={`/user/order/${params.id}`}>
          <Button>
            <AiOutlineArrowRight size={20} />
          </Button>
        </Link>
      ),
    },
  ];

  const rows = orders.map((item) => ({
    id: item._id,
    itemsQty: item.cart.length,
    total: `KSH: ${item.totalPrice}`,
    status: item.status,
  }));

  return (
    <div className="pl-8 pt-1">
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={10}
        disableSelectionOnClick
        autoHeight
      />
    </div>
  );
};
const AllRefundOrders = () => {
  const [orders, setOrders] = useState([]);
  const server ="http://localhost:5000"
  const { user } = useUser();
  const userId = user._id;

  useEffect(() => {
   
    const fetchOrders = async () => {
      try {
        const response = await axios.get( `${server}/order/get-all/${userId}`);
        setOrders(response.data.orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const eligibleOrders =
    orders && orders.filter((item) => item.status === "Processing refund");

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },

    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params) => {
        return params.getValue(params.id, "status") === "Delivered"
          ? "greenColor"
          : "redColor";
      },
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 130,
      flex: 0.7,
    },

    {
      field: "total",
      headerName: "Total",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },

    {
      field: " ",
      flex: 1,
      minWidth: 150,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/user/order/${params.id}`}>
              <Button>
                <AiOutlineArrowRight size={20} />
              </Button>
            </Link>
          </>
        );
      },
    },
  ];

  const row = [];

  eligibleOrders &&
    eligibleOrders.forEach((item) => {
      row.push({
        id: item._id,
        itemsQty: item.cart.length,
        total: "KSH: " + item.totalPrice,
        status: item.status,
      });
    });

  return (
    <div className="pl-8 pt-1">
      <DataGrid
        rows={row}
        columns={columns}
        pageSize={10}
        autoHeight
        disableSelectionOnClick
      />
    </div>
  );
};

const TrackOrder = () => {
  const [orders, setOrders] = useState([]);
  const server ="http://localhost:5000"
  const { user } = useUser();
  const userId = user._id;

  useEffect(() => {
   
    const fetchOrders = async () => {
      try {
        const response = await axios.get( `${server}/order/get-all/${userId}`);
        setOrders(response.data.orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },

    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      // cellClassName: (params) => {
      //   return params.getValue(params.id, "status") === "Delivered"
      //     ? "greenColor"
      //     : "redColor";
      // },
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 130,
      flex: 0.7,
    },

    {
      field: "total",
      headerName: "Total",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },

    {
      field: " ",
      flex: 1,
      minWidth: 150,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/user/track/order/${params.id}`}>
              <Button>
                <MdTrackChanges size={20} />
              </Button>
            </Link>
          </>
        );
      },
    },
  ];

  const row = [];

  orders &&
    orders.forEach((item) => {
      row.push({
        id: item._id,
        itemsQty: item.cart.length,
        total: "KSH " + item.totalPrice,
        status: item.status,
      });
    });

  return (
    <div className="pl-8 pt-1">
      <DataGrid
        rows={row}
        columns={columns}
        pageSize={10}
        disableSelectionOnClick
        autoHeight
      />
    </div>
  );
};

const ChangePassword = () => {
  const server ="http://localhost:5000"
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { user } = useUser();

  const passwordChangeHandler = async (e) => {
    e.preventDefault();

    // Get the authentication token from localStorage
    const token = localStorage.getItem("token");

    if (!token) {
      // Handle the case where the token is not available
      toast.error("Authentication token not found!");
      return;
    }

    try {
      const response = await axios.put(
        `${server}/user/update-user-password`,
        { oldPassword, newPassword, confirmPassword ,email: user.email,},
        {
          withCredentials: true, // Include credentials in the request
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        }
      );

      // Handle successful response
      toast.success(response.data.message);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      // Handle error response
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An error occurred. Please try again later.");
      }
    }
  };

  return (
    <div className="w-full px-5">
      <h1 className="block text-[25px] text-center font-[600] text-[#000000ba] pb-2">
        Change Password
      </h1>
      <div className="w-full">
        <form
          aria-required
          onSubmit={passwordChangeHandler}
          className="flex flex-col items-center"
        >
          <div className=" w-[100%] 800px:w-[50%] mt-5">
            <label className="block pb-2">Enter your old password</label>
            <input
              type="password"
              className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
              required
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </div>
          <div className=" w-[100%] 800px:w-[50%] mt-2">
            <label className="block pb-2">Enter your new password</label>
            <input
              type="password"
              className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className=" w-[100%] 800px:w-[50%] mt-2">
            <label className="block pb-2">Enter your confirm password</label>
            <input
              type="password"
              className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <input
              className={`w-[95%] h-[40px] border border-[#3a24db] text-center text-[#3a24db] rounded-[3px] mt-8 cursor-pointer`}
              required
              value="Update"
              type="submit"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

const Address = () => {
  const [open, setOpen] = useState(false);
 const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [addressType, setAddressType] = useState("");
  const server ="http://localhost:5000"
  const { user } = useUser();
  console.log("user adress",user)

  const addressTypeData = [
    {
      name: "Default",
    },
    {
      name: "Home",
    },
    {
      name: "Office",
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

      if (addressType === "" || address1 === "" || address2 === "") { // Check if email is empty
      toast.error("Please fill all the fields!");
    } else {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          // Handle the case where the token is not available
          return;
        }

        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };

        const addressData = { 
          address1,
          address2,
          addressType,
        };

        const response = await axios.put(
          `${server}/user/update-address`,
          {
            email: user.email,
            addressData: addressData,
          },
          config
        );

        if (response.data.success) {
          // Optionally, you can update the user context or state here if needed
          toast.success("Address updated successfully!");
          setOpen(false);
          setAddress1("");
          setAddress2("");
          setAddressType("");
          // Clear email after submission
        } else {
          toast.error("Failed to update address");
        }
      } catch (error) {
        console.error("Error updating address:", error);
        toast.error("Failed to update address");
      }
    }
  }
  const deleteUserAddress = async (id) => {
    try {
      const { data } = await axios.delete(
        `${server}/user/delete-user-address/${id}`,
        { withCredentials: true }
      );

      toast.success("User address deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete user address");
    }
  };


    
  
const handleDelete = (item) => {
  const id = item._id;
  deleteUserAddress(id); // Call deleteUserAddress function directly
};


  return (
    <div className="w-full px-5">
      {open && (
        <div className="fixed w-full h-screen bg-[#0000004b] top-0 left-0 flex items-center justify-center ">
          <div className="w-[35%] h-[80vh] bg-white rounded shadow relative overflow-y-scroll">
            <div className="w-full flex justify-end p-3">
              <RxCross1
                size={30}
                className="cursor-pointer"
                onClick={() => setOpen(false)}
              />
            </div>
            <h1 className="text-center text-[25px] font-Poppins">
              Add New Address
            </h1>
            <div className="w-full">
              <form aria-required onSubmit={handleSubmit} className="w-full">
                <div className="w-full block p-4">

                  <div className="w-full pb-2">
                    <label className="block pb-2">Address 1</label>
                    <input
                      type="address"
                      className={`${styles.input}`}
                      required
                      value={address1}
                      onChange={(e) => setAddress1(e.target.value)}
                    />
                  </div>
                  <div className="w-full pb-2">
                    <label className="block pb-2">Address 2</label>
                    <input
                      type="address"
                      className={`${styles.input}`}
                      required
                      value={address2}
                      onChange={(e) => setAddress2(e.target.value)}
                    />
                  </div>

                 

                  <div className="w-full pb-2">
                    <label className="block pb-2">Address Type</label>
                    <select
                      name=""
                      id=""
                      value={addressType}
                      onChange={(e) => setAddressType(e.target.value)}
                      className="w-[95%] border h-[40px] rounded-[5px]"
                    >
                      <option value="" className="block border pb-2">
                        Choose your Address Type
                      </option>
                      {addressTypeData &&
                        addressTypeData.map((item) => (
                          <option
                            className="block pb-2"
                            key={item.name}
                            value={item.name}
                          >
                            {item.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className=" w-full pb-2">
                    <input
                      type="submit"
                      className={`${styles.input} mt-5 cursor-pointer`}
                      required
                      readOnly
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      <div className="flex w-full items-center justify-between">
        <h1 className="text-[25px] font-[600] text-[#000000ba] pb-2">
          My Addresses
        </h1>
        <div
          className={`${styles.button} !rounded-md`}
          onClick={() => setOpen(true)}
        >
          <span className="text-[#fff]">Add New</span>
        </div>
      </div>
      <br />
      {user && user.addresses.map((item, index) => (
  <div
    className="w-full bg-white h-min 800px:h-[70px] rounded-[4px] flex items-center px-3 shadow justify-between pr-10 mb-5"
    key={index}
  >
    <div className="flex items-center">
      <h5 className="pl-5 font-[600]">{item.addressType}</h5>
    </div>
    <div className="pl-8 flex items-center">
      <h6 className="text-[20px] 800px:text-[unset]">
        {item.address1},  {item.address2}
      </h6>
    </div>
    <div className="pl-8 flex items-center">
      <h6 className="text-[12px] 800px:text-[unset]">
        {user.phoneNumber}
      </h6>
    </div>
    <div className="min-w-[10%] flex items-center justify-between pl-8">
      <AiOutlineDelete
        size={25}
        className="cursor-pointer"
        onClick={() => handleDelete(item)}
      />
    </div>
  </div>
))}

{user && user.addresses.length === 0 && (
  <h5 className="text-center pt-8 text-[18px]">
    You do not have any saved addresses!
  </h5>
)}

    </div>
  );
};
export default ProfileContent;
