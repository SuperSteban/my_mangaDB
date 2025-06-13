import { Router } from 'express';

import BaseRouter, { RouteConfig } from "./routes.routes";
import RobotController from '../controllers/robot.controller';



class Robot extends BaseRouter {
  protected routes(): RouteConfig[] {

    return [
      {
        method: "get",
        path: "/sup",
        handler: RobotController.robotito,
      }
      
    ]
  }
}

export default new Robot().router;
