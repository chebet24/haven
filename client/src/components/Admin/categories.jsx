// AdminCategory.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminCategory = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });

  useEffect(() => {
    axios.get('http://localhost:5000/category/all')
      .then(response => setCategories(response.data))
      .catch(error => console.error('Error fetching categories:', error));
  }, []);

  const handleAddCategory = () => {
    axios.post('http://localhost:5000/category/create', newCategory)
      .then(response => {
        setCategories([...categories, response.data]);
        setNewCategory({ name: '', description: '' }); // Reset the form fields
      })
      .catch(error => console.error('Error adding category:', error));
  };

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Category Manager</h1>

      <form className="mb-8 max-w-md mx-auto">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">Category Name</label>
          <input
            type="text"
            className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:border-blue-500"
            placeholder="Enter category name"
            value={newCategory.name}
            onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">Description</label>
          <textarea
            className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:border-blue-500"
            placeholder="Enter category description"
            value={newCategory.description}
            onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
          />
        </div>

        <button
          type="button"
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue active:bg-blue-800"
          onClick={handleAddCategory}
        >
          Add Category
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map(category => (
          <div key={category._id} className="bg-white p-4 rounded-md shadow-md mb-4">
            <h4 className="text-lg font-semibold mb-2">{category.name}</h4>
            <p className="text-gray-600">{category.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminCategory;
