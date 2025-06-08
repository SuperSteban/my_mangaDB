import { Router } from 'express';

const router = Router();

router.get("/", (req, res)=>{

    res.send(`
     <html>
      <head><title>Hola</title></head>
      <body>
        <h1>👋 Hola COPY YA ME FUI A DORMIR 😴😴😴</h1>
        <p>GRASHIA POR SALUDAR VALIO LA PENA</p>
        <img src=\"https://i.pinimg.com/736x/a4/82/88/a48288203ce23f43cffe6980fea1d411.jpg"\>
      </body>
    </html>   
    `);
});

export default router
