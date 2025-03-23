"use client";
import { useState } from "react";
import { X, MessageCircle } from "lucide-react"; // Icons for close & chat button
import DOMPurify from "dompurify"; // Import DOMPurify for security
import { marked } from "marked";   // Import Marked.js for Markdown parsing

export default function ChatComponent() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false); // Chatbox state

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
                setMessages([...newMessages, { role: "model", text: data.response }]);
            }
        } catch (error) {
            console.error("Error sending message:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="chatbot-container">
            {/* Chat Icon */}
            {!isOpen && (
                <button className="chat-icon" onClick={() => setIsOpen(true)}>
                    <MessageCircle size={28} />
                </button>
            )}

            {/* Chatbox */}
            {isOpen && (
                <div className="chatbox">
                    {/* Chat Header with Close Button */}
                    <div className="chat-header">
                        <span>Chat with Us</span>
                        <button className="close-btn" onClick={() => setIsOpen(false)}>
                            <X size={20} />
                        </button>
                    </div>

                    {/* Chat Messages */}
                    <div className="chat-box">
                        {messages.map((msg, i) => (
                            <div key={i} className={msg.role === "user" ? "chat-user" : "chat-bot"}>
                                <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(marked(msg.text)) }} />
                            </div>
                        ))}
                        {loading && <div className="loading">Thinking...</div>}
                    </div>

                    {/* Input Area */}
                    <div className="chat-input">
                        <input 
                            type="text" 
                            value={input} 
                            onChange={(e) => setInput(e.target.value)} 
                            placeholder="Type your message..."
                        />
                        <button onClick={sendMessage} disabled={loading}>Send</button>
                    </div>
                </div>
            )}

            {/* Styling */}
            <style jsx>{`
                .chatbot-container {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    z-index: 1000;
                }

                .chat-icon {
                    background: #2d4fe1;
                    color: white;
                    border: none;
                    border-radius: 50%;
                    width: 50px;
                    height: 50px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
                }

                .chatbox {
                    width: 320px;
                    background: white;
                    border-radius: 8px;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.2);
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    position: fixed;
                    bottom: 80px;
                    right: 20px;
                    animation: slideIn 0.3s ease-in-out;
                }

                @keyframes slideIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .chat-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 12px;
                    background: #2d4fe1;
                    color: white;
                    font-weight: bold;
                }

                .close-btn {
                    background: none;
                    border: none;
                    color: white;
                    cursor: pointer;
                }

                .chat-box {
                    max-height: 350px;
                    overflow-y: auto;
                    padding: 10px;
                }

                .chat-user {
                    background: #fdde27;
                    color: #000;
                    padding: 8px;
                    margin: 10px 0 10px auto;
                    border-radius: 6px;
                    text-align: right;
                    width: 80%;
                    max-width: max-content;
                }

                .chat-bot {
                    background: #f1f1f1;
                    color: black;
                    padding: 8px;
                    border-radius: 6px;
                    text-align: left;
                    margin: 10px auto 10px 0;
                    width: 80%;
                    max-width: max-content;
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
                    background: #2d4fe1;
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
