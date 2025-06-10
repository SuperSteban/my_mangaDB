import { NextFunction, Request, Response } from "express";
import Send  from "../utils/response.utils"
import { z } from "zod"
import AuthService from "services/auth.service";
import authSchema from "validations/auth.schema";

class AuthController {

    // static fun for use in all were it imported
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
                username: result.user.id,
                email: result.user.email
            });
        }catch (error) {
            // If any error occurs, return a generic error response
            console.error("Login Failed:", error); // Log the error for debugging
            return Send.error(res, null, "Login failed.");
        }
    }

    static register = async (req: Request, res: Response) => {
      const { email, password, password_confirmation } = req.body as z.infer<typeof authSchema.register>;
      try {
        const result = await AuthService.register(email, password);
        
        
      } catch (error) {
        
      }
    
    }
}