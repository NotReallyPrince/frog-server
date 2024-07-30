import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser'
import cors from 'cors'
import { rateLimit } from 'express-rate-limit'
import { connectDatabase } from './src/config/databaseConnection';
import dotenv from 'dotenv'
import { userRoute } from './src/routes';
import userV2Router from './src/v2/routes/user.routes'
import { Markup, Telegraf } from 'telegraf';
import { CreateUser } from './src/helper/user.helper';
import { createUserHelper } from './src/v2/controller/user.controller';

dotenv.config()

const app: Express = express()
const PORT = process.env.PORT || 5200
const corsOptions = {
  origin: ['http://localhost:5173', 'https://frog-frontend.vercel.app'],
  credentials: true,
};
const limiter = rateLimit({
	windowMs: 3 * 60 * 1000, // 15 minutes
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
app.use('/v2/user', userV2Router)



export const token =process.env.BOT_TOKEN

let bot: Telegraf;

try{
  bot = new Telegraf(process.env.BOT_TOKEN);

  bot.command('start',async ctx => {
    const referalId = ctx.text.split(' ')[1]

    const userDetails:CreateUser = {
      tgId: ctx.from.id,
      firstName: ctx.from?.first_name,
      lastName: ctx.from?.last_name,
      userName:  ctx.from?.username,
      isPremium: ctx.from.is_premium
    }

    if(referalId)
      userDetails.referedBy = parseInt(referalId)

    const user: any = await createUserHelper(userDetails)

    console.log(user);
    console.log(ctx.from)

    const inviteUrl = `https://t.me/${process.env.BOT_USERNAME.replace('@','')}?start=${ctx.from.id}`
    const text = 'Invite Your friends'


    ctx.reply(
      `Hy ${user.firstName}, Welcome to Apes community 🦧`,
        Markup.inlineKeyboard([
          Markup.button.webApp("Lets Climb 🦧!", 'https://frog-frontend.vercel.app/'),
          Markup.button.url(
            "Share", 
            `https://t.me/share/url?url=${encodeURIComponent(inviteUrl)}&text=${encodeURIComponent(text)}`
          )
        ]),
    )

  })

}catch(error){
  console.log('ERROR HERE:',error);
  
}

app.listen(PORT,async () => {
  bot.launch();
  await connectDatabase()
  console.log('Server Started');
})

