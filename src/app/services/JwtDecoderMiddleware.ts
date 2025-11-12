import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || process.env.NEXT_PUBLIC_JWT_SECRET || '';

interface DecodedToken {
    role: string;
    email?: string;
    exp?: number;
    iat?: number;
    [key: string]: unknown;
}

/**
 * Decodes and verifies a JWT token (for use in Next.js middleware - Edge Runtime compatible)
 * @param token - The JWT token string to decode
 * @returns Decoded token payload if valid
 * @throws Error if token is invalid or verification fails
 */
export const decodeJwtTokenMiddleware = async (token: string): Promise<DecodedToken> => {
    try {
        const secret = new TextEncoder().encode(JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);
        return payload as DecodedToken;
    } catch (error) {
        console.error('JWT verification failed in middleware:', error);
        throw new Error('Invalid or expired token');
    }
};
