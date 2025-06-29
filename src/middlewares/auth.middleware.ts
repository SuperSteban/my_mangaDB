import Send from "../utils/response.utils";
import authConfig from "../config/auth.config";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface DecodedToken {
    userID: number;
}

class AuthMiddleware {

    static authenticateUser = (req: Request, res: Response, next: NextFunction) => {
        // 1. Extract the access token from the HttpOnly cookie
        const token = req.cookies.accessToken;

        // If there's no access token, return an error
        if (!token) {
            return Send.unauthorized(res, null);  // Sends 401 Unauthorized if token is missing
        }

        try {
            // 2. Verify the token using the secret from the auth config
            const decodedToken = jwt.verify(token, authConfig.secret as any) as {id: number}; // Type assertion for better type safety

            // If the token is valid, attach user information to the request object

            (req as any).id = decodedToken.id; // Attach userId to the request object
           
            // Proceed to the next middleware or route handler
            next();
        } catch (error) {
            // If the token verification fails (invalid or expired token), return an error
            console.error("Authentication failed:", error);  // Log error for debugging
            return Send.unauthorized(res, null);  // Sends 401 Unauthorized if token is invalid or expired
        }
    };

    static refreshTokenValidation = (req: Request, res: Response, next: NextFunction) => {
        // 1. Extract the refresh token from the HttpOnly cookie
        const refreshToken = req.cookies.refreshToken;
        // If there's no refresh token, return an error
        if (!refreshToken) {
            return Send.unauthorized(res, { message: "No refresh token provided" });
        }

        try {
            // 2. Verify the refresh token using the secret from the auth config
            const decodedToken = jwt.verify(refreshToken, authConfig.refresh_secret as any) as { id: number };
            // If the token is valid, attach user information to the request object
            (req as any).id = decodedToken.id;
            // Proceed to the next middleware or route handler
            next();
        } catch (error) {
            // Handle token verification errors (invalid or expired token)
            console.error("Refresh Token authentication failed:", error);

            // Return a 401 Unauthorized with a more specific message
            return Send.unauthorized(res, { message: "Invalid or expired refresh token" });
        }
    };
}

export default AuthMiddleware;