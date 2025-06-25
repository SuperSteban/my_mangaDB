import BaseRouter, { RouteConfig } from "../routes/routes.routes";
import AuthMiddleware from "../middlewares/auth.middleware";
import MangaController from "../controllers/manga.controller";
import MangaMiddleware from "../middlewares/manga.middleware";
import {upload} from "../middlewares/file.upload.middleware"

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
                    AuthMiddleware.authenticateUser,
                    MangaMiddleware.isOwner
                ],
                handler: MangaController.getManga
            },
            {
                method: "post",
                path: "/", 
                middlewares: [
                    AuthMiddleware.authenticateUser,
                ],
                handler: MangaController.create 
            },
            {
                method: "patch",
                path: "/:id", 
                middlewares: [
                    AuthMiddleware.authenticateUser,
                    upload.single("cover")
                    
                ],
                handler: MangaController.update
            },
            {
                method: "delete",
                path: "/:id", 
                middlewares: [
                    AuthMiddleware.authenticateUser,
                    MangaMiddleware.isOwner

                ],
                handler: MangaController.delete
            },
        ]
    }
}

export default new MangaRouters().router;