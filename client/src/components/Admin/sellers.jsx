import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import axios from "axios";
import { toast } from "react-toastify";
import { RxCross1 } from "react-icons/rx";
import styles from "../../styles/style";

const AllSellers = () => {
  const [sellers, setSellers] = useState([]);
  const [open, setOpen] = useState(false);
  const [sellerId, setSellerId] = useState("");

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/shop/all`);
        setSellers(response.data);
      } catch (error) {
        console.error("Error fetching sellers:", error);
      }
    };

    fetchSellers();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/shop/delete/${id}`, { withCredentials: true });
      toast.success("Seller deleted successfully");
      setSellers((prevSellers) => prevSellers.filter((seller) => seller._id !== id));
    } catch (error) {
      console.error("Error deleting seller:", error);
    }
  };

  const columns = [
    { field: "id", headerName: "Seller ID", minWidth: 150, flex: 0.7 },
    { field: "name", headerName: "Name", minWidth: 130, flex: 0.7 },
    { field: "email", headerName: "Email", type: "text", minWidth: 130, flex: 0.7 },
    { field: "address", headerName: "Seller Address", type: "text", minWidth: 130, flex: 0.7 },
    { field: "joinedAt", headerName: "Joined At", type: "text", minWidth: 130, flex: 0.8 },
    {
      field: "preview",
      flex: 1,
      minWidth: 150,
      headerName: "Preview Shop",
      type: "number",
      sortable: false,
      renderCell: (params) => (
        <a href={`/shop/preview/${params.id}`} target="_blank" rel="noopener noreferrer">
          <Button>
            <AiOutlineEye size={20} />
          </Button>
        </a>
      ),
    },
    {
      field: "delete",
      flex: 1,
      minWidth: 150,
      headerName: "Delete Seller",
      type: "number",
      sortable: false,
      renderCell: (params) => (
        <Button onClick={() => setSellerId(params.id) || setOpen(true)}>
          <AiOutlineDelete size={20} />
        </Button>
      ),
    },
  ];

  const rows = sellers.map((item) => ({
    id: item._id,
    name: item?.name,
    email: item?.email,
    joinedAt: item.createdAt.slice(0, 10),
    address: item.address,
  }));

  return (
    <div className="w-full flex justify-center pt-5">
      <div className="w-[97%]">
        <h3 className="text-[22px] font-Poppins pb-2">All Sellers</h3>
        <div className="w-full min-h-[45vh] bg-white rounded">
          <DataGrid rows={rows} columns={columns} pageSize={10} disableSelectionOnClick autoHeight />
        </div>
        {open && (
          <div className="w-full fixed top-0 left-0 z-[999] bg-[#00000039] flex items-center justify-center h-screen">
            <div className="w-[95%] 800px:w-[40%] min-h-[20vh] bg-white rounded shadow p-5">
              <div className="w-full flex justify-end cursor-pointer">
                <RxCross1 size={25} onClick={() => setOpen(false)} />
              </div>
              <h3 className="text-[25px] text-center py-5 font-Poppins text-[#000000cb]">
                Are you sure you wanna delete this seller?
              </h3>
              <div className="w-full flex items-center justify-center">
                <div
                  className={`${styles.button} text-white text-[18px] !h-[42px] mr-4`}
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </div>
                <div
                  className={`${styles.button} text-white text-[18px] !h-[42px] ml-4`}
                  onClick={() => setOpen(false) || handleDelete(sellerId)}
                >
                  Confirm
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllSellers;
