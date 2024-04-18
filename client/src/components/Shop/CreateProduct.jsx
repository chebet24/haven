import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { useSeller } from '../../context/SellerContext';
import { Image } from 'cloudinary-react'; // Import the Image component from Cloudinary React SDK

const ProductApp = () => {
  const { userData } = useSeller();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    tags: '',
    categoryId: '',
    originalPrice: 0,
    discountPrice: 0,
    stock: 0,
    images: [],
  });

  const { name, description, tags, categoryId, originalPrice, discountPrice, stock, images } = formData;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Upload images directly to Cloudinary
 // Upload images directly to Cloudinary
const handleImageChange = async (e) => {
  const files = e.target.files;
  const imagesArray = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'qvemtnw8'); // Replace 'your_upload_preset' with your actual unsigned upload preset from Cloudinary

    try {
      // Upload image to Cloudinary
      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/dzt1mxhnb/image/upload', // Replace 'your_cloud_name' with your actual Cloudinary cloud name
        formData
      );
      
      imagesArray.push(response.data.secure_url);
    } catch (error) {
      console.error('Error uploading image to Cloudinary:', error);
    }
  }

  setFormData({ ...formData, images: imagesArray });
};


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Make sure userData (shop data) is available
      if (!userData || !userData.shop || !userData.shop._id) {
        console.error('Shop data not available.');
        return;
      }

      const productData = {
        ...formData,
        shopId: userData.shop._id,
        shop: {
          name: userData.shop.name,
          email: userData.shop.email,
          number: userData.shop.phoneNumber
        },
      };

      const response = await axios.post('http://localhost:5000/product/create', productData);

      console.log('Product saved successfully:', response.data);

      setFormData({
        name: '',
        description: '',
        tags: '',
        categoryId: '',
        originalPrice: 0,
        discountPrice: 0,
        stock: 0,
        images: [],
      });

      // Refresh the product list after saving
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error.message);
    }
  };

  const fetchProducts = async () => {
    try {
      if (!userData || !userData.shop || !userData.shop._id) {
        console.error('Shop data not available.');
        return;
      }
  
      const shopId = userData.shop._id;

      const response = await axios.get(`http://localhost:5000/product/shop/${shopId}`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error.message);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories(); // Fetch categories on component mount
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:5000/category/all');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error.message);
    }
  };

  return (
    <div className="w-[90%] 800px:w-[50%] bg-white shadow h-[80vh] rounded-[4px] p-3 overflow-y-scroll">
      <h2 className="text-[30px] font-Poppins text-center">Add a new product</h2>
      <form onSubmit={handleSubmit}>
      <div>
          <label className="pb-2">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={name}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={handleChange}
            placeholder="Enter your product name..."
          />
        </div>
        <br />
        <div>
          <label className="pb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            cols="30"
            required
            rows="8"
            type="text"
            name="description"
            value={description}
            className="mt-2 appearance-none block w-full pt-2 px-3 border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={handleChange}
            placeholder="Enter your product description..."
          ></textarea>
        </div>
        <br />
        <div>
          <label className="pb-2">Tags</label>
          <input
            type="text"
            name="tags"
            value={tags}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={handleChange}
            placeholder="Enter your product tags..."
          />
        </div>
        <br />
        <div>
        <label className="pb-2">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            name="categoryId"
            value={categoryId}
            onChange={handleChange}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="" disabled>Select a category</option>
            {categories.map(category => (
              <option key={category._id} value={category._id}>{category.name}</option>
            ))}
          </select>
        </div>
        <br />
        <div>
          <label className="pb-2">Original Price</label>
          <input
            type="number"
            name="originalPrice"
            value={originalPrice}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={handleChange}
            placeholder="Enter your product price..."
          />
        </div>
        <br />
        <div>
          <label className="pb-2">
            Price (With Discount) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="discountPrice"
            value={discountPrice}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={handleChange}
            placeholder="Enter your product price with discount..."
          />
        </div>
        <br />
        <div>
          <label className="pb-2">
            Product Stock <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="stock"
            value={stock}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={handleChange}
            placeholder="Enter your product stock..."
          />
        </div>
        <br />
      
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
            {images &&
              images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Product Image ${index + 1}`}
                  className="h-[120px] w-[120px] object-cover m-2"
                />
              ))}
          </div>
        </div>

        <button type="submit" className="mt-4 submit-button">
          Create
        </button>
      </form>

      {/* Display product list */}
      <h2>Product List</h2>
      <ul>
        {products.map((product) => (
          <li key={product._id}>
            {product.name} - {product.description} - KSH: {product.discountPrice !== product.originalPrice ? (
      <span>
        <span className="text-gray-500 line-through">${product.originalPrice}</span>
        {" "} ${product.discountPrice}
      </span>
    ) : (
      <span>${product.originalPrice}</span>
    )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductApp;
