import BaseRouter, { RouteConfig } from "../routes/routes.routes";
import AuthMiddleware from "../middlewares/auth.middleware";
import MangaController from "../controllers/manga.controller";

class MangaRouters extends BaseRouter {
    protected routes(): RouteConfig[] {
        return [
            {
                method: "get",
                path: "/", 
                middlewares: [
                    AuthMiddleware.authenticateUser
                ],
                handler: MangaController.getAllMangas
            },
            {
                method: "get",
                path: "/manga/:id", 
                middlewares: [
                    AuthMiddleware.authenticateUser
                ],
                handler: MangaController.getManga
            },
            {
                method: "post",
                path: "/", 
                middlewares: [
                    AuthMiddleware.authenticateUser
                ],
                handler: MangaController.create 
            },
        ]
    }
}

export default new MangaRouters().router;