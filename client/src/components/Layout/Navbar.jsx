import React from 'react';
import styles from '../../styles/style';
import { Link } from 'react-router-dom';

const Navbar = ({ active }) => {
  const navItems = [
    {
      title: "Home",
      url: "/",
    },
    {
      title: "Best Selling",
      url: "/best-selling",
    },
    {
      title: "Products",
      url: "/products",
    },
    {
      title: "Events",
      url: "/events",
    },
    {
      title: "FAQ",
      url: "/faq",
    },
  ];

  return (
    <div className={`block 800px:${styles.noramlFlex}`}>
      {navItems &&
        navItems.map((item, index) => {
          console.log("active:", active, "index:", index); // Log the active prop and index
          return (
            <div className="flex" key={index}>
              <Link
                to={item.url}
                className={`${
                  active === index + 1 ? "text-[#17dd1f]" : "text-black 800px:text-[#fff]"
                } pb-[30px] 800px:pb-0 font-[500] px-6 cursor-pointer`}
              >
                {item.title}
              </Link>
            </div>
          );
        })}
    </div>
  );
};

export default Navbar;
