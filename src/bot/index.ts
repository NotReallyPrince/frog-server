import { Telegraf, Markup } from 'telegraf';
import { CreateUser, createUserHelper, myFriendsList } from '../helper/user.helper';

// Initialize the bot
let bot: Telegraf;

try {
  bot = new Telegraf(process.env.BOT_TOKEN);

  // Start command handler
  bot.command('start', async (ctx) => {
    try {
      const referalId = ctx.message.text.split(' ')[1];

      const userDetails: CreateUser = {
        id: ctx.from.id,
        firstName: ctx.from?.first_name,
        lastName: ctx.from?.last_name,
        userName: ctx.from?.username,
        isPremium: ctx.from.is_premium || false, // Handle undefined isPremium
      };

      // Assign referalId if present
      if (referalId) userDetails.referedBy = parseInt(referalId);

      // Create user
      const user: any = await createUserHelper(userDetails);

      // Construct invite URL
      const inviteUrl = `https://t.me/${process.env.BOT_USERNAME.replace('@', '')}?start=${ctx.from.id}`;
      const text = 'Invite Your friends';

      // Send welcome message with inline buttons
      await ctx.reply(
        `Hy ${user.firstName}, Welcome to Apes community 🦧`,
        Markup.inlineKeyboard([
          Markup.button.webApp('Lets Climb 🦧!', 'https://frog-frontend.vercel.app/'),
          Markup.button.url(
            'Share',
            `https://t.me/share/url?url=${encodeURIComponent(inviteUrl)}&text=${encodeURIComponent(text)}`
          ),
        ])
      );
    } catch (err) {
      console.error('Error in /start command:', err);
      await ctx.reply('Sorry, something went wrong while processing your request. Please try again later.');
    }
  });

  // Friends list command handler (commented out)
  // bot.command('friends', async (ctx) => {
  //   try {
  //     const list = await myFriendsList(ctx.from.id);
  //     await ctx.reply(JSON.stringify(list));
  //   } catch (err) {
  //     console.error('Error fetching friends list:', err);
  //     await ctx.reply('Sorry, unable to fetch your friends list at the moment.');
  //   }
  // });

  // Text command handler (commented out)
  // bot.command('text', async (ctx) => {
  //   try {
  //     const { status } = await bot.telegram.getChatMember('@giraff_bot_coomuni', ctx.from.id);
  //     console.log(status);
  //     await ctx.reply(`Your status: ${status}`);
  //   } catch (err) {
  //     console.error('Error checking chat member status:', err);
  //     await ctx.reply('Could not check your status at the moment.');
  //   }
  // });

  // Global error handler
  bot.catch((err, ctx) => {
    console.error(`Unexpected error for ${ctx.updateType}:`, err);
    ctx.reply('Oops! An unexpected error occurred. Our team has been notified.');
  });

  // Start the bot
  bot.launch().then(() => {
    console.log('Bot started successfully!');
  });

  // Enable graceful stop on SIGINT and SIGTERM
  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));
} catch (error) {
  console.error('ERROR HERE:', error);
}

export default bot;
