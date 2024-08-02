import mongoose from "mongoose";
import { pointsData } from "../../config/points";
import {  UserModel } from "../models/user.model";
import calculateYearsAgo from "../../utils/calculateAccountAge";
import { generatePointsOnRegister } from "../../utils/generatePointsOnRegister";
import {
  ApeinNameCheck,
  channelMemberCheck,
  twitterCheck,
} from "../helper/user.helper";
import { PointsModel } from "../models/points.model";
import {
  getFriendsDetails,
  getTopUsersWithPoints,
  getTopUsersWithSpecificUserRank,
} from "../queries/user.queries";
import { AdminModel } from "../models/admin.model";

export type CreateUser = {
  id?: number;
  tgId?: number;
  firstName?: string;
  lastName?: string;
  userName?: string;
  premium?: boolean;
  referedBy?: number;
  isPremium?: boolean;
};

export const createUserHelper = (data: CreateUser): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      let user: any = await UserModel.findOne({ tgId: data.id });

      if (user) {
        resolve(channelMemberCheck(user));
      }

      const years: number = calculateYearsAgo(data?.tgId);
      const userCount: number = await UserModel.find({}).countDocuments();
      const dataToSave: {
        tgId: number | string;
        firstName: string;
        lastName: string;
        userName: string;
        isPremium: boolean;
        accountAge: number | string;
        referredBy?: any;
      } = {
        tgId: data.id,
        firstName: data.firstName,
        lastName: data.lastName,
        userName: data.userName,
        isPremium: data?.premium,
        accountAge: years,
      };
      if (data?.referedBy) {
        const referredUser = await UserModel.findOne({ tgId: data?.referedBy });
        dataToSave.referredBy = new mongoose.Types.Array(referredUser?._id);
      }
      user = await new UserModel(dataToSave).save();

      let userPoints = [
        {
          userId: user._id,
          point: generatePointsOnRegister(years, userCount),
          type: "account_age",
        },
      ];

      if (data.premium) {
        userPoints.push({
          userId: user._id,
          point: pointsData.premium,
          type: "telegram_premium",
        });
      }

      if (data?.userName?.includes("ape")) {
        userPoints.push({
          userId: user._id,
          point: pointsData.apeInName,
          type: "ape_in_name",
        });
      }

      const pointSaveData = await PointsModel.insertMany(userPoints);

      console.log(pointSaveData);

      resolve(user);
    } catch (err) {
      console.error(err);
      reject(err.message);
    }
  });
};

export const leadershipController = (tgId: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await getTopUsersWithSpecificUserRank(tgId);
      resolve(result);
    } catch (err) {
      reject(err);
    }
  });
};

export const HomePageUserDetailsController = (userid: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      let userId = parseInt(userid, 10);
      let user: any = await UserModel.findOne({
        tgId: userId,
      });
      if (user) {
        await channelMemberCheck(user);
        await ApeinNameCheck(user);
      }

      const result = await getTopUsersWithPoints(user?._id);
      resolve(result);
    } catch (err) {
      reject(err);
    }
  });
};

export const telegramMemberCheckController = (userid: number) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user: any = await UserModel.findOne({
        tgId: userid,
      });
      if (user) {
        return resolve(await twitterCheck(user));
      }

      return false;
    } catch (err) {
      reject(err);
    }
  });
};
    

export const friendsDetailsPage = (userId) => {
    return new Promise(async (resolve, reject) => {
        try{
            const friends = await getFriendsDetails(userId);
            resolve(friends)
        }catch(err){
            reject(err)
        }
    })
}



export const signupController = (body) => {
  return new Promise(async (resolve, reject) => {
      try{
        const { username, password } = body;
        const newUser = new AdminModel({ username, password });
        newUser.save()
        resolve(newUser)
      }catch(err){
        console.log(err)
          reject(err)
      }
  })
}

