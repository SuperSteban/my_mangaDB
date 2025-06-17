import { z } from "zod";


const updateManga = z.object({
  title: z.string(),
  genre: z.string(),
  author: z.string(),
  url: z.string(),
  status: z.string(),
}) 

const createManga = z.object({
  title: z.string().trim().min(1, "Title is required"),
  url: z.string().trim().min(1, "URL is required")
}) 

const mangaSchema = {
    updateManga,
    createManga
}

export default mangaSchema;