import dotenv from 'dotenv';
dotenv.config();


const authConfig = {
    // Secret key used for signing JWT access tokens
    secret: process.env.JWT_SECRET, 

    // Expiration time for the JWT access token (e.g., "15m" for 15 minutes)
    secret_expires_in: process.env.AUTH_SECRET_EXPIRES_IN || "15m", 

    // Secret key used for signing JWT refresh tokens
    refresh_secret: process.env.REFRESH_TOKEN_SECRET, 

    // Expiration time for the JWT refresh token (e.g., "24h" for 24 hours)
    refresh_secret_expires_in: process.env.AUTH_REFRESH_SECRET_EXPIRES_IN || "24h"
}

export default authConfig;