import bot from "../bot";
import { pointsData, pointType } from "../../config/points";
import { PointsModel } from "../models/points.model";
import { IUserModel } from "../models/user.model";

export const channelMemberCheck = async (user:IUserModel) => {
    try{
        const channelPoint = await PointsModel.findOne({userId: user._id, type:pointType.CHANNEL})
        if(channelPoint)
          return user
        
        const { status } = await bot.telegram.getChatMember(process.env.CHANNEL_ID, Number(user.tgId));
        
        if(
          status == 'administrator' ||
          status == 'creator' ||
          status == 'member'
        ) {

          const points = new PointsModel({points: pointsData.telegram, userId: user._id,type:pointType.CHANNEL})
          await points.save();
          return user;
        }
        
        return false
    }catch(err){
      console.log(err)
        return false;
    }
  }


  export const twitterCheck = async (user:IUserModel) => {
    try{
        const channelPoint = await PointsModel.findOne({userId: user._id, type: pointType.TWITTER})
        if(channelPoint)
          return {user, channelPoint}
          const points = new PointsModel({points: pointsData.twitter, userId: user._id,type:pointType.TWITTER})
          await points.save();
          return true;
    }catch(err){
        return false;
    }
  }

  export const ApeinNameCheck = async (user:IUserModel) => {
    try{
        const channelPoint = await PointsModel.findOne({userId: user._id, type:  pointType.APE_NAME})
        if(channelPoint)
          return {user, channelPoint}

        if(user?.userName && user?.userName?.includes('ape')){
          const points = new PointsModel({points: pointsData.apeInName, userId: user._id,type:pointType.APE_NAME})
          await points.save();
          return true;
        }

        return false
         
    }catch(err){
        return false;
    }
  }