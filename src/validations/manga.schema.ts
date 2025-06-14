import { z } from "zod";


const updateManga = z.object({
  title: z.string().min(1, "Title Required"),
  genre: z.string().min(1, "genre Required"),
  author: z.string().min(1, "Author Required"),
  url: z.string().url("Url Required"),
  status: z.string().min(1, "status Required"),
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