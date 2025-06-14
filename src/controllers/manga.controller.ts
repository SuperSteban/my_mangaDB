import { Request, RequestHandler, Response } from "express";
import Send from "../utils/response.utils"
import MangaService from "../services/manga.service";
import mangaSchema from "../validations/manga.schema";
import { z } from "zod";
import { error } from "console";


class MangaController {

    static getManga = async (req: Request, res: Response) => {
        try {
            const mangaId = req.params.id;
            const mangaDetails = await MangaService.getMangaByID(parseInt(mangaId));
            //check if manga exists
            if (!mangaDetails) {
                return Send.notFound(res, { message: "not found sorry" });
            }
            return Send.success(res, { mangaDetails });

        } catch (error) {
            console.error("Get Manga:", error);
            return Send.error(res, null, "Could not get the manga.");
        }
    }
    static async getAllMangas(req: Request, res: Response,) {
        try {
            const mangaList = MangaService.mangas;

            return Send.success(res, { mangaList });
        } catch (error) {
            console.error("Login Failed:", error);
            return Send.error(res, null, "Could not get any mangas sorry.");
        }


    }
    static create = async (req: Request, res: Response) => {
        const result = mangaSchema.createManga.safeParse(req.body as any)
        const user_id = (req as any).id
        if (!result.success) {
            return Send.badRequest(res, { result })
        } else {
            try {

                const newManga = await MangaService.create(result.data.title, result.data.url, user_id);
                return Send.success(res, { message: "Success: Manga Saved" })

            } catch (error) {
                console.error("Create Manga Failed:", error);
                return Send.error(res, null, "Fail Manga Save");
            }
        }
    }

    static update = async (res: Response, req: Request) => {
        const { title, url, status, genre, } = req.body as z.infer<typeof mangaSchema.updateManga>;

    }

}


export default MangaController;