// import React, { useRef, useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { AiOutlineArrowRight, AiOutlineSend } from "react-icons/ai";
// import styles from "../../styles/style";
// import { TfiGallery } from "react-icons/tfi";
// import socketIO from "socket.io-client";
// import { format } from "timeago.js";

// const ENDPOINT = "";
// const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });

// // Replace the following line with your server URL
// const server = "https://localhost:5000";

// const DashboardMessages = () => {
//   const { seller, isLoading } = useSelector((state) => state.seller);
//   const [conversations, setConversations] = useState([]);
//   const [arrivalMessage, setArrivalMessage] = useState(null);
//   const [currentChat, setCurrentChat] = useState();
//   const [messages, setMessages] = useState([]);
//   const [userData, setUserData] = useState(null);
//   const [newMessage, setNewMessage] = useState("");
//   const [onlineUsers, setOnlineUsers] = useState([]);
//   const [activeStatus, setActiveStatus] = useState(false);
//   const [images, setImages] = useState();
//   const [open, setOpen] = useState(false);
//   const scrollRef = useRef(null);

//   useEffect(() => {
//     socketId.on("getMessage", (data) => {
//       setArrivalMessage({
//         sender: data.senderId,
//         text: data.text,
//         createdAt: Date.now(),
//       });
//     });
//   }, []);

//   useEffect(() => {
//     arrivalMessage &&
//       currentChat?.members.includes(arrivalMessage.sender) &&
//       setMessages((prev) => [...prev, arrivalMessage]);
//   }, [arrivalMessage, currentChat]);

//   useEffect(() => {
//     const getConversation = async () => {
//       try {
//         const response = await fetch(
//           `${server}/conversation/get-all-conversation-seller/${seller?._id}`,
//           {
//             method: "GET",
//             credentials: "include",
//             headers: {
//               "Content-Type": "application/json",
//             },
//           }
//         );
//         const data = await response.json();

//         setConversations(data.conversations);
//       } catch (error) {
//         console.error(error);
//       }
//     };
//     getConversation();
//   }, [seller, messages]);

//   useEffect(() => {
//     if (seller) {
//       const sellerId = seller?._id;
//       socketId.emit("addUser", sellerId);
//       socketId.on("getUsers", (data) => {
//         setOnlineUsers(data);
//       });
//     }
//   }, [seller]);

//   const onlineCheck = (chat) => {
//     const chatMembers = chat.members.find((member) => member !== seller?._id);
//     const online = onlineUsers.find((user) => user.userId === chatMembers);

//     return online ? true : false;
//   };

//   useEffect(() => {
//     const getMessage = async () => {
//       try {
//         const response = await fetch(
//           `${server}/message/get-all-messages/${currentChat?._id}`
//         );
//         const data = await response.json();

//         setMessages(data.messages);
//       } catch (error) {
//         console.error(error);
//       }
//     };
//     getMessage();
//   }, [currentChat]);

//   const sendMessageHandler = async (e) => {
//     e.preventDefault();

//     const message = {
//       sender: seller._id,
//       text: newMessage,
//       conversationId: currentChat._id,
//     };

//     const receiverId = currentChat.members.find(
//       (member) => member.id !== seller._id
//     );

//     socketId.emit("sendMessage", {
//       senderId: seller._id,
//       receiverId,
//       text: newMessage,
//     });

//     try {
//       if (newMessage !== "") {
//         const response = await fetch(
//           `${server}/message/create-new-message`,
//           {
//             method: "POST",
//             credentials: "include",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify(message),
//           }
//         );
//         const data = await response.json();

//         setMessages([...messages, data.message]);
//         updateLastMessage();
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const updateLastMessage = async () => {
//     socketId.emit("updateLastMessage", {
//       lastMessage: newMessage,
//       lastMessageId: seller._id,
//     });

//     try {
//       const response = await fetch(
//         `${server}/conversation/update-last-message/${currentChat._id}`,
//         {
//           method: "PUT",
//           credentials: "include",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             lastMessage: newMessage,
//             lastMessageId: seller._id,
//           }),
//         }
//       );
//       const data = await response.json();

//       console.log(data.conversation);
//       setNewMessage("");
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handleImageUpload = async (e) => {
//     const reader = new FileReader();

//     reader.onload = () => {
//       if (reader.readyState === 2) {
//         setImages(reader.result);
//         imageSendingHandler(reader.result);
//       }
//     };

//     reader.readAsDataURL(e.target.files[0]);
//   };

//   const imageSendingHandler = async (e) => {
//     const receiverId = currentChat.members.find(
//       (member) => member !== seller._id
//     );

//     socketId.emit("sendMessage", {
//       senderId: seller._id,
//       receiverId,
//       images: e,
//     });

//     try {
//       const response = await fetch(
//         `${server}/message/create-new-message`,
//         {
//           method: "POST",
//           credentials: "include",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             images: e,
//             sender: seller._id,
//             text: newMessage,
//             conversationId: currentChat._id,
//           }),
//         }
//       );
//       const data = await response.json();

//       setImages();
//       setMessages([...messages, data.message]);
//       updateLastMessageForImage();
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const updateLastMessageForImage = async () => {
//     try {
//       await fetch(
//         `${server}/conversation/update-last-message/${currentChat._id}`,
//         {
//           method: "PUT",
//           credentials: "include",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             lastMessage: "Photo",
//             lastMessageId: seller._id,
//           }),
//         }
//       );
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   useEffect(() => {
//     scrollRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   return (
//     <div className="w-[90%] bg-white m-5 h-[85vh] overflow-y-scroll rounded">
//       {!open && (
//         <>
//           <h1 className="text-center text-[30px] py-3 font-Poppins">
//             All Messages
//           </h1>
//           {/* All messages list */}
//           {conversations &&
//             conversations.map((item, index) => (
//               <MessageList
//                 data={item}
//                 key={index}
//                 index={index}
//                 setOpen={setOpen}
//                 setCurrentChat={setCurrentChat}
//                 me={seller._id}
//                 setUserData={setUserData}
//                 userData={userData}
//                 online={onlineCheck(item)}
//                 setActiveStatus={setActiveStatus}
//                 isLoading={isLoading}
//               />
//             ))}
//         </>
//       )}

//       {open && (
//         <SellerInbox
//           setOpen={setOpen}
//           newMessage={newMessage}
//           setNewMessage={setNewMessage}
//           sendMessageHandler={sendMessageHandler}
//           messages={messages}
//           sellerId={seller._id}
//           userData={userData}
//           activeStatus={activeStatus}
//           scrollRef={scrollRef}
//           setMessages={setMessages}
//           handleImageUpload={handleImageUpload}
//         />
//       )}
//     </div>
//   );
// };

// const MessageList = ({
//   data,
//   index,
//   setOpen,
//   setCurrentChat,
//   me,
//   setUserData,
//   online,
//   setActiveStatus,
//   isLoading,
// }) => {
//   console.log(data);
//   const [user, setUser] = useState([]);
//   const navigate = useNavigate();
//   const handleClick = (id) => {
//     navigate(`/dashboard-messages?${id}`);
//     setOpen(true);
//   };
//   const [active, setActive] = useState(0);

//   useEffect(() => {
//     const userId = data.members.find((user) => user !== me);

//     const getUser = async () => {
//       try {
//         const response = await fetch(`${server}/user/user-info/${userId}`);
//         const data = await response.json();
//         setUser(data.user);
//       } catch (error) {
//         console.error(error);
//       }
//     };
//     getUser();
//   }, [me, data]);

//   return (
//     <div
//       className={`w-full flex p-3 px-3 ${
//         active === index ? "bg-[#00000010]" : "bg-transparent"
//       }  cursor-pointer`}
//       onClick={(e) =>
//         setActive(index) ||
//         handleClick(data._id) ||
//         setCurrentChat(data) ||
//         setUserData(user) ||
//         setActiveStatus(online)
//       }
//     >
//       <div className="relative">
//         <img
//           src={`${user?.avatar?.url}`}
//           alt=""
//           className="w-[50px] h-[50px] rounded-full"
//         />
//         {online ? (
//           <div className="w-[12px] h-[12px] bg-green-400 rounded-full absolute top-[2px] right-[2px]" />
//         ) : (
//           <div className="w-[12px] h-[12px] bg-[#c7b9b9] rounded-full absolute top-[2px] right-[2px]" />
//         )}
//       </div>
//       <div className="pl-3">
//         <h1 className="text-[18px]">{user?.name}</h1>
//         <p className="text-[16px] text-[#000c]">
//           {!isLoading && data?.lastMessageId !== user?._id
//             ? "You:"
//             : user?.name.split(" ")[0] + ": "}{" "}
//           {data?.lastMessage}
//         </p>
//       </div>
//     </div>
//   );
// };

// const SellerInbox = ({
//   scrollRef,
//   setOpen,
//   newMessage,
//   setNewMessage,
//   sendMessageHandler,
//   messages,
//   sellerId,
//   userData,
//   activeStatus,
//   handleImageUpload,
// }) => {
//   return (
//     <div className="w-full min-h-full flex flex-col justify-between">
//       {/* message header */}
//       <div className="w-full flex p-3 items-center justify-between bg-slate-200">
//         <div className="flex">
//           <img
//             src={`${userData?.avatar?.url}`}
//             alt=""
//             className="w-[60px] h-[60px] rounded-full"
//           />
//           <div className="pl-3">
//             <h1 className="text-[18px] font-[600]">{userData?.name}</h1>
//             <h1>{activeStatus ? "Active Now" : ""}</h1>
//           </div>
//         </div>
//         <AiOutlineArrowRight
//           size={20}
//           className="cursor-pointer"
//           onClick={() => setOpen(false)}
//         />
//       </div>

//       {/* messages */}
//       <div className="px-3 h-[65vh] py-3 overflow-y-scroll">
//         {messages &&
//           messages.map((item, index) => {
//             return (
//               <div
//                 className={`flex w-full my-2 ${
//                   item.sender === sellerId ? "justify-end" : "justify-start"
//                 }`}
//                 ref={scrollRef}
//               >
//                 {item.sender !== sellerId && (
//                   <img
//                     src={`${userData?.avatar?.url}`}
//                     className="w-[40px] h-[40px] rounded-full mr-3"
//                     alt=""
//                   />
//                 )}
//                 {item.images && (
//                   <img
//                     src={`${item.images?.url}`}
//                     className="w-[300px] h-[300px] object-cover rounded-[10px] mr-2"
//                   />
//                 )}
//                 {item.text !== "" && (
//                   <div>
//                     <div
//                       className={`w-max p-2 rounded ${
//                         item.sender === sellerId ? "bg-[#000]" : "bg-[#38c776]"
//                       } text-[#fff] h-min`}
//                     >
//                       <p>{item.text}</p>
//                     </div>

//                     <p className="text-[12px] text-[#000000d3] pt-1">
//                       {format(item.createdAt)}
//                     </p>
//                   </div>
//                 )}
//               </div>
//             );
//           })}
//       </div>

//       {/* send message input */}
//       <form
//         aria-required={true}
//         className="p-3 relative w-full flex justify-between items-center"
//         onSubmit={sendMessageHandler}
//       >
//         <div className="w-[30px]">
//           <input
//             type="file"
//             name=""
//             id="image"
//             className="hidden"
//             onChange={handleImageUpload}
//           />
//           <label htmlFor="image">
//             <TfiGallery className="cursor-pointer" size={20} />
//           </label>
//         </div>
//         <div className="w-full">
//           <input
//             type="text"
//             required
//             placeholder="Enter your message..."
//             value={newMessage}
//             onChange={(e) => setNewMessage(e.target.value)}
//             className={`${styles.input}`}
//           />
//           <input type="submit" value="Send" className="hidden" id="send" />
//           <label htmlFor="send">
//             <AiOutlineSend
//               size={20}
//               className="absolute right-4 top-5 cursor-pointer"
//             />
//           </label>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default DashboardMessages;
