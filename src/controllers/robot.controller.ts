import { NextFunction, Request, Response } from "express";
import Send from "../utils/response.utils";


class RobotController {
    static robotito = (req: Request, res: Response) => {

        try {
            return Send.success(res, {
                saludo: '👋',
                mensaje: 'Quiero una espaldona como la del Migelón 😴',
                timestamp: new Date(),
            })
            
        } catch (error) {

            console.error("Login Failed:", error);
            return Send.error(res, null, "Fallo robotito.");
        }
    }
}

export default RobotController