import React, { useState } from "react";

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input) return;

    const newUserMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, newUserMsg]);

    const res = await fetch("http://localhost:3001/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    });
    const data = await res.json();

    const botMsg = { sender: "bot", text: data.response };
    setMessages((prev) => [...prev, botMsg]);
    setInput("");
  };

  const handleVoice = () => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.onresult = (event) => {
      setInput(event.results[0][0].transcript);
    };
    recognition.start();
  };

  return (
    <div>
      <div style={{ height: "300px", overflowY: "scroll", border: "1px solid #ddd", padding: "1rem", marginBottom: "1rem" }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ textAlign: msg.sender === "user" ? "right" : "left" }}>
            <strong>{msg.sender === "user" ? "You" : "Bot"}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} style={{ display: "flex", gap: "0.5rem" }}>
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type or use voice..." style={{ flex: 1 }} />
        <button type="button" onClick={handleVoice}>🎤</button>
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default Chatbot;