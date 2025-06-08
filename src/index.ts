import express from "express";
import http from 'http';
import dotenv from 'dotenv'
import helloRouter from "./routes/sup"
import hellow from "./routes/sup"
import { allowedNodeEnvironmentFlags } from "process";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/api/hellow", hellow);


app.listen(process.env.PORT, () => {
    console.log("Server up")
});