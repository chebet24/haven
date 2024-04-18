import React from "react";
import {
  AiFillFacebook,
  AiFillInstagram,
  AiFillYoutube,
  AiOutlineTwitter,
} from "react-icons/ai";
import { Link } from "react-router-dom";
import {
  footercompanyLinks,
  footerProductLinks,
  footerSupportLinks,
} from "../../static/data";

const Footer = () => {
  return (
    <div className="bg-[#000] text-white">
        <div className="md:flex md:justify-between md:items-center sm:px-12 px-4 bg-[#342ac8] py-2"> {/* Reduced padding */}
        <h1 className="lg:text-2xl text-2xl md:mb-0 mb-4 lg:leading-normal font-semibold md:w-2/5">
            <span className="text-[#56d879] text-sm">Subscribe</span> {/* Reduced font size */}
            Get informed about 
            <br />
            events and offers
            </h1>
            <div className="flex sm:w-72 mr-1 lg:mb-0 mb-2 py-2.5 rounded px-2 focus:outline-none"> {/* Reduced width */}
            <input
             type="text"
             required
            placeholder="Enter your email..."
            className="text-gray-800 flex-grow py-2 rounded-l px-2 focus:outline-none" // Added flex-grow and rounded-l classes
            />
            <button className="bg-[#56d879] hover:bg-teal-500 duration-300 px-5 py-2.5 rounded-r-md text-whie"> {/* Removed w-full and rounded-md classes */}
            Submit
            </button>
            </div>
            </div>


      <div className="grid grid-cols-1 sm:gird-cols-3 lg:grid-cols-4 gap-1 sm:px-8 px-5 py-16 sm:text-center">
        <ul className="px-7 text-center sm:text-start flex sm:block flex-col items-center">
        <img
        src="/1-removebg-preview.png"
        alt=""
        className="w-20 h-20" // Adjust the width and height as needed
        />

          <br />
          <p>The home and elements needeed to create beatiful products.</p>
          <div className="flex items-center mt-[15px]">
            <AiFillFacebook size={25} className="cursor-pointer" />
            <AiOutlineTwitter
              size={25}
              style={{ marginLeft: "15px", cursor: "pointer" }}
            />
            <AiFillInstagram
              size={25}
              style={{ marginLeft: "15px", cursor: "pointer" }}
            />
            <AiFillYoutube
              size={25}
              style={{ marginLeft: "15px", cursor: "pointer" }}
            />
          </div>
        </ul>

        <ul className="text-center sm:text-start">
          <h1 className="mb-1 font-semibold">Company</h1>
          {footerProductLinks.map((link,index) => (
            <li key={index}>
              <Link
                className="text-gray-400 hover:text-teal-400 duration-300
                   text-sm cursor-pointer leading-6"
                to={link.link}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        <ul className="text-center sm:text-start">
          <h1 className="mb-1 font-semibold">Shop</h1>
          {/* {footercompanyLinks.map((link,index) => (
            <li key={index}>
              <Link
                className="text-gray-400 hover:text-teal-400 duration-300
                   text-sm cursor-pointer leading-6"
                to={link.link}
              >
                {link.name}
              </Link>
            </li>
          ))} */}
        </ul>

        <ul className="text-center sm:text-start">
          <h1 className="mb-1 font-semibold">Support</h1>
          {footerSupportLinks.map((link,index) => (
            <li key={index}>
              <Link
                className="text-gray-400 hover:text-teal-400 duration-300
                   text-sm cursor-pointer leading-6"
                to={link.link}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10
         text-center pt-2 text-gray-400 text-sm pb-8"
      >
        <span>© 2024 Haventure. All rights reserved.</span>
        <span>Terms · Privacy Policy</span>
        <div className="sm:block flex items-center justify-center w-full">
          <img
            src=""
            Shop
            alt=""
          />
        </div>
      </div>
    </div>
  );
};

export default Footer;
