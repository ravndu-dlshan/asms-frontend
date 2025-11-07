import axios from 'axios';
import { getCookie } from '@/app/lib/cookies';

const CHATBOT_BASE_URL = process.env.NEXT_PUBLIC_CHATBOT_URL || 'http://localhost:8000';

console.log('🤖 Chatbot Backend Configuration:');
console.log('- Base URL:', CHATBOT_BASE_URL);

// Create axios instance for chatbot
const chatbotAxios = axios.create({
    baseURL: CHATBOT_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor to include auth token if needed
chatbotAxios.interceptors.request.use(
    (config) => {
        console.log(`🤖 Making ${config.method?.toUpperCase()} request to chatbot: ${config.url}`);
        
        // Get access token from cookie (updated from authToken to accessToken)
        const token = getCookie('accessToken');
        if (token) {
            console.log('🔑 Adding Bearer token to chatbot request');
            console.log('🔑 Token (first 20 chars):', token.substring(0, 20) + '...');
            config.headers.Authorization = `Bearer ${token}`;
        } else {
            console.warn('⚠️ No access token found for chatbot request');
        }
        
        console.log('📋 Chatbot request headers:', config.headers);
        if (config.data) {
            console.log('📋 Chatbot request body:', config.data);
        }
        
        return config;
    },
    (error) => {
        console.error('❌ Chatbot request interceptor error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor for error handling
chatbotAxios.interceptors.response.use(
    (response) => {
        console.log(`✅ Chatbot response received from ${response.config.url}:`, response.status);
        console.log('📥 Chatbot response data:', response.data);
        return response;
    },
    (error) => {
        console.error('❌ Chatbot API Error:');
        if (error.response) {
            console.error('- Status:', error.response.status);
            console.error('- Data:', error.response.data);
            console.error('- Headers:', error.response.headers);
            
            // Check for authentication errors
            if (error.response.status === 401) {
                console.error('🔒 Authentication failed - token may be invalid or expired');
            }
        } else if (error.request) {
            console.error('- No response received from chatbot backend');
            console.error('- Request:', error.request);
        } else {
            console.error('- Error:', error.message);
        }
        return Promise.reject(error);
    }
);

export interface ChatMessage {
    message: string;
    timestamp?: string;
}

export interface ChatResponse {
    response: string;
    timestamp?: string;
    conversationId?: string;
}

/**
 * Send a message to the chatbot and get a response
 * @param message - The user's message
 * @param conversationId - Optional conversation ID for context
 * @returns Promise with the bot's response
 */
export const sendChatMessage = async (
    message: string,
    conversationId?: string
): Promise<ChatResponse> => {
    try {
        const payload: any = {
            message: message.trim(),
        };

        if (conversationId) {
            payload.conversationId = conversationId;
        }

        console.log('📤 Sending to backend:', payload);
        
        const response = await chatbotAxios.post('/chat', payload);
        
        console.log('📥 Backend response status:', response.status);
        console.log('📥 Backend response data:', response.data);
        console.log('📥 Backend response full:', JSON.stringify(response.data, null, 2));
        
        // Check what field the backend is using for the response text
        const responseText = response.data.response 
            || response.data.message 
            || response.data.result 
            || response.data.answer
            || JSON.stringify(response.data);
        
        return {
            response: responseText,
            timestamp: response.data.timestamp,
            conversationId: response.data.conversationId,
        };
    } catch (error: any) {
        console.error('❌ Chat API Error:', error);
        console.error('❌ Error response:', error.response?.data);
        throw new Error(
            error.response?.data?.message || 
            'Failed to get response from chatbot. Please try again.'
        );
    }
};

/**
 * Start a new conversation with the chatbot
 * @returns Promise with conversation details
 */
export const startNewConversation = async (): Promise<{ conversationId: string }> => {
    try {
        const response = await chatbotAxios.post('/conversation/start');
        return response.data;
    } catch (error: any) {
        throw new Error(
            error.response?.data?.message || 
            'Failed to start conversation. Please try again.'
        );
    }
};

/**
 * Get conversation history
 * @param conversationId - The conversation ID
 * @returns Promise with message history
 */
export const getConversationHistory = async (
    conversationId: string
): Promise<ChatMessage[]> => {
    try {
        const response = await chatbotAxios.get(`/conversation/${conversationId}`);
        return response.data.messages || [];
    } catch (error: any) {
        throw new Error(
            error.response?.data?.message || 
            'Failed to get conversation history.'
        );
    }
};

/**
 * End/clear a conversation
 * @param conversationId - The conversation ID to end
 */
export const endConversation = async (conversationId: string): Promise<void> => {
    try {
        await chatbotAxios.delete(`/conversation/${conversationId}`);
    } catch (error: any) {
        console.error('Failed to end conversation:', error);
        // Don't throw error as this is not critical
    }
};

/**
 * Get suggested queries/quick replies
 * @returns Promise with suggested queries
 */
export const getSuggestedQueries = async (): Promise<string[]> => {
    try {
        const response = await chatbotAxios.get('/suggestions');
        return response.data.suggestions || [];
    } catch (error: any) {
        // Return default suggestions if API fails
        return [
            'What services do you offer?',
            'How can I book an appointment?',
            'What are your operating hours?',
            'Where is your location?',
        ];
    }
};

export default {
    sendChatMessage,
    startNewConversation,
    getConversationHistory,
    endConversation,
    getSuggestedQueries,
};
