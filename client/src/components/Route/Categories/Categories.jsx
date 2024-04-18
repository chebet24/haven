import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../../../styles/style";

const Categories = () => {
  const navigate = useNavigate();
  const [categoriesData, setCategoriesData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/category/all");
        setCategoriesData(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchData();
  }, []);

  const handleCategoryClick = (category) => {
    navigate(`/products?category=${category.name}`);
  };

  return (
    <>
      <h1>Categories</h1>
      <div className={`${styles.section} bg-white p-6 rounded-lg mb-12`} id="categories">
        <div className="grid grid-cols-1 gap-[5px] md:grid-cols-2 md:gap-[10px] lg:grid-cols-4 lg:gap-[20px] xl:grid-cols-5 xl:gap-[30px]">
          {categoriesData.map((category, index) => (
            <div
              className="w-full h-[100px] flex items-center justify-between cursor-pointer overflow-hidden"
              key={index}
              onClick={() => handleCategoryClick(category)}
            >
              <h5 className={`text-[18px] leading-[1.3]`}>{category.name}</h5>
              <img src={category.imageUrl} className="w-[120px] object-cover" alt={category.name} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Categories;
