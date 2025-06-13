import { NextFunction, Request, Response } from "express";
import Send from "../utils/response.utils"
import { z } from "zod"
import AuthService from "../services/auth.service";
import authSchema from "../validations/auth.schema";
import { generateToken } from "../config/jwt.config";

class AuthController {


    static login = async (req: Request, res: Response) => {
        // Destructure the request to get body expected fields and sanitize with zod and the authSchema.login
        const { email, password } = req.body as z.infer<typeof authSchema.login>

        try {
            //1 Check if the email exist in db
            const result = await AuthService.login(email, password);

            res.cookie("accessToken", result.accessToken, {
                httpOnly: true,   // Ensure the cookie cannot be accessed via JavaScript (security against XSS attacks)
                secure: process.env.NODE_ENV === "production",  // Set to true in production for HTTPS-only cookies
                maxAge: 15 * 60 * 1000,  // 15 minutes in mileseconds
                sameSite: "strict"  // Ensures the cookie is sent only with requests from the same site
            });
            res.cookie("refreshToken", result.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 24 * 60 * 60 * 1000,  // 24 hours is mileseconds
                sameSite: "strict"
            });
            return Send.success(res, {
                id: result.user.id,
                username: result.user.username,
                email: result.user.email
            });
        } catch (error) {

            console.error("Login Failed:", error);
            return Send.error(res, null, "Login failed.");
        }
    }

    static register = async (req: Request, res: Response) => {
        const { username, email, password, password_confirmation } = req.body as z.infer<typeof authSchema.register>;
        try {
            const result = await AuthService.register(username, email, password);
            res.cookie("accessToken", result.access_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 15 * 60 * 1000,
                sameSite: "strict"
            });
            res.cookie("refreshToken", result.refresh_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 24 * 60 * 60 * 1000,
                sameSite: "strict"
            });
            return Send.success(res, {
                id: result.user.id,
                username: result.user.username,
                email: result.user.email
            });

        } catch (error) {
            console.error("Register Failed:", error);
            return Send.error(res, null, "Register failed.");
        }

    }

    static logout = async (req: Request, res: Response) => {
        try {

            const userId = (req as any).user?.userId;
            if (userId) {
                await AuthService.logout(userId);
            }
            res.clearCookie("accessToken");
            res.clearCookie("refreshToken");

            return Send.success(res, null, "Logged out successfully.");

        } catch (error) {

            console.error("Logout failed:", error);
            return Send.error(res, null, "Logout failed.");
        }
    }

    static refreshToken = async (req: Request, res: Response) => {
        try {
            const userId = (req as any).userId;  // Get userId from the refreshTokenValidation middleware
            const refreshToken = req.cookies.refreshToken;  // Get the refresh token from cookies

            // Check if the refresh token has been revoked
            const user = await AuthService.isRevoked(userId);

            if (!user || !user.refreshToken) {
                return Send.unauthorized(res, "Refresh token not found");
            }

            // Check if the refresh token in the database matches the one from the client
            if (user.refreshToken !== refreshToken) {
                return Send.unauthorized(res, { message: "Invalid refresh token" });
            }

            const newAccessToken = generateToken({ id: user.id });
            res.cookie("accessToken", newAccessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 15 * 60 * 1000,  // 15 minutes
                sameSite: "strict"
            });

            return Send.success(res, { message: "Access token refreshed successfully" });

        } catch (error) {
            console.error("Refresh Token failed:", error);
            return Send.error(res, null, "Failed to refresh token");
        }
    }
}
export default AuthController;