import mongoose from "mongoose"
import { pointsData } from "../../config/points"
import { ReferalModel } from "../../models/referal.previous.model"
import { IUserModel, UserModel } from "../../models/user.model"
import calculateYearsAgo from "../../utils/calculateAccountAge"
import { generatePointsOnRegister } from "../../utils/generatePointsOnRegister"
import { channelMemberCheck } from "../helper/user.helper"

export type CreateUser = {
    id: number;
    tgId?: number;
    firstName?: string;
    lastName?: string;
    userName?: string;
    premium?: boolean;
    referedBy?: number;
    isPremium?: boolean;
  }

export const createUserHelper = (data: CreateUser): Promise<any> => {
    return new Promise(async(resolve, reject) => {
        try{
            let user:any = await UserModel.findOne({tgId: data.id})
            
            if(user){
                return channelMemberCheck(user)
            }

            const years:number = calculateYearsAgo(data?.tgId);
            const userCount: number = await UserModel.find({}).countDocuments();
            const dataToSave: {
                tgId: number | string,
                firstName: string,
                lastName: string,
                userName: string,
                isPremium: boolean,
                accountAge: number | string,
                referredBy: any
            } = {
                tgId: data.id,
                firstName: data.firstName,
                lastName: data.lastName,
                userName: data.userName,
                isPremium: data?.premium,
                accountAge: years,
                referredBy: ''
            }
            if(data?.referedBy){
                const referredUser = await UserModel.findOne({tgId: data?.referedBy})
                dataToSave.referredBy = new mongoose.Types.Array(referredUser?._id)
            }
            user = await new UserModel(dataToSave).save();
            
            let userPoints = [
                {
                    userId: user._id,
                    point: generatePointsOnRegister(years, userCount),
                    type: 'account_age'
                }
            ]
           
            if(data.isPremium){
                userPoints.push({
                    userId: user._id,
                    point: pointsData.premium,
                    type: 'telegram_premium'
                })
            }

            if(data?.userName?.includes('ape')){
                userPoints.push({
                    userId: user._id,
                    point: pointsData.apeInName,
                    type: 'ape_in_name'
                })
            }



        }catch(err){
            console.error(err)
            reject(err.message)
        }
    })
}