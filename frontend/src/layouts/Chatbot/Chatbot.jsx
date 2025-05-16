import React, { useState, useRef, useEffect, useContext } from 'react';
import ReactMarkdown from 'react-markdown'; // Import thêm react-markdown
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
        // Add focus to input when chat opens and scroll to bottom
        if (!isOpen) {
            setTimeout(() => {
                document.querySelector('.ts-chatbot-input input')?.focus();
                messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 300);
        }
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

    // Load messages from sessionStorage on component mount
    useEffect(() => {
        const savedMessages = sessionStorage.getItem('chatMessages');
        if (savedMessages) {
            setMessages(JSON.parse(savedMessages));
            // Add a small delay then scroll to bottom when messages are loaded
            if (isOpen) {
                setTimeout(() => {
                    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
                }, 100);
            }
        }
    }, [isOpen]);

    // Save messages to sessionStorage whenever they change
    useEffect(() => {
        sessionStorage.setItem('chatMessages', JSON.stringify(messages));
    }, [messages]);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="ts-chatbot-container">
            {/* Chat button - only shown when chat is closed */}
            {!isOpen && (
                <button
                    className="ts-chatbot-button"
                    onClick={toggleChat}
                    aria-label="Toggle chat"
                >
                    <FaRobot />
                </button>
            )}

            {/* Chat window */}
            {isOpen && (
                <div className="ts-chatbot-window ts-chatbot-window-no-button">
                    <div className="ts-chatbot-header">
                        <h3>TechShop Assistant</h3>
                        <button onClick={toggleChat} className="ts-close-button" aria-label="Close chat">
                            <FaTimes />
                        </button>
                    </div>

                    <div className="ts-chatbot-messages">
                        {messages.map((msg, index) => (
                            <div key={index} className={`ts-message ${msg.sender}`}>
                                <div className="ts-message-icon">
                                    {msg.sender === 'bot' ? <FaRobot /> : <FaUser />}
                                </div>
                                <div className="ts-message-text">
                                    <div className="ts-markdown-wrapper">
                                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="ts-message bot">
                                <div className="ts-message-icon"><FaRobot /></div>
                                <div className="ts-typing-indicator">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="ts-chatbot-input">
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