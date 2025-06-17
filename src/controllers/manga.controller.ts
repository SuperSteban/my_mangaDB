import { Request, RequestHandler, Response } from "express";
import Send from "../utils/response.utils"
import MangaService from "../services/manga.service";
import mangaSchema from "../validations/manga.schema";
import { z } from "zod";
import { title } from "process";


class MangaController {

    static getManga = async (req: Request, res: Response) => {
        try {
            const mangaId = req.params.id;
            const mangaDetails = await MangaService.getMangaByID(parseInt(mangaId));
            //check if manga exists
            if (!mangaDetails) {
                return Send.notFound(res, { message: "not found sorry" });
            }
            return Send.success(res, { success: true, mangaDetails });

        } catch (error) {
            console.error("Get Manga:", error);
            return Send.error(res, { message: "Could not get the manga." });
        }
    }
    static async getAllMangas(req: Request, res: Response,) {
        const userID = (req as any).id
        try {
            const mangaList = MangaService.mangas(userID);
            console.log(mangaList);
            return Send.success(res, { mangaList });
        } catch (error) {
            console.error("GET ALL MANGAS:", error);
            return Send.error(res, { message: "Could not get any mangas sorry." });
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
                if (!newManga) {
                    return Send.error(res, { mesage: "Fail Manga Save" })
                }

                return Send.success(res, { message: "Success: Manga Saved" })

            } catch (error) {
                console.error("Create Manga Failed:", error);
                return Send.error(res, { mesage: "Fail Manga Save" });
            }
        }
    }

    static update = async (req: Request, res: Response) => {
        const result = mangaSchema.updateManga.safeParse(req.body as any);
        if (!result || !result.data) {
            return Send.badRequest(res, { result })
        }
        try {
            const mangaId = parseInt(req.params.id);
            const file = (req as any).cover;
            const url_file = file.path;
            if(!file){
                Send.badRequest(res, {message:"Try Again, Your file probabbly got lost"})
            }
            const mangaStatus = result.data.status == "on_going"? true:false; 
            const updatManga = await MangaService.update(
               mangaId,
               result.data.title,
               result.data.genre,
               result.data.author,
               result.data.url,
               mangaStatus
            );

            if(!updatManga){
              return Send.error(res, {message:"Fail in Update Action"});
            }
            return Send.success(res, {message:"Updated Successfully"});
        } catch (error) {
            console.error("Create Manga Failed:", error);
            return Send.error(res, { mesage: "Fail update" });
        }
    }

}


export default MangaController;