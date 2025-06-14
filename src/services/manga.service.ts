import { RequestHandler } from "express";
import db from "../db"
import { Manga } from "../models/manga.model"

/* 
    TODO: MANGA SERVICE
*/

class MangaService {
    //getManga By ID
    static async getMangaByID(mangaId: number) {
        try {
            const manga = db.oneOrNone('SELECT * FROM mangas WHERE id = $1', [mangaId]);
            //check if exist or null
            if(!manga) {
                throw new Error('This manga does not exist');
            }
            return manga;

        } catch (error) {
            console.log(`>>Error: ${error}`)
        }
    }
    //get Mangas List
    static async mangas() {
        try {
            const mangas: any = await db.manyOrNone("SELECT * FROM mangas;");
            if(!mangas) {
                throw new Error('No mangas');
            }
            return mangas as any;
        } catch (error) {
            console.log(`>>Error: ${error}`)
        }
    }

    static async create(
        title: string,
        url: string,
        user_id: number
    ) {
       try {
            const manga = db.none('INSERT INTO mangas (title, url, user_id) VALUES ($1, $2, $3)',[title, url, user_id]);
            //check if exist or null
            if(!manga) {
                throw new Error('This manga could not save correctly');
            }
            return manga;

        } catch (error) {
            console.log(`>>Error: ${error}`)
        }
    }
}

export default MangaService