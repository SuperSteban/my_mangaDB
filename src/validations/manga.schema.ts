import * as z from "zod/v4";
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
]


const updateManga = z.object({
  title: z.string(),
  genre: z.string(),
  author: z.string(),
  url: z.string(),
  status: z.string(),

})




const createManga = z.object({
  title: z.string().trim().min(1, { message: "Title is required" }),
  url: z.string().trim().min(1, { message: "URL is required" }),

})


const mangaSchema = {
  updateManga,
  createManga,
}

export default mangaSchema;