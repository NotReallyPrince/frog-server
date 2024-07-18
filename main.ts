import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import bot from './src/bot'
import { userRoute } from './src/routes'
import bodyParser from 'body-parser'
import cors from 'cors'

const app: Express = express()
const PORT = process.env.PORT || 5200

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true, // Enable credentials
};
app.use(cors(corsOptions))
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

