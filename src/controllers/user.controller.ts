import { Request, Response } from "express";
import Send from "../utils/response.utils"
import UserService from "services/user.service";

class UserController {
    static getUser = async (req: Request, res: Response) => {
        try {
            const userId = (req as any).userId;
            const user = UserService.getUser(userId);
            if (!user) {
                return Send.notFound(res, {}, "User not found");
            }
             return Send.success(res, { user });
        
        } catch (error) {
            console.error("Error fetching user info:", error);
            return Send.error(res, {}, "Internal server error");
        }
    }
    // TODO update User
}
export default UserController