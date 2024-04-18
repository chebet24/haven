import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { useSeller } from '../../context/SellerContext';

const AllEvents = () => {
  const [events, setEvents] = useState([]);
  const { userData, isLoading } = useSeller();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const shopId = userData?.shop?._id;
        console.log(shopId);
        if (!shopId) {
          console.log('shop not there');
          // Handle the case when shopId is not available
          return;
        }

        // Fetch events data from the API
        const response = await axios.get(`http://localhost:5000/event/shop/${shopId}`);
        setEvents(response.data);

        // Log the events data after setting state
        console.log('Events Data:', response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchData();
  }, [userData?.shop?._id]);

  // Log the state outside the useEffect
  useEffect(() => {
    console.log('Events State:', events);
  }, [events]);

  const columns = [
    { field: '_id', headerName: 'Event ID', width: 150 },
    { field: 'name', headerName: 'Name', width: 180 },
    { field: 'description', headerName: 'Description', flex: 1 },
    { field: 'categoryId', headerName: 'Category ID', flex: 1 },
    { field: 'start_Date', headerName: 'Start Date', flex: 1 },
    { field: 'Finish_Date', headerName: 'Finish Date', flex: 1 },
    { field: 'status', headerName: 'Status', flex: 1 },
    { field: 'tags', headerName: 'Tags', flex: 1 },
    { field: 'originalPrice', headerName: 'Original Price', flex: 1 },
    { field: 'discountPrice', headerName: 'Discount Price', flex: 1 },
    { field: 'stock', headerName: 'Stock', flex: 1 },
    { field: 'sold_out', headerName: 'Sold out', flex: 1 },
  ];

  const getRowId = (row) => row._id; // Use _id as the unique identifier

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={events}
        columns={columns}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        loading={isLoading}
        getRowId={getRowId}
      />
    </div>
  );
};

export default AllEvents;
