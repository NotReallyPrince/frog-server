import { Telegraf, Markup } from 'telegraf';
import { CreateUser, createUserHelper } from '../helper/user.helper';

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.command('start',async ctx => {
  const referalId = ctx.text.split(' ')[1]

  const userDetails:CreateUser ={
    id: ctx.from.id,
    firstName: ctx.from?.first_name,
    lastName: ctx.from?.last_name,
    userName:  ctx.from?.username,
  }

  if(referalId)
    userDetails.referedBy = parseInt(referalId)

  const user: any = await createUserHelper(userDetails)
  
  console.log(user);

  const inviteUrl = `https://t.me/giraffe_testbot?start=${ctx.from.id}`
  const text = 'Invite Your friends'
  

  ctx.reply(
    `Hy ${user.firstName}, Welcome to frog community 🐸
${user.referedBy?`You are refered by ${user.referedBy.firstName}`:''}
share this link to invite your friends: https://t.me/giraffe_testbot?start=${ctx.from.id}`,
      Markup.inlineKeyboard([
        Markup.button.webApp("Lets Jump 🐸!", 'https://frog-client.netlify.app/'),
        Markup.button.url(
          "Share", 
          `https://t.me/share/url?url=${encodeURIComponent(inviteUrl)}&text=${encodeURIComponent(text)}`
        )
      ]),
  )
})

export default bot;