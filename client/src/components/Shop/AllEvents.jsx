import React, { useState, useEffect } from "react";
import { Button, Table, CircularProgress } from "@mui/material";
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import axios from "axios";
import { Link } from "react-router-dom";

const AllEvents = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
  
        // Fetch events data from the API
        const response = await axios.get(`http://localhost:5000/event/all`);
        setEvents(response.data);
  
        // Log the events data after setting state
        console.log("Events Data:", response.data);
  
        // Also log the state directly
        console.log("Events State:", events);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/event/${id}`);
      // Remove the deleted event from the local state
      setEvents((prevEvents) => prevEvents.filter((event) => event._id !== id));

      // Log the updated events data after deletion
      console.log("Updated Events Data:", events);
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const columns = [
    { dataIndex: "_id", title: "Event ID", width: 150, ellipsis: true },
    { dataIndex: "name", title: "Name", width: 180, ellipsis: true },
    { dataIndex: "description", title: "Description", ellipsis: true },
    { dataIndex: "category", title: "Category", ellipsis: true },
    { dataIndex: "start_Date", title: "Start Date", ellipsis: true },
    { dataIndex: "Finish_Date", title: "Finish Date", ellipsis: true },
    { dataIndex: "status", title: "Status", ellipsis: true },
    { dataIndex: "tags", title: "Tags", ellipsis: true },
    { dataIndex: "originalPrice", title: "Original Price", ellipsis: true },
    { dataIndex: "discountPrice", title: "Discount Price", ellipsis: true },
    { dataIndex: "stock", title: "Stock", ellipsis: true },
    {
      dataIndex: "images",
      title: "Images",
      render: (images) => (
        <div>
          {images.map((image, index) => (
            <img key={index} src={image} alt={`Image ${index + 1}`} style={{ width: 50, height: 50, marginRight: 5 }} />
          ))}
        </div>
      ),
    },
    { dataIndex: "sold_out", title: "Sold out", ellipsis: true },
    {
      title: "Preview",
      width: 100,
      render: (_, record) => {
        const product_name = record.name.replace(/\s+/g, "-");
        return (
          <Link to={`/product/${product_name}`}>
            <Button>
              <AiOutlineEye size={20} />
            </Button>
          </Link>
        );
      },
    },
    {
      title: "Delete",
      width: 120,
      render: (_, record) => (
        <Button onClick={() => handleDelete(record._id)}>
          <AiOutlineDelete size={20} />
        </Button>
      ),
    },
  ];

  return (
    <>
      {isLoading ? (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
          <CircularProgress />
        </div>
      ) : (
        <div className="w-full mx-8 pt-1 mt-10 bg-white">
          <Table
            dataSource={events}
            columns={columns}
            pagination={{ pageSize: 10 }}
            scroll={{ x: 'max-content' }}
          />
         
        </div>
      )}
    </>
  );
};

export default AllEvents;
