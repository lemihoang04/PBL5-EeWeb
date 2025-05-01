import React, { useState, useRef, useEffect, useContext } from 'react';
import { sendChatbotQuery } from '../../services/chatbotService';
import { UserContext } from '../../context/UserProvider';
import './Chatbot.css';
import { FaRobot, FaTimes, FaUser, FaPaperPlane } from 'react-icons/fa';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Hello! How can I help you with TechShop today?", sender: 'bot' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const { user } = useContext(UserContext);

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    const handleSend = async () => {
        if (input.trim() === '') return;

        // Add user message
        const userMessage = { text: input, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);

        try {
            // Get bot response
            const userId = user?.account?.id || null;
            const response = await sendChatbotQuery(input, userId);

            // Add bot response with a slight delay to simulate typing
            setTimeout(() => {
                if (response && !response.error) {
                    setMessages(prev => [...prev, { text: response.response.output, sender: 'bot' }]);
                } else {
                    setMessages(prev => [...prev, { text: "Sorry, I'm having trouble connecting right now. Please try again later.", sender: 'bot' }]);
                }
                setIsTyping(false);
            }, 600);
        } catch (error) {
            console.error('Error in chatbot:', error);
            setMessages(prev => [...prev, { text: "Sorry, something went wrong. Please try again.", sender: 'bot' }]);
            setIsTyping(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="chatbot-container">
            {/* Chat button */}
            <button
                className={`chatbot-button ${isOpen ? 'active' : ''}`}
                onClick={toggleChat}
                aria-label="Toggle chat"
            >
                {isOpen ? <FaTimes /> : <FaRobot />}
            </button>

            {/* Chat window */}
            {isOpen && (
                <div className="chatbot-window">
                    <div className="chatbot-header">
                        <h3>TechShop Assistant</h3>
                        <button onClick={toggleChat} className="close-button" aria-label="Close chat">
                            <FaTimes />
                        </button>
                    </div>

                    <div className="chatbot-messages">
                        {messages.map((msg, index) => (
                            <div key={index} className={`message ${msg.sender}`}>
                                <div className="message-icon">
                                    {msg.sender === 'bot' ? <FaRobot /> : <FaUser />}
                                </div>
                                <div className="message-text">{msg.text}</div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="message bot">
                                <div className="message-icon"><FaRobot /></div>
                                <div className="typing-indicator">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="chatbot-input">
                        <input
                            type="text"
                            placeholder="Type your message..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                        <button onClick={handleSend} disabled={isTyping}>
                            <FaPaperPlane />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chatbot;