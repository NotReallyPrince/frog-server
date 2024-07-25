import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import bot from './src/bot'
import { userRoute } from './src/routes'
import bodyParser from 'body-parser'
import cors from 'cors'

const app: Express = express()
const PORT = process.env.PORT || 5200
const corsOptions = {
  origin: ['http://localhost:5174', 'https://frog-frontend.vercel.app/'],
  credentials: true,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Preflight requests

app.use(bodyParser.json())


app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});


//Routes
app.use('/user',userRoute);

app.listen(PORT,() => {
  bot.launch();
  console.log('Server Started');
})

