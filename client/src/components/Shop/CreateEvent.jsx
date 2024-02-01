import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AiOutlinePlusCircle } from 'react-icons/ai';

const CreateEvent = () => {
  const [eventData, setEventData] = useState({
    name: '',
    description: '',
    category: '',
    start_Date: '',
    Finish_Date: '',
    status: 'Running',
    tags: '',
    originalPrice: 0,
    discountPrice: 0,
    stock: 0,
    images: [],
  });

  const handleChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };
  const handleImageChange = (e) => {
    const files = e.target.files;
    const imagesArray = [];

    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          imagesArray.push(reader.result);
          if (imagesArray.length === files.length) {
            setEventData({ ...eventData, images: imagesArray });
          }
        }
      };
      reader.readAsDataURL(files[i]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Make a POST request to your backend API to create a new event
      const response = await axios.post('http://localhost:5000/event/createevent', eventData);
      console.log(response.data); // Log the created event data
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  return (
    <div className="w-[90%] 800px:w-[50%] bg-white shadow h-[80vh] rounded-[4px] p-3 overflow-y-scroll">
      <h2 className="text-[30px] font-Poppins text-center">Create Event</h2>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-4">
          <label htmlFor="name" className="pb-2 block">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={eventData.name}
            className="mt-2 input-field"
            onChange={handleChange}
            placeholder="Enter your event product name..."
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="pb-2 block">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={eventData.description}
            className="mt-2 input-field"
            onChange={handleChange}
            placeholder="Enter your event product description..."
            rows="4"
            required
          ></textarea>
        </div>

        <div>
          <label className="mb-4">
            Category <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="category"
            value={eventData.category}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={handleChange}
            placeholder="Enter your Category..."
          />
        </div>

        <div className="mb-4">
          <label htmlFor="tags" className="pb-2 block">
            Tags
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={eventData.tags}
            className="mt-2 input-field"
            onChange={handleChange}
            placeholder="Enter your event product tags..."
          />
        </div>

        <div className="mb-4">
          <label htmlFor="originalPrice" className="pb-2 block">
            Original Price
          </label>
          <input
            type="number"
            id="originalPrice"
            name="originalPrice"
            value={eventData.originalPrice}
            className="mt-2 input-field"
            onChange={handleChange}
            placeholder="Enter your event product original price..."
          />
        </div>

        <div className="mb-4">
          <label htmlFor="discountPrice" className="pb-2 block">
            Price (With Discount) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="discountPrice"
            name="discountPrice"
            value={eventData.discountPrice}
            className="mt-2 input-field"
            onChange={handleChange}
            placeholder="Enter your event product price with discount..."
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="stock" className="pb-2 block">
            Product Stock <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={eventData.stock}
            className="mt-2 input-field"
            onChange={handleChange}
            placeholder="Enter your event product stock..."
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="start_Date" className="pb-2 block">
            Event Start Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="start_Date"
            name="start_Date"
            value={eventData.start_Date}
            className="mt-2 input-field"
            onChange={handleChange}
            placeholder="Enter your event start date..."
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="Finish_Date" className="pb-2 block">
            Event End Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="Finish_Date"
            name="Finish_Date"
            value={eventData.Finish_Date}
            className="mt-2 input-field"
            onChange={handleChange}
            placeholder="Enter your event end date..."
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="upload" className="pb-2 block">
            Upload Images <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            id="upload"
            name="upload"
            className="hidden"
            multiple
            onChange={handleImageChange}
          />
          <div className="w-full flex items-center flex-wrap">
            <label htmlFor="upload" className="cursor-pointer">
              <AiOutlinePlusCircle size={30} className="mt-3" color="#555" />
            </label>
            {eventData.images &&
              eventData.images.map((i, index) => (
                <img
                  src={i.url} // Assuming 'url' is the key for the image URL in your schema
                  key={index}
                  alt=""
                  className="h-[120px] w-[120px] object-cover m-2"
                />
              ))}
          </div>
        </div>

        <button type="submit" className="mt-4 submit-button">
          Create Event
        </button>
      </form>
    </div>
  );
};

export default CreateEvent;
