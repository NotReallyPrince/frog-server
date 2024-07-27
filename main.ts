import express, { Express, Request, Response } from 'express';
import { userRoute } from './src/routes'
import bodyParser from 'body-parser'
import cors from 'cors'
import { rateLimit } from 'express-rate-limit'
import { connectDatabase } from './src/config/databaseConnection';
import bot from './src/bot';
import dotenv from 'dotenv'
dotenv.config()

const app: Express = express()
const PORT = process.env.PORT || 5200
const corsOptions = {
  origin: ['http://localhost:5173', 'https://frog-frontend.vercel.app'],
  credentials: true,
};
const limiter = rateLimit({
	windowMs: 2 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	// store: ... , // Redis, Memcached, etc. See below.
})
app.use(limiter)
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Preflight requests

app.use(bodyParser.json())


app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});


//Routes
app.use('/user',userRoute);

app.listen(PORT,async () => {
  bot.launch();
  await connectDatabase()
  console.log('Server Started');
})

