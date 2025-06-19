import { RequestHandler } from "express";
import db from "../db"
import { Manga } from "../models/manga.model"
import { date } from "zod";

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
    static async mangas(userID:number) {
        try {
            
            let mangas: any = db.manyOrNone("SELECT mangas.id, mangas.title, mangas.img, mangas.genre, mangas.author, mangas.url, mangas.status FROM mangas INNER JOIN users ON mangas.user_id = users.id WHERE users.id = $1", [userID])
                .then(data => {
                    mangas = data;
                })
                .catch(error => {
                    console.log('ERROR:', error); // print the error;
                });
            if(!mangas) {
                throw new Error('No mangas');
            }
            return mangas;
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
                throw new Error('Error, Fail to save');
            }
            return manga;

        } catch (error) {
            console.log(`>>Error: ${error}`)
            throw new Error('Error, Fail to save');
        }
    }

    static async update(
        mangaId:number,
        title:string,
        genre:string,
        auhtor: string,
        url: string,
        status: boolean
    ) {
      try {
        return true;
      } catch (error) {
        console.log(`>>Error: ${error}`)
        throw new Error('Error, Fail to upload');
      }
    } 
}

export default MangaService