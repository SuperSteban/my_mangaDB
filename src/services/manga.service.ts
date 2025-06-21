import { RequestHandler } from "express";
import db from "../db"
import { error } from "console";
import { ur } from "zod/dist/types/v4/locales";

class MangaService {
    //getManga By ID
    static async getMangaByID(mangaId: number) {
        try {
            const manga = db.oneOrNone('SELECT * FROM mangas WHERE id = $1', [mangaId]);
            //check if exist or null
            if (!manga) {
                throw new Error('Sorry not manga found');

            }
            return manga;

        } catch (error) {
            console.log(`>>Error: ${error}`)
            throw new Error('Sorry not manga found');

        }
    }
    //get Mangas List
    static async mangas(userID: number) {
        try {
            const mangas: any = await db.manyOrNone("SELECT mangas.id, mangas.title, mangas.img, mangas.genre, mangas.author, mangas.url, mangas.status FROM mangas INNER JOIN users ON mangas.user_id = users.id WHERE users.id = $1", [userID]);
            console.log(mangas);
            if (!mangas) {
                console.log("Error_SERVICE>>", mangas);
                throw new Error('Sorry we could Not get any mangas');

            }
            return mangas;
        } catch (error) {
            console.log(`>>Error: ${error}`)
            throw new Error('Sorry we could Not get any mangas');
        }
    }

    static async create(
        title: string,
        url: string,
        user_id: number
    ) {
        try {
            const manga = db.oneOrNone('INSERT INTO mangas (title, url, user_id) VALUES ($1, $2, $3) RETURNING id', [title, url, user_id]);
            if (!manga) {
                console.log("Error_SERVICE>>",);
                throw new Error('Error, Fail to save');
            }
            return manga;

        } catch (error) {
            console.log(`>>Error: ${error}`)
            throw new Error('Error, Fail to save');
        }
    }

    static async update(
        user_id: number,
        mangaId: number,
        title: string,
        genre: string,
        auhtor: string,
        url: string,
        status: boolean,
        img: string
    ) {
        try {
            const updateManga = await db.result("UPDATE mangas SET user_id=$1, title=$2, genre=$3, author=$4, url=$5, status=$6, img=$7 WHERE id=$8", [
                user_id,
                title,
                genre,
                auhtor,
                url,
                status,
                img,
                mangaId

            ]);
            if(updateManga.rowCount == 0) {
                throw new Error("Failing in update this manga")
            }
            return updateManga;
        } catch (error) {
            console.log(`>>Error: ${error}`)
            throw new Error('Error, Fail to upload');
        }
    }
}

export default MangaService