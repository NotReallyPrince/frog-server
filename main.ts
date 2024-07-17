import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import bot from './src/bot'
import { userRoute } from './src/routes'

const app: Express = express()
const PORT = process.env.PORT || 5200

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});



//Routes
app.use('/user',userRoute);


app.listen(PORT,() => {
  bot.launch();
  console.log('Server Started');
})

