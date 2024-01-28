import React from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../../styles/style";

const DropDown = ({ categoriesData, setDropDown }) => {
  const navigate = useNavigate();

  const submitHandle = (category) => {
    navigate(`/products?category=${category.title}`);
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
            <img
              src={category.image_Url}
              style={{
                width: "25px",
                height: "25px",
                objectFit: "contain",
                marginLeft: "10px",
                userSelect: "none",
              }}
              alt=""
            />
            <Link
              to={`/products?category=${category.title}`}
              className="m-3 cursor-pointer select-none"
            >
              {category.title}
            </Link>
          </div>
        ))}
    </div>
  );
};

export default DropDown;
