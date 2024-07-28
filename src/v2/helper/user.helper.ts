import bot from "../../bot";
import { pointsData } from "../../config/points";
import { PointsModel } from "../../models/points.model";
import { IUserModel } from "../../models/user.model";

export const channelMemberCheck = async (user:IUserModel) => {
    try{
        const channelPoint = await PointsModel.findOne({userId: user._id, type: "channel_member"})
        if(channelPoint)
          return {user, channelPoint}
        
        const { status } = await bot.telegram.getChatMember(process.env.CHANNEL_ID, Number(user.tgId));
        
        if(
          status == 'administrator' ||
          status == 'creator' ||
          status == 'member'
        ) {

          const points = new PointsModel({point: pointsData.twitter, userId: user._id})
          await points.save();
          return true;
        }
        
        return false
    }catch(err){
        return false;
    }
  }