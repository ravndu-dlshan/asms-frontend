'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Minimize2 } from 'lucide-react';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

export default function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: "Hello! I'm your Carvo AI Assistant. How can I help you today?",
            sender: 'bot',
            timestamp: new Date(),
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (isOpen && !isMinimized) {
            inputRef.current?.focus();
        }
    }, [isOpen, isMinimized]);

    const generateBotResponse = (userMessage: string): string => {
        const message = userMessage.toLowerCase();
        
        // Simple response logic - you can replace this with actual AI API calls
        if (message.includes('service') || message.includes('repair')) {
            return "We offer a wide range of automotive services including oil changes, brake repairs, engine diagnostics, and routine maintenance. Would you like to schedule an appointment?";
        } else if (message.includes('appointment') || message.includes('book') || message.includes('schedule')) {
            return "I'd be happy to help you schedule an appointment! Please visit our Services page or call us at +94 412 25 678 to book a convenient time.";
        } else if (message.includes('price') || message.includes('cost')) {
            return "Our pricing varies depending on the service needed. For accurate quotes, please contact us directly or visit our shop for a free estimate.";
        } else if (message.includes('hour') || message.includes('open')) {
            return "We're open Monday to Saturday, 8:00 AM - 6:00 PM. Closed on Sundays and public holidays.";
        } else if (message.includes('location') || message.includes('address')) {
            return "You can find us at our service center. Check the Contacts page for our full address and directions!";
        } else if (message.includes('thank')) {
            return "You're welcome! Is there anything else I can help you with?";
        } else if (message.includes('bye') || message.includes('goodbye')) {
            return "Thank you for chatting with Carvo! Have a great day and drive safe! 🚗";
        } else {
            return "I understand you're asking about: '" + userMessage + "'. For detailed assistance, please call us at +94 412 25 678 or visit our Services page. How else can I help you?";
        }
    };

    const handleSendMessage = async () => {
        if (!inputMessage.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: inputMessage,
            sender: 'user',
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsTyping(true);

        // Simulate bot thinking time
        setTimeout(() => {
            const botResponse: Message = {
                id: (Date.now() + 1).toString(),
                text: generateBotResponse(inputMessage),
                sender: 'bot',
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, botResponse]);
            setIsTyping(false);
        }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <>
            {/* Chat Button - Fixed Bottom Right */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 flex items-center justify-center group"
                    aria-label="Open chat"
                >
                    <MessageCircle className="w-6 h-6 text-white" />
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></span>
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className={`fixed bottom-6 right-6 z-50 w-96 bg-gray-900 rounded-2xl shadow-2xl border border-gray-700/50 overflow-hidden transition-all duration-300 ${
                    isMinimized ? 'h-16' : 'h-[600px]'
                }`}>
                    {/* Chat Header */}
                    <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                                <Bot className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-white text-sm">Carvo AI Assistant</h3>
                                <p className="text-xs text-white/80 flex items-center gap-1">
                                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                    Online
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setIsMinimized(!isMinimized)}
                                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                                aria-label={isMinimized ? "Maximize" : "Minimize"}
                            >
                                <Minimize2 className="w-4 h-4 text-white" />
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                                aria-label="Close chat"
                            >
                                <X className="w-5 h-5 text-white" />
                            </button>
                        </div>
                    </div>

                    {!isMinimized && (
                        <>
                            {/* Messages Container */}
                            <div className="h-[460px] overflow-y-auto p-4 space-y-4 bg-gray-900">
                                {messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`flex gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}
                                    >
                                        {/* Avatar */}
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                            message.sender === 'bot'
                                                ? 'bg-gradient-to-r from-orange-500 to-orange-600'
                                                : 'bg-gray-700'
                                        }`}>
                                            {message.sender === 'bot' ? (
                                                <Bot className="w-4 h-4 text-white" />
                                            ) : (
                                                <User className="w-4 h-4 text-white" />
                                            )}
                                        </div>

                                        {/* Message Bubble */}
                                        <div className={`flex flex-col max-w-[75%] ${message.sender === 'user' ? 'items-end' : ''}`}>
                                            <div className={`px-4 py-2.5 rounded-2xl ${
                                                message.sender === 'bot'
                                                    ? 'bg-gray-800 text-gray-200 rounded-tl-none'
                                                    : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-tr-none'
                                            }`}>
                                                <p className="text-sm leading-relaxed">{message.text}</p>
                                            </div>
                                            <span className="text-xs text-gray-500 mt-1 px-1">
                                                {formatTime(message.timestamp)}
                                            </span>
                                        </div>
                                    </div>
                                ))}

                                {/* Typing Indicator */}
                                {isTyping && (
                                    <div className="flex gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center flex-shrink-0">
                                            <Bot className="w-4 h-4 text-white" />
                                        </div>
                                        <div className="bg-gray-800 px-4 py-3 rounded-2xl rounded-tl-none">
                                            <div className="flex gap-1">
                                                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Area */}
                            <div className="p-4 bg-gray-800/50 border-t border-gray-700/50">
                                <div className="flex gap-2">
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        value={inputMessage}
                                        onChange={(e) => setInputMessage(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder="Type your message..."
                                        className="flex-1 bg-gray-800 text-white placeholder-gray-400 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 border border-gray-700"
                                    />
                                    <button
                                        onClick={handleSendMessage}
                                        disabled={!inputMessage.trim()}
                                        className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-2.5 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                        aria-label="Send message"
                                    >
                                        <Send className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}
        </>
    );
}
