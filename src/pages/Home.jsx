import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ColorSwitch from "../components/ColorSwitch";
import "./Home.css";

const Home = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  if (!localStorage.getItem("selectedTheme")) {
    localStorage.setItem(
      "selectedTheme",
      JSON.stringify({
        name: "Default",
        color: "#FFF",
        background:
          "linear-gradient(239.26deg, #ddeeed 63.17%, #fdf1e0 94.92%)",
      })
    );
  }
  const parsedTheme = JSON.parse(localStorage.getItem("selectedTheme"));

  const delay = parseInt(queryParams.get("delay")) || 1000;

  const messagesArray = [
    { type: "predefined", text: "Hi there! 👋", delay },
    {
      type: "predefined",
      text: "I'm Wysa - an AI chatbot built by therapists.",
      delay,
    },
    {
      type: "predefined",
      text: "I'm here to understand your concerns and connect you with the best resources available to support you.",
      delay,
    },
    {
      type: "predefined",
      text: "Check out this image:",
      image:
        "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
      delay,
    },
    { type: "predefined", text: "Can I help?", delay },
  ];

  const [messageColor, setMessageColor] = useState(parsedTheme.color || "#FFF");
  const [containerBackground, setContainerBackground] = useState(
    parsedTheme.background ||
      "linear-gradient(239.26deg, #ddeeed 63.17%, #fdf1e0 94.92%)"
  );
  const [showColorSwitch, setShowColorSwitch] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [messages, setMessages] = useState(messagesArray);
  const [inputText, setInputText] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentMessageIndex < messages.length - 1) {
        setCurrentMessageIndex(currentMessageIndex + 1);
      }
    }, messages[currentMessageIndex].delay);

    return () => clearTimeout(timer);
  }, [currentMessageIndex, messages]);

  const handleColorChange = (color, background) => {
    setMessageColor(color);
    setContainerBackground(background);
  };

  const handleButtonClick = () => {
    setShowColorSwitch(true);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (inputText) {
      const newMessage = { text: inputText, type: "user" };
      setInputText("");
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    }
  };

  const [selectedPicture, setSelectedPicture] = useState(null);

  const handleImageFormSubmit = (event) => {
    event.preventDefault();
    const file = document.getElementById("profile").files[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setSelectedPicture(reader.result);
    };
    document.getElementById("profile").value = "";
  };

  return (
    <div className="home-container" style={{ background: containerBackground }}>
      <div className="profile-picture-upload">
        <form className="profile-upload" onSubmit={handleImageFormSubmit}>
          <label htmlFor="profile">Upload Profile</label>
          <input type="file" id="profile" name="profile" accept="image/*" />
          <button type="submit">Upload</button>
        </form>
        {selectedPicture && (
          <div className="profile-picture-container">
            <img
              src={selectedPicture}
              alt="Profile"
              className="profile-picture"
            />
          </div>
        )}
      </div>
      <div className="messages">
        {messages.slice(0, currentMessageIndex + 1).map((message, index) => (
          <div
            key={index}
            className={`message ${message.type === "user" ? "right" : ""}`}
            style={{ backgroundColor: messageColor }}
          >
            {message.text}
            {message.image && (
              <img src={message.image} alt="chat" className="message-image" />
            )}
          </div>
        ))}
      </div>
      <form className="input-form" onSubmit={handleFormSubmit}>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type your message..."
        />
        <button type="submit">Send</button>
      </form>
      {!showColorSwitch && (
        <button className="color-switch-button" onClick={handleButtonClick}>
          Change Theme
        </button>
      )}
      {showColorSwitch && <ColorSwitch onColorChange={handleColorChange} />}
    </div>
  );
};

export default Home;
