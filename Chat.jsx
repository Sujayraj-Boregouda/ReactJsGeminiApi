"use client";
import { useState } from "react";

export default function ChatComponent() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {
        if (!input.trim()) return;
    
        const newMessages = [...messages, { role: "user", text: input }];
        setMessages(newMessages);
        setInput("");
        setLoading(true);
    
        try {
            const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/chat", { 
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: input, history: newMessages }),
            });
    
            const data = await response.json();
            if (data.response) {
                const botMessage = { role: "model", text: data.response }; // FIX: "model" instead of "bot"
                setMessages([...newMessages, botMessage]);
            }
        } catch (error) {
            console.error("Error sending message:", error);
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="chat-container">
            <div className="chat-box">
                {messages.map((msg, i) => (
                    <div key={i} className={msg.role === "user" ? "chat-user" : "chat-bot"}>
                        <p>{msg.text}</p>
                    </div>
                ))}
                {loading && <div className="loading">Thinking...</div>}
            </div>
            <div className="chat-input">
                <input 
                    type="text" 
                    value={input} 
                    onChange={(e) => setInput(e.target.value)} 
                    placeholder="Type your message..."
                />
                <button onClick={sendMessage} disabled={loading}>Send</button>
            </div>
            <style jsx>{`
                .chat-container {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    width: 300px;
                    background: white;
                    border-radius: 8px;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
                    overflow: hidden;
                }
                .chat-box {
                    max-height: 400px;
                    overflow-y: auto;
                    padding: 10px;
                }
                .chat-user {
                    background: #007bff;
                    color: white;
                    padding: 8px;
                    margin: 5px;
                    border-radius: 6px;
                    text-align: right;
                }
                .chat-bot {
                    background: #f1f1f1;
                    color: black;
                    padding: 8px;
                    margin: 5px;
                    border-radius: 6px;
                    text-align: left;
                }
                .chat-input {
                    display: flex;
                    border-top: 1px solid #ccc;
                    padding: 5px;
                }
                .chat-input input {
                    flex: 1;
                    padding: 8px;
                    border: none;
                    outline: none;
                }
                .chat-input button {
                    padding: 8px;
                    background: #007bff;
                    color: white;
                    border: none;
                    cursor: pointer;
                }
                .loading {
                    text-align: center;
                    padding: 5px;
                    font-size: 14px;
                    color: gray;
                }
            `}</style>
        </div>
    );
}