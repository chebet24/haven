import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import moment from "moment";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlinePlus, AiOutlineMessage, AiOutlineMinus } from "react-icons/ai";

const SellerHeader = ({ data }) => {
  const [shopInfo, setShopInfo] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          // Send a request to your backend server to verify the token
          const response = await axios.get('http://localhost:5000/user/info', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          setUser(response.data.user);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error verifying token:', error);
        setIsAuthenticated(false);
      }
    };

    checkAuthStatus();
  }, []);

  useEffect(() => {
    const fetchShopInfo = async () => {
      try {
        console.log("seller data",data);
        // Fetch shop information
        if (data && data.shop) {
          const shopEmail = data.shop.email;
          if (shopEmail) {
            const shopResponse = await axios.get(`http://localhost:5000/shop/${shopEmail}`);
            setShopInfo(shopResponse.data);
            setFollowerCount(shopResponse.data.shop.followerCount || 0);
          } else {
            console.error("Shop email not available in data");
          }
        } else {
          console.error("Invalid data format. Missing shop property.");
        }
      } catch (error) {
        console.error("Error fetching shop info:", error);
      }
    };

    fetchShopInfo();
  }, [data]);

  const handleVisitStore = () => {
    console.log("Visit store clicked");
    // Placeholder for visiting the seller's store page
    // You may navigate to the store page here
  };

  const toggleFollow = () => {
    // Implement logic to toggle follow/unfollow
    setIsFollowing(!isFollowing);
    setFollowerCount((prevCount) => (isFollowing ? prevCount - 1 : prevCount + 1));
    // Placeholder for updating the follower count
    // You need to replace this with your actual API call to update the follower count
  };

  const getFormattedDate = () => {
    return moment(shopInfo?.shop?.createdAt).format("MMM YYYY");
  };
  // const totalReviewsLength =
  //   products &&
  //   products.reduce((acc, product) => acc + product.reviews.length, 0);

  // const totalRatings =
  //   products &&
  //   products.reduce(
  //     (acc, product) =>
  //       acc + product.reviews.reduce((sum, review) => sum + review.rating, 0),
  //     0
  //   );

  // const avg =  totalRatings / totalReviewsLength || 0;

  // const averageRating = avg.toFixed(2);

  const handleMessageSubmit = async () => {
    if (isAuthenticated) {
      console.log("data info",data)
      const groupTitle = data._id + user._id;
     
      const userId = user._id;
      console.log("user id",userId)
      const sellerId = shopInfo?.shop?._id;
      console.log("seller info",sellerId)
      console.log("user info ",userId)
      console.log("group ",groupTitle)
      await axios
        .post('http://localhost:5000/conversation/create', {
          groupTitle,
          userId,
          sellerId,
        })
        .then((res) => {
          navigate(`/inbox?${res.data.conversation._id}`,{ state: { data } });
          console.log("Conversation created:", res.data);
        })
        .catch((error) => {
          console.error("Error creating conversation:", error);
          // Placeholder for displaying error message
        });
    } else {
      console.log("User is not authenticated. Please login to create a conversation.");
      // Placeholder for displaying login message
    }
  };

  return (
    <div className="flex items-center bg-gray-100 p-4 shadow-md">
      <Link to={`/shop/preview/${shopInfo?.shop._id}`}>
        <img
          src={shopInfo?.shop?.avatar}
          alt="Seller Avatar"
          className="w-12 h-12 rounded-full mr-4 cursor-pointer"
          onClick={handleVisitStore}
        />
      </Link>
      <div className="flex-grow">
        <div>
          <h3
            className="text-lg font-bold cursor-pointer"
            onClick={handleVisitStore}
            title={`Joined: ${getFormattedDate()}`}
          >
            {data?.shop?.name}
          </h3>
          
        </div>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center">
          <p>{`Shop Address: ${shopInfo?.shop?.address}`}</p>
            {/* <p className="mr-4">{`Rating: ${data?.shop?.rating}`}</p> */}
           
            <h5 className="pb-3 text-[15px]">
              
              {/* ({averageRating}/5) Ratings */}
            </h5> 
          </div>
          <div className="flex items-center">
            {/* <div className="mr-4">
              <button
                className={`bg-blue-500 text-white px-3 py-1 rounded ${
                  isFollowing ? "bg-red-500" : ""
                }`}
                onClick={toggleFollow}
              >
                {isFollowing ? (
                  <>
                    <AiOutlineMinus size={20} />
                    {followerCount > 0 && <span className="ml-1">{followerCount}</span>}
                  </>
                ) : (
                  <>
                    <AiOutlinePlus size={20} />
                    {followerCount > 0 && <span className="ml-1">{followerCount}</span>}
                  </>
                )}
              </button>
            </div> */}
            <button
              className="bg-gray-500 text-white px-3 py-1 rounded"
              onClick={handleMessageSubmit}
            >
              <AiOutlineMessage className="ml-1" /> Chat Us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

SellerHeader.propTypes = {
  data: PropTypes.object.isRequired,
};

export default SellerHeader;
