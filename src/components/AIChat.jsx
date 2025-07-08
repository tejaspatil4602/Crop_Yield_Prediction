import React, { useState, useRef, useEffect } from "react";
import "./AIChat.css";
import HeadsetMicIcon from "@mui/icons-material/HeadsetMic";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import { Typography } from "@mui/material";

export const AIChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    const savedHistory = localStorage.getItem("chat_history");
    return savedHistory ? JSON.parse(savedHistory) : [];
  });
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hasError, setHasError] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("chat_history", JSON.stringify(messages));
  }, [messages]);

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem("chat_history");
  };

  const formatMessagesContext = (messages) => {
    return messages.map((msg) => `${msg.type}: ${msg.content}`).join("\n");
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage = {
      type: "user",
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch(
        (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5002') + '/api/gemini-chat', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              parts: [
                {
                  text: `You are a helpful AI assistant focused on agricultural and farming topics. Please provide thoughtful, comprehensive responses to the user's questions while maintaining natural conversation flow.\n\nPrevious conversation:\n${formatMessagesContext(messages)}\n\nCurrent message: ${input}\n\nRespond in a clear, friendly manner using proper Markdown formatting when appropriate.`,
                },
              ],
            },
          ],
        }),
      });
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      const aiMessage = {
        type: "ai",
        content: data.candidates?.[0]?.content?.parts?.[0]?.text || "No response from AI.",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          type: "ai",
          content: `Sorry, I encountered an error. Please try again. (${error.message})`,
        },
      ]);
      setHasError(true);
    } finally {
      setIsTyping(false);
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-4 right-4 z-[1000]">
      {!isOpen ? (
        <button onClick={toggleChat} className="chat-button group">
          <HeadsetMicIcon className="icon" />
          <span className="text">Chat with AI</span>
        </button>
      ) : (
        <div className="chat-container rounded-2xl w-[380px] max-w-[95vw] h-[600px] max-h-[90vh] flex flex-col bg-white/95 backdrop-blur-xl border border-blue-200/50 shadow-2xl overflow-hidden">
          {/* Chat Header */}
          <div className="flex items-center justify-between p-4 border-b border-blue-100">
            <div className="flex items-center gap-2">
              <ChatBubbleIcon className="text-purple-500" />
              <h3 className="font-semibold text-gray-800">AI Assistant</h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={clearChat}
                className="p-2 text-sm bg-red-500/90 hover:bg-red-600 text-white rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105"
              >
                Clear
              </button>
              <button
                onClick={toggleChat}
                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <CloseIcon className="text-gray-500" />
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 chat-messages">
            {hasError && (
              <div className="flex justify-center mb-4">
                <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg">
                  Error: Could not connect to AI backend. Please try again later.
                </div>
              </div>
            )}
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.type === "user" ? "justify-end" : "justify-start"
                } mb-4 animate-fade-in`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    message.type === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start mb-4">
                <div className="bg-gray-100 rounded-2xl px-4 py-2 text-gray-500">
                  AI is typing...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-4 border-t border-blue-100">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="message-input flex-1"
                disabled={isTyping}
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="send-button p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <SendIcon />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AIChat;
