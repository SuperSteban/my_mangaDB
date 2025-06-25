import { Request, Response } from "express";
import Send from "../utils/response.utils"
import MangaService from "../services/manga.service";
import mangaSchema from "../validations/manga.schema";



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
        if (!userID) {
            return Send.unauthorized(res, { message: "Denied Access", userID })
        }
        console.log("GERALL ID", (req as any).id)
        console.log(userID);
        try {
            const mangaList = await MangaService.mangas(userID);
            return Send.success(res, { mangaList });
        } catch (error) {
            console.error("GET ALL MANGAS:", error);
            return Send.error(res, { message: "Could not get any mangas sorry." });
        }


    }
    static create = async (req: Request, res: Response) => {
        const result = await mangaSchema.createManga.safeParseAsync(req.body as any)
        const user_id = (req as any).id
        if (!result.success) {
            return Send.badRequest(res, result.error)
        } else {
            try {

                const newManga = await MangaService.create(result.data.title, result.data.url, user_id);
                if (!newManga) {
                    console.log("CONTROLLER ERROR>>", newManga)
                    return Send.error(res, { mesage: "Fail to Save Manga" })
                }

                return Send.success(res, { message: "Success: Manga Saved Successfully" })

            } catch (error) {
                console.error("Create Manga Failed:", error);
                return Send.error(res, { mesage: "Fail to Save Manga" });
            }
        }
    }

    static update = async (req: Request, res: Response) => {
        const result = mangaSchema.updateManga.safeParse(req.body as any);
        const userID = (req as any).id;
        const avatar = (req as any).file;
        if (!result || !result.data) {
            return Send.badRequest(res, result.error)
        }

        try {
            const mangaId = parseInt(req.params.id);
            const status = result.data.status === 'on_going' ? true : false;
            const resUptade = { ...result, img: avatar.filename, manga_id: mangaId, user_id: userID }
            const updatManga = await MangaService.update(
                resUptade.user_id,
                resUptade.manga_id,
                resUptade.data.title,
                resUptade.data.genre,
                resUptade.data.author,
                resUptade.data.url,
                status,
                resUptade.img
            );

            if (updatManga.rowCount <= 0) {
                return Send.error(res, { message: "Fail in Update Action" });
            }
            return Send.success(res, { message: "Updated Successfully" });
        } catch (error) {
            console.error("Create Manga Failed:", error);
            return Send.error(res, { mesage: "Fail update" });
        }
    }

    static delete = async (req: Request, res: Response) => {
        try {
            const mangaID = parseInt(req.params.id);
            const deleteManga = await MangaService.delete(mangaID);
            if (!deleteManga) {
                return Send.error(res, {message:"Fail", error:deleteManga})
            }
            return Send.noContent(res, { message: "Deleted succesfully" })

        } catch (error) {
            console.error("DELETE Manga Failed:", error);
            return Send.error(res, { mesage: "Fail to delete Manga" });
        }


    }



    //Verify

    static async isOwner(res: Response, mangaID: number, userID:number) {
        
        try {
           const result = await MangaService.isOwner(mangaID, userID);
           if(parseInt(result) < 1){
            return Send.unauthorized(res, {message:"You are not allow here!!"})
           }
           return result
        } catch (error) {
            return new Error(error as string)

        }
    }

}


export default MangaController;