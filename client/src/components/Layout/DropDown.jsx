import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineAim } from "react-icons/ai";
import styles from "../../styles/style";

// Import ChildIcon from Material-UI Icons

const DropDown = ({ categoriesData, setDropDown }) => {
  const navigate = useNavigate();

  const submitHandle = (category) => {
    navigate(`/products?category=${category.name}`);
    setDropDown(false);
    window.location.reload();
  };

  return (
    <div className="pb-4 w-[270px] bg-[#fff] absolute z-30 rounded-b-md shadow-sm">
      {categoriesData &&
        categoriesData.map((category, index) => (
          <div
            key={index}
            className={`${styles.noramlFlex}`}
            onClick={() => submitHandle(category)}
          >
            {category.name === "Women" && <img src="/women-icons-88893.png" alt="Women" style={{ width: 25, height: 25 }} />}
            {category.name === "Men" && <img src="download.png" alt="Men" style={{ width: 25, height: 25 }} />}
            {category.name === "Kids" && "👶"}        
            {category.name === "Unisex" && <AiOutlineAim size={25} />}
            <Link
              to={`/products?category=${category.name}`}
              className="m-3 cursor-pointer select-none"
            >
              {category.name}
            </Link>
          </div>
        ))}
    </div>
  );
};

export default DropDown;
