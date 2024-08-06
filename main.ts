import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit';
import { connectDatabase } from './src/config/databaseConnection';
import dotenv from 'dotenv';
import secretRouter from './src/v2/routes/secret.routes';
import userV2Router from './src/v2/routes/user.routes';
import { Markup, Telegraf, Context } from 'telegraf'; // Importing Context
import { createUserHelper, CreateUser } from './src/v2/controller/user.controller';


// Load environment variables from .env file
dotenv.config();

// Initialize Express application
const app: Express = express();
const PORT = process.env.PORT || 5200;

// CORS options
const corsOptions = {
  origin: ['http://localhost:5173', 'https://frog-frontend.vercel.app','https://bot-admin-panel-phi.vercel.app'],
  credentials: true,
};

// Rate limiter configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window`
  standardHeaders: true, // draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers

});

// Apply middlewares
app.use(limiter);
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Preflight requests
app.use(express.urlencoded({ limit: 50 * 1024 * 1024 }));
app.use(express.json({ limit: '50mb' }));
app.use(bodyParser.json());



// Root route
app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.use('/v2/user', userV2Router);
app.use('/v2/secret',secretRouter);
// Bot token
const token = process.env.BOT_TOKEN;
let bot: Telegraf<Context>; // Use the Context type for better type safety

if (!token) {
  console.error('BOT_TOKEN is not defined in the environment variables.');
  process.exit(1); // Exit the process if token is missing
}

try {
  bot = new Telegraf<Context>(token);

  bot.command('start', async (ctx) => {
    const referalId = ctx.message?.text?.split(' ')[1]; // Use message instead of text

    const userDetails: CreateUser = {
      id: ctx.from.id,
      firstName: ctx.from?.first_name,
      lastName: ctx.from?.last_name,
      userName: ctx.from?.username,
      isPremium: ctx.from.is_premium || false, // Default to false if undefined
    };

    if (referalId) userDetails.referedBy = referalId
    try {
      const user: any = await createUserHelper(userDetails); // Await the promise
      console.log(user);
      console.log(ctx.from);

      const inviteUrl = `https://t.me/${process.env.BOT_USERNAME.replace('@', '')}?start=${ctx.from.id}`;
      const text = 'Invite Your friends';

      await ctx.reply(
        `Hi ${userDetails.firstName}, Welcome to Apes community 🦧`,
        Markup.inlineKeyboard([
          Markup.button.webApp("Let's Climb 🦧", 'https://frog-frontend.vercel.app/'),
          Markup.button.url(
            'Share',
            `https://t.me/share/url?url=${encodeURIComponent(inviteUrl)}&text=${encodeURIComponent(text)}`
          ),
        ])
      );
    } catch (error) {
      console.error('Error creating user:', error);
      ctx.reply('There was an error processing your request. Please try again later.');
    }
  });
} catch (error) {
  console.error('Error initializing the bot:', error);
  process.exit(1); // Exit if bot initialization fails
}

// Start the server
app.listen(PORT, async () => {
  try {
    await connectDatabase(); // Wait for the database connection
    bot.launch(); // Launch the bot after successful DB connection
    console.log(`Server started on port ${PORT}`);
  } catch (error) {
    console.error('Failed to connect to the database:', error);

  }
});
