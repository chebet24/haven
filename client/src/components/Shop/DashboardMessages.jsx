import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineArrowRight, AiOutlineSend } from "react-icons/ai";
import { TfiGallery } from "react-icons/tfi";
import socketIO from "socket.io-client";
import { format } from "timeago.js";
import styles from "../../styles/style";
import { Avatar } from "@mui/material";
import { CgProfile } from "react-icons/cg";


const ENDPOINT = "http://localhost:4000";
const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });

// Replace the following line with your server URL
const server = "http://localhost:5000";

const CustomAvatar = ({ user }) => {
  useEffect(() => {
    console.log("Props in CustomAvatar:", user); // Log the received props
  }, [user]);

  if (!user) {
    return <CgProfile size={30} />;
  }

  if (user.avatar && user.avatar.length > 0) {
    return <Avatar src={user.avatar} />;
  } else if (user.name) {
    const firstLetter = user.name.charAt(0).toUpperCase();
    return <Avatar style={{ backgroundColor: 'green' }}>{firstLetter}</Avatar>;
  } else {
    // Return a fallback component in case user data is incomplete
    return <CgProfile size={30} />;
  }
};

const DashboardMessages = () => {
  const [seller, setSeller] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [conversations, setConversations] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [userData, setUserData] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [activeStatus, setActiveStatus] = useState(false);
  const [images, setImages] = useState(); // Corrected initialization
  const [open, setOpen] = useState(false);
  const scrollRef = useRef(null);
  const [showGroupModal, setShowGroupModal] = useState(false);

  let shopId; 
  useEffect(() => {
    const fetchSeller = () => {
      const SellerData = localStorage.getItem("sellerData");
      console.log("local storage ", SellerData);
      if (SellerData) {
        const newSellerData = JSON.parse(SellerData);
        setSeller(newSellerData);
        setIsLoading(false);
      } else {
        console.error("Seller information not found in localStorage");
        setIsLoading(false);
      }
    };
    fetchSeller();
  }, []);

  useEffect(() => {
    socketId.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    const getConversation = async () => {
      try {
        const shopId = seller.shop._id
        const response = await fetch(
          `${server}/conversation/get-all-conversation-seller/${shopId}`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        setConversations(data.conversations);
      } catch (error) {
        console.error(error);
      }
    };
    getConversation();
  }, [seller, messages]);

  useEffect(() => {
    if (seller) {
      const sellerId = seller?._id;
      socketId.emit("addUser", sellerId);
      socketId.on("getUsers", (data) => {
        setOnlineUsers(data);
      });
    }
  }, [seller]);

  const onlineCheck = (chat) => {
    const chatMembers = chat.members.find((member) => member !== seller?._id);
    const online = onlineUsers.find((user) => user.userId === chatMembers);
    return online ? true : false;
  };

  useEffect(() => {
    const getMessage = async () => {
      try {
        const response = await fetch(
          `${server}/message/get-all-messages/${currentChat?._id}`
        );
        const data = await response.json();
        setMessages(data.messages);
      } catch (error) {
        console.error(error);
      }
    };
    getMessage();
  }, [currentChat]);

  const sendMessageHandler = async (e) => {
    e.preventDefault();
    const message = {
      sender: seller._id,
      text: newMessage,
      conversationId: currentChat._id,
    };
    const receiverId = currentChat.members.find(
      (member) => member !== seller._id
    );
    socketId.emit("sendMessage", {
      senderId: seller._id,
      receiverId,
      text: newMessage,
    });
    try {
      if (newMessage !== "") {
        const response = await fetch(
          `${server}/message/create`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(message),
          }
        );
        const data = await response.json();
        setMessages([...messages, data.message]);
        updateLastMessage();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const updateLastMessage = async () => {
    socketId.emit("updateLastMessage", {
      lastMessage: newMessage,
      lastMessageId: seller._id,
    });
    try {
      const response = await fetch(
        `${server}/conversation/update-last-message/${currentChat._id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            lastMessage: newMessage,
            lastMessageId: seller._id,
          }),
        }
      );
      const data = await response.json();
      console.log(data.conversation);
      setNewMessage("");
    } catch (error) {
      console.error(error);
    }
  };

  const handleImageUpload = async (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setImages(reader.result);
        imageSendingHandler(reader.result);
      }
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  const imageSendingHandler = async (e) => {
    const receiverId = currentChat.members.find(
      (member) => member !== seller._id
    );
    socketId.emit("sendMessage", {
      senderId: seller._id,
      receiverId,
      images: e,
    });
    try {
      const response = await fetch(
        `${server}/message/create`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            images: e,
            sender: seller._id,
            text: newMessage,
            conversationId: currentChat._id,
          }),
        }
      );
      const data = await response.json();
      setImages(); // Reset images state after sending
      setMessages([...messages, data.message]);
      updateLastMessageForImage();
    } catch (error) {
      console.error(error);
    }
  };

  const updateLastMessageForImage = async () => {
    try {
      await fetch(
        `${server}/conversation/update-last-message/${currentChat._id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            lastMessage: "Photo",
            lastMessageId: seller._id,
          }),
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // const createGroupHandler = async () => {
  //   try {
  //     const response = await fetch(`${server}/group/create`, {
  //       method: "POST",
  //       credentials: "include",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         name: "New Group",
  //         members: [seller._id],
  //       }),
  //     });
  //     const data = await response.json();
  //     console.log("Group created:", data.group);
  //     // Optionally, you can redirect to the newly created group's chat page
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  return (
    <div className="w-[90%] bg-white m-5 h-[85vh] overflow-y-scroll rounded">
      {!open && (
        <>
          <h1 className="text-center text-[30px] py-3 font-Poppins">
            All Messages
          </h1>
          {/* All messages list */}
          {conversations &&
            conversations.map((item, index) => (
              <MessageList
                data={item}
                key={index}
                index={index}
                setOpen={setOpen}
                setCurrentChat={setCurrentChat}
                me={seller._id}
                setUserData={setUserData}
                userData={userData}
                online={onlineCheck(item)}
                setActiveStatus={setActiveStatus}
                isLoading={isLoading}
              />
            ))}
        </>
      )}

      {open && (
        <SellerInbox
          setOpen={setOpen}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          sendMessageHandler={sendMessageHandler}
          messages={messages}
          sellerId={seller._id}
          userData={userData}
          activeStatus={activeStatus}
          scrollRef={scrollRef}
          setMessages={setMessages}
          handleImageUpload={handleImageUpload}
        />
      )}

      {/* Button to create a group */}
      {/* <div className="flex justify-center mt-4">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={createGroupHandler}
        >
          Create Group
        </button>
      </div> */}
    </div>
  );
};


const MessageList = ({
data,
index,
setOpen,
setCurrentChat,
me,
setUserData,
online,
setActiveStatus,
isLoading,
}) => {
const [user, setUser] = useState([]);
const navigate = useNavigate();
const handleClick = (id) => {
  navigate(`/shop/dashboard-messages?${id}`);
  setOpen(true);
};
const [active, setActive] = useState(0);

useEffect(() => {
  const userId = data.members.find((user) => user !== me);

  const getUser = async () => {
    try {
      const response = await fetch(`${server}/user/get/${userId}`);
      const data = await response.json();
      setUser(data.user);
    } catch (error) {
      console.error(error);
    }
  };
  getUser();
}, [me, data]);

return (
  <div
    className={`w-full flex p-3 px-3 ${
      active === index ? "bg-[#00000010]" : "bg-transparent"
    }  cursor-pointer`}
    onClick={(e) =>
      setActive(index) ||
      handleClick(data._id) ||
      setCurrentChat(data) ||
      setUserData(user) ||
      setActiveStatus(online)
    }
  >

    <div className="relative">
    <CustomAvatar user={user} />
      {online ? (
        <div className="w-[12px] h-[12px] bg-green-400 rounded-full absolute top-[2px] right-[2px]" />
      ) : (
        <div className="w-[12px] h-[12px] bg-[#c7b9b9] rounded-full absolute top-[2px] right-[2px]" />
      )}
    </div>
    <div className="pl-3">
      <h1 className="text-[18px]">{user?.name}</h1>
      <p className="text-[16px] text-[#000c]">
        {!isLoading && data?.lastMessageId !== user?._id
          ? "You:"
          : user?.name.split(" ")[0] + ": "}{" "}
        {data?.lastMessage}
      </p>
    </div>
  </div>
);
};

const SellerInbox = ({
  scrollRef,
  setOpen,
  newMessage,
  setNewMessage,
  sendMessageHandler,
  messages,
  sellerId,
  userData,
  activeStatus,
  handleImageUpload,
}) => {
  const markAsSeen = async (messageId) => {
    try {
      await fetch(`${server}/message/seen/${messageId}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // When component mounts or messages change, mark unseen messages as seen
    messages.forEach((message) => {
      if (message.sender !== sellerId && !message.seen) {
        markAsSeen(message._id);
      }
    });
  }, [messages, sellerId]);
  return (
    <div className="w-full min-h-full flex flex-col justify-between">
      {/* message header */}
      <div className="w-full flex p-3 items-center justify-between bg-slate-200">
        <div className="flex">
          <CustomAvatar user={userData} />
          <div className="pl-3">
            <h1 className="text-[18px] font-[600]">{userData?.name}</h1>
            <h1>{activeStatus ? "Active Now" : ""}</h1>
          </div>
        </div>
        <AiOutlineArrowRight
          size={20}
          className="cursor-pointer"
          onClick={() => setOpen(false)}
        />
      </div>

      {/* messages */}
      <div className="px-3 h-[65vh] py-3 overflow-y-scroll">
        {messages &&
          messages.map((item, index) => {
            return (
              <div
                className={`flex w-full my-2 ${
                  item.sender === sellerId ? "justify-end" : "justify-start"
                }`}
                ref={scrollRef}
                key={index} // Added key prop
              >
                {item.sender !== sellerId && (
                  <CustomAvatar user={userData} />
                )}
                {item.images && (
                  <img
                    src={`${item.images?.url}`}
                    className="w-[300px] h-[300px] object-cover rounded-[10px] mr-2"
                    alt=""
                  />
                )}
                {item.text !== "" && (
                  <div>
                    <div
                      className={`w-max p-2 rounded ${
                        item.sender === sellerId ? "bg-[#000]" : "bg-[#38c776]"
                      } text-[#fff] h-min`}
                    >
                      <p>{item.text}</p>
                    </div>

                    <p className="text-[12px] text-[#000000d3] pt-1">
                      {format(item.createdAt)}
                    </p>
                  </div>
                )}

                {/* Seen status */}
                {item.seen && (
                  <div className="text-xs text-gray-400">
                    {item.sender === sellerId ? "Seen" : ""}
                  </div>
                )}
              </div>
            );
          })}
      </div>

      {/* send message input */}
      <form
        aria-required={true}
        className="p-3 relative w-full flex justify-between items-center"
        onSubmit={sendMessageHandler}
      >
        <div className="w-[30px]">
          <input
            type="file"
            name=""
            id="image"
            className="hidden"
            onChange={handleImageUpload}
          />
          <label htmlFor="image">
            <TfiGallery className="cursor-pointer" size={20} />
          </label>
        </div>
        <div className="w-full">
          <input
            type="text"
            required
            placeholder="Enter your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className={`${styles.input}`}
          />
          <input type="submit" value="Send" className="hidden" id="send" />
          <label htmlFor="send">
            <AiOutlineSend
              size={20}
              className="absolute right-4 top-5 cursor-pointer"
            />
          </label>
        </div>
      </form>
    </div>
  );
};




export default DashboardMessages;


