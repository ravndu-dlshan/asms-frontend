import axios from 'axios';
import { getCookie, setCookie, deleteCookie } from '@/app/lib/cookies';

const CHATBOT_BASE_URL = process.env.NEXT_PUBLIC_CHATBOT_URL || 'http://localhost:8000';
const MAIN_API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

console.log('🤖 Chatbot Backend Configuration:');
console.log('- Base URL:', CHATBOT_BASE_URL);

// Flag to prevent multiple refresh token requests
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// Create axios instance for chatbot
const chatbotAxios = axios.create({
    baseURL: CHATBOT_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor to include auth token
chatbotAxios.interceptors.request.use(
    (config) => {
        console.log(`🤖 Making ${config.method?.toUpperCase()} request to chatbot: ${config.url}`);
        
        // Get access token from cookie (using authToken to match main axios)
        const token = getCookie('authToken');
        if (token) {
            console.log('🔑 Adding Bearer token to chatbot request');
            config.headers.Authorization = `Bearer ${token}`;
        } else {
            console.warn('⚠️ No auth token found for chatbot request');
        }
        
        return config;
    },
    (error) => {
        console.error('❌ Chatbot request interceptor error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor with token refresh logic
chatbotAxios.interceptors.response.use(
    (response) => {
        console.log(`✅ Chatbot response received from ${response.config.url}:`, response.status);
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        console.error('❌ Chatbot API Error:');
        if (error.response) {
            console.error('- Status:', error.response.status);
            console.error('- Data:', error.response.data);
        }

        // Handle 401 errors with token refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then(token => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return chatbotAxios(originalRequest);
                    })
                    .catch(err => {
                        return Promise.reject(err);
                    });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = getCookie('refreshToken');

            if (!refreshToken) {
                console.log('No refresh token available, clearing auth cookies');
                deleteCookie('authToken');
                deleteCookie('refreshToken');
                deleteCookie('userRole');
                deleteCookie('userInfo');

                if (typeof window !== 'undefined') {
                    window.location.href = '/';
                }

                return Promise.reject(error);
            }

            try {
                console.log('🔄 Attempting to refresh token for chatbot request...');
                
                // Request new access token using refresh token
                const response = await axios.post(
                    `${MAIN_API_BASE_URL}/api/auth/refresh-token`,
                    { refreshToken },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );

                const { token: newAccessToken } = response.data;

                if (newAccessToken) {
                    console.log('✅ Token refreshed successfully for chatbot');
                    
                    // Store new access token (1 hour expiry)
                    setCookie('authToken', newAccessToken, 3600);

                    // Update authorization header
                    chatbotAxios.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                    // Process queued requests
                    processQueue(null, newAccessToken);

                    return chatbotAxios(originalRequest);
                }
            } catch (refreshError) {
                console.error('❌ Token refresh failed for chatbot:', refreshError);
                processQueue(refreshError as Error, null);

                deleteCookie('authToken');
                deleteCookie('refreshToken');
                deleteCookie('userRole');
                deleteCookie('userInfo');

                if (typeof window !== 'undefined') {
                    window.location.href = '/';
                }

                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
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
