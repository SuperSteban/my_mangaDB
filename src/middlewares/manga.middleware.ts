import MangaController from "../controllers/manga.controller";
import { NextFunction, Request, Response } from "express";
import Send from "../utils/response.utils";


class MangaMiddleware {

  static  isOwner = async (req: Request, res: Response, next: NextFunction) => {
    const userID = (req as any).id;
    const mangaID = parseInt(req.params.id);
    const resource = await MangaController.isOwner(res, mangaID, userID);
    if (parseInt(resource) >= 1) {
      Send.success(res, { message: "Success" })
    }
    next();
  }

}

export default MangaMiddleware;