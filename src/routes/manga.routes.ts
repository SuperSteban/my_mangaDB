import BaseRouter, { RouteConfig } from "../routes/routes.routes";
import AuthMiddleware from "../middlewares/auth.middleware";
import MangaController from "../controllers/manga.controller";
import { upload } from "../middlewares/file.upload.middleware";

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
                path: "/:id", 
                middlewares: [
                    AuthMiddleware.authenticateUser
                ],
                handler: MangaController.getManga
            },
            {
                method: "post",
                path: "/create", 
                middlewares: [
                    AuthMiddleware.authenticateUser
                ],
                handler: MangaController.create 
            },
            {
                method: "post",
                path: "/:id/update", 
                middlewares: [
                    AuthMiddleware.authenticateUser,
                    upload.single("cover"),
                ],
                handler: MangaController.update
            },
        ]
    }
}

export default new MangaRouters().router;