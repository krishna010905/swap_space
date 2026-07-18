import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "../axios";
import { selectUser } from "../store/authSlice";
import { useParams } from "react-router-dom";
import defaultImage from '../assets/default.jpg' ;

const Conversation = () => {
  const { receiverId } = useParams();
  const loggedInUser = useSelector(selectUser);
  const [messages, setMessages] = useState([]);
  const [receivingUser, setReceivingUser] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

//   console.log(loggedInUser)
//   console.log(receiverId)
  useEffect(() => {
    const fetchReceivingUser = async () => {
        try {
            const res = await axios.get(`/users/get-user-data/${receiverId}`);
            setReceivingUser(res.data.data);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch user data");
        }
    };
    fetchReceivingUser();
  }, [receiverId]);


  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const res = await axios.post("/users/get-all-previous-messages", {
          sender: loggedInUser._id,
          receiver: receiverId,
        });
        setMessages(res.data.data);
        // console.log(res.data.data)
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch messages");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [receiverId, loggedInUser._id]);


  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const res = await axios.post("/users/send-message", {
        sender: loggedInUser._id,
        receiver: receiverId,
        message: newMessage,
      });

      setMessages([...messages, res.data.data]);
      setNewMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-dark-primary p-6 rounded-lg max-w-2xl mx-auto">
        {/* Receiver Profile Section */}
        {receivingUser && (
            <div className="flex items-center space-x-4 bg-dark-primary/80 p-4 rounded-lg mb-4 border border-gray-700">
                <img
                src={receivingUser.profileImage || defaultImage}
                alt={receivingUser.name}
                className="w-12 h-12 rounded-full object-cover border border-gray-600"
                />
                <div>
                <h3 className="text-xl font-semibold text-light-blue">{receivingUser.name}</h3>
                <p className="text-gray-400 text-sm">{receivingUser.email}</p>
                </div>
            </div>
        )}


<div className="flex-1 overflow-y-auto bg-dark-primary/80 p-4 rounded-lg space-y-3">
        {loading ? (
          <p className="text-gray-400">Loading messages...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : messages.length === 0 ? (
          <p className="text-gray-400">No messages yet</p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg._id}
              className={`p-2 rounded-lg max-w-xs ${
                msg.sender === loggedInUser._id
                  ? "bg-light-blue text-dark-primary self-end"
                  : "bg-gray-700 text-white self-start"
              }`}
            >
              {msg.message}
            </div>
          ))
        )}
      </div>

      {/* Message Input Section */}
      <div className="flex items-center mt-4 border-t border-gray-600 pt-4">
        <input
          type="text"
          className="flex-1 p-2 rounded-lg bg-gray-700 text-white border border-gray-500 focus:outline-none focus:ring-2 focus:ring-light-blue"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="ml-2 bg-light-blue text-dark-primary px-4 py-2 rounded-lg hover:bg-opacity-90"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Conversation;
