import db from "../db"


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
                throw new Error('Sorry could Not get any mangas');

            }
            return mangas;
        } catch (error) {
            console.log(`>>Error: ${error}`)
            throw new Error('Sorry could Not get any mangas');
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
            const updateManga = await db.
            result("UPDATE mangas SET user_id=$1, title=$2, genre=$3, author=$4, url=$5, status=$6, img=$7 WHERE id=$8", [
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

    static async delete(mangaID: number) {
        try {
            const isManga = await db.one("SELECT count(id) FROM mangas WHERE id=$1",[mangaID]);
           
            if(parseInt(isManga.count) < 1) {
                return new Error("This manga does not exits...")
            }
            const deleteManga = await db.result("DELETE FROM mangas WHERE id=$1",[mangaID]);      
    
            return deleteManga;
        } catch (error) {
             console.log(`>>Error: ${error}`)
            throw new Error('Error, Fail to delete');
        }
    }

    static async isOwner(mangaID: number, userID: number){
        const isAuthorized = await db.
        one
        ("SELECT count(users.id) FROM mangas INNER JOIN users ON users.id = mangas.user_id WHERE users.id = $1 AND mangas.id = $2",[userID, mangaID]);
        if(!isAuthorized){
            throw new Error("Manga not found or you are not allow here!!!")
        }
        return isAuthorized;
    }
}

export default MangaService