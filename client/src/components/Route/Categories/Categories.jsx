import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import Axios
import styles from "../../../styles/style";

const Categories = () => {
  const navigate = useNavigate();
  const [brandingData, setBrandingData] = useState([]);
  const [categoriesData, setCategoriesData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch branding data using Axios
        // const brandingResponse = await axios.get("  http://localhost:5000/branding/all"); // Replace with your actual API endpoint
        // setBrandingData(brandingResponse.data);

        // Fetch categories data using Axios
        const categoriesResponse = await axios.get("http://localhost:5000/category/all"); // Replace with your actual API endpoint
        setCategoriesData(categoriesResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleCategoryClick = (category) => {
    navigate(`/products?category=${category.title}`);
  };

  return (
    <>
      {/* Branding Section */}
      <div className={`${styles.section} hidden sm:block`}>
        {/* <div className={`branding my-12 flex justify-between w-full shadow-sm bg-white p-5 rounded-md`}>
          {brandingData.map((item, index) => (
            <div className="flex items-start" key={index}>
              {item.icon}
              <div className="px-3">
                <h3 className="font-bold text-sm md:text-base">{item.title}</h3>
                <p className="text-xs md:text-sm">{item.Description}</p>
              </div>
            </div>
          ))}
        </div> */}
      </div>

      {/* Categories Section */}
      <div className={`${styles.section} bg-white p-6 rounded-lg mb-12`} id="categories">
        <div className="grid grid-cols-1 gap-[5px] md:grid-cols-2 md:gap-[10px] lg:grid-cols-4 lg:gap-[20px] xl:grid-cols-5 xl:gap-[30px]">
          {categoriesData.map((category) => (
            <div
              className="w-full h-[100px] flex items-center justify-between cursor-pointer overflow-hidden"
              key={category.id}
              onClick={() => handleCategoryClick(category)}
            >
              <h5 className={`text-[18px] leading-[1.3]`}>{category.title}</h5>
              <img src={category.imageUrl} className="w-[120px] object-cover" alt="" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Categories;
