'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Minimize2, Loader2 } from 'lucide-react';
import { sendChatMessage, startNewConversation, getSuggestedQueries } from '../services/ChatBotServices';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
    error?: boolean;
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
    const [conversationId, setConversationId] = useState<string | null>(null);
    const [suggestedQueries, setSuggestedQueries] = useState<string[]>([]);
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
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

    // Initialize conversation when chat opens
    useEffect(() => {
        if (isOpen && !conversationId) {
            initializeConversation();
            loadSuggestedQueries();
        }
    }, [isOpen]);

    const initializeConversation = async () => {
        try {
            const { conversationId: newId } = await startNewConversation();
            setConversationId(newId);
        } catch (error) {
            console.error('Failed to start conversation:', error);
            // Continue without conversation ID
        }
    };

    const loadSuggestedQueries = async () => {
        setIsLoadingSuggestions(true);
        try {
            const suggestions = await getSuggestedQueries();
            setSuggestedQueries(suggestions);
        } catch (error) {
            console.error('Failed to load suggestions:', error);
        } finally {
            setIsLoadingSuggestions(false);
        }
    };

    const handleSendMessage = async (messageText?: string) => {
        const textToSend = messageText || inputMessage;
        if (!textToSend.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: textToSend,
            sender: 'user',
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsTyping(true);

        try {
            console.log('🚀 Sending message to backend:', textToSend);
            
            // Send message to chatbot API
            const response = await sendChatMessage(textToSend, conversationId || undefined);
            
            console.log('✅ Received response:', response);
            console.log('✅ Response text:', response.response);
            
            const botResponse: Message = {
                id: (Date.now() + 1).toString(),
                text: response.response || 'No response received from server',
                sender: 'bot',
                timestamp: new Date(),
            };
            
            console.log('💬 Adding bot message to UI:', botResponse);
            
            setMessages(prev => [...prev, botResponse]);
            
            // Update conversation ID if provided
            if (response.conversationId && !conversationId) {
                setConversationId(response.conversationId);
            }
        } catch (error: any) {
            console.error('❌ Error in handleSendMessage:', error);
            
            // Show error message in chat
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: error.message || "Sorry, I'm having trouble connecting right now. Please try again later.",
                sender: 'bot',
                timestamp: new Date(),
                error: true,
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleSuggestedQueryClick = (query: string) => {
        setInputMessage(query);
        handleSendMessage(query);
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
                            <div className="h-[400px] overflow-y-auto p-4 space-y-4 bg-gray-900">
                                {messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`flex gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}
                                    >
                                        {/* Avatar */}
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                            message.sender === 'bot'
                                                ? message.error 
                                                    ? 'bg-red-500' 
                                                    : 'bg-gradient-to-r from-orange-500 to-orange-600'
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
                                                    ? message.error
                                                        ? 'bg-red-900/50 text-red-200 rounded-tl-none border border-red-700'
                                                        : 'bg-gray-800 text-gray-200 rounded-tl-none'
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

                            {/* Suggested Queries */}
                            {messages.length <= 1 && suggestedQueries.length > 0 && !isTyping && (
                                <div className="px-4 py-3 bg-gray-800/30 border-t border-gray-700/50">
                                    <p className="text-xs text-gray-400 mb-2">Suggested questions:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {suggestedQueries.slice(0, 4).map((query, index) => (
                                            <button
                                                key={index}
                                                onClick={() => handleSuggestedQueryClick(query)}
                                                className="text-xs px-3 py-1.5 bg-gray-700/50 hover:bg-orange-500/20 text-gray-300 hover:text-orange-400 rounded-full transition-all border border-gray-600/50 hover:border-orange-500/50"
                                            >
                                                {query}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

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
                                        disabled={isTyping}
                                        className="flex-1 bg-gray-800 text-white placeholder-gray-400 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 border border-gray-700 disabled:opacity-50"
                                    />
                                    <button
                                        onClick={() => handleSendMessage()}
                                        disabled={!inputMessage.trim() || isTyping}
                                        className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-2.5 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[42px]"
                                        aria-label="Send message"
                                    >
                                        {isTyping ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <Send className="w-5 h-5" />
                                        )}
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
