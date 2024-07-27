import { Telegraf, Markup } from 'telegraf';
import { CreateUser, createUserHelper, myFriendsList } from '../helper/user.helper';

let bot: Telegraf;

try{
  bot = new Telegraf(process.env.BOT_TOKEN);

  bot.command('start',async ctx => {
    const referalId = ctx.text.split(' ')[1]

    const userDetails:CreateUser = {
      id: ctx.from.id,
      firstName: ctx.from?.first_name,
      lastName: ctx.from?.last_name,
      userName:  ctx.from?.username,
      isPremium: ctx.from.is_premium
    }

    if(referalId)
      userDetails.referedBy = parseInt(referalId)

    const user: any = await createUserHelper(userDetails)

    // console.log(user);

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

  // bot.command('friends', async ctx => {
  //   const list = await myFriendsList(ctx.from.id);
  //   ctx.reply(JSON.stringify(list))
  // })

  // bot.command('text', async ctx => {
  //   const { status } = await bot.telegram.getChatMember('@giraff_bot_coomuni',ctx.from.id);
  //   console.log(status);
    
  // })



}catch(error){
  console.log('ERROR HERE:',error);
  
}
export default bot;