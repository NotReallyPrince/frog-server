import mongoose from "mongoose";
import { pointsData, pointType } from "../../config/points";
import { UserModel } from "../models/user.model";
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
  referedBy?: string;
  isPremium?: boolean;
};

export const createUserHelper = (data: CreateUser): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      let user: any = await UserModel.findOne({ tgId: data.id });
        let referredUser:any
      if (user) {
        return resolve(channelMemberCheck(user));
      }

      const years: number = calculateYearsAgo(data?.id);
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
         referredUser = await UserModel.findOne({ tgId: data?.referedBy });
        dataToSave.referredBy = new mongoose.Types.ObjectId(referredUser?._id);
      }
      user = await new UserModel(dataToSave).save();
      const account_age_point = generatePointsOnRegister(years, userCount)

      let userPoints = [
        {
          userId: user._id,
          points: account_age_point,
          type: "account_age",
        },
      ];

      if (data.premium) {
        userPoints.push({
          userId: user._id,
          points: pointsData.premium,
          type: "telegram_premium",
        });
      }

      if (data?.userName?.includes("ape")) {
        userPoints.push({
          userId: user._id,
          points: pointsData.apeInName,
          type: "ape_in_name",
        })
      }

      if(data?.referedBy){
        const addUser = new PointsModel(
          {
            userId: referredUser._id,
            points: Math.floor((account_age_point * 20) / 100),
            type: pointType.REFERRAL,
          }
        )
          await addUser.save()
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
    try {
      const friends = await getFriendsDetails(userId);
      resolve(friends);
    } catch (err) {
      reject(err);
    }
  });
};

export const signupController = (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { username, password } = body;
      const newUser = new AdminModel({ username, password });
      newUser.save();
      resolve(newUser);
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
};

export const getReferalCountFromPublishedDate = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const PUBLISHED_DATE = "2024-08-04";

      const referalCount = await UserModel.countDocuments({
        createdAt: {
          $gte: PUBLISHED_DATE,
        },
        referredBy: id,
      });

      resolve(referalCount);
    } catch (err) {
      reject(err);
    }
  });
};
