import React, { useState, useRef, useEffect } from "react";
import axios from "../api/axios"; 
import { X, Send, MessageSquare } from "lucide-react";

const MAX_LENGTH = 300;

const ChatBot = ({ userId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [expanded, setExpanded] = useState({});

  const messagesEndRef = useRef(null);

  const toggleChat = () => {
    setIsOpen((prev) => !prev);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await axios.post("/chat", {
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
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  const toggleReadMore = (index) => {
    setExpanded((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const renderMessage = (msg, idx) => {
    const isLong = msg.text.length > MAX_LENGTH;
    const isExpanded = expanded[idx];
    const displayedText =
      isLong && !isExpanded ? msg.text.slice(0, MAX_LENGTH) + "..." : msg.text;

    return (
      <div
        key={idx}
        className={`max-w-xs px-3 py-2 rounded-lg text-sm whitespace-pre-line ${
          msg.sender === "user"
            ? "ml-auto bg-blue-500 text-white"
            : "mr-auto bg-gray-200 text-gray-800"
        }`}
      >
        {displayedText}
        {isLong && (
          <button
            className="text-xs text-blue-600 ml-1 underline"
            onClick={() => toggleReadMore(idx)}
          >
            {isExpanded ? "Show Less" : "Read More"}
          </button>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700"
          onClick={toggleChat}
        >
          <MessageSquare />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 w-80 max-h-[32rem] bg-white rounded-xl shadow-lg flex flex-col z-50">
          {/* Header */}
          <div className="bg-blue-600 text-white p-3 rounded-t-xl flex justify-between items-center">
            <span className="font-semibold">DreamRoute Bot</span>
            <button onClick={toggleChat}>
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50" style={{ height: "20rem" }}>
            {messages.map((msg, idx) => renderMessage(msg, idx))}

            {isTyping && (
              <div className="mr-auto bg-gray-200 text-gray-800 px-3 py-2 rounded-lg text-sm animate-pulse">
                DreamRoute is typing...
              </div>
            )}

            <div ref={messagesEndRef} />
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
