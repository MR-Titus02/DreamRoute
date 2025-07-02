import React, { useState } from "react";
import axios from "../api/axios"; 
import { X, Send, MessageSquare } from "lucide-react";

const ChatBot = ({ userId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const res = await axios.post("/api/chat", {
        message: input,
        userId,
      });

      const botMessage = {
        sender: "bot",
        text: res.data.reply || "Sorry, I didn't get that.",
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Error fetching response. Try again later." },
      ]);
    }

    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <>
      {/* Floating Button */}
      <button
        className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700"
        onClick={toggleChat}
      >
        <MessageSquare />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 w-80 bg-white rounded-xl shadow-lg flex flex-col z-50">
          {/* Header */}
          <div className="bg-blue-600 text-white p-3 rounded-t-xl flex justify-between items-center">
            <span className="font-semibold">Career ChatBot</span>
            <button onClick={toggleChat}>
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 h-80 bg-gray-50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                  msg.sender === "user"
                    ? "ml-auto bg-blue-500 text-white"
                    : "mr-auto bg-gray-200 text-gray-800"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="flex border-t p-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="flex-1 text-sm p-2 border border-gray-300 rounded-lg focus:outline-none"
            />
            <button
              className="ml-2 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
              onClick={handleSend}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
