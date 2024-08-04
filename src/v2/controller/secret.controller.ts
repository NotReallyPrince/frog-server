import { pointType } from "../../config/points";
import { generateToken } from "../helper/secret.helper";
import { PointsModel } from "../models/points.model";
import { TokenModel } from "../models/secret.model";
import { findToken, getActiveToken } from "../queries/secret.queries";

export const generateTokenController = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const token = await generateToken(userId);
      resolve(token);
    } catch (err) {
      reject(err);
    }
  });
};

export const getTokens = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const tokens = await getActiveToken();
      resolve(tokens);
    } catch (error) {
      reject(error);
    }
  });
};


export const deleteTokens = (id) => {
    return new Promise(async (resolve, reject) => {
      try {
        const tokens = await TokenModel.findByIdAndDelete(id)
        resolve(tokens);
      } catch (error) {
        reject(error);
      }
    });
  };


  export const redeemToken = (body) => {
    return new Promise(async (resolve, reject) => {

     
      try {
        const { secret,userID } = body;
        const token = await findToken(secret)
        console.log(token)
        if (!token) {
            return reject('invalid Token')
        }
        if (new Date() > token.expiryTime) {
            return reject('Token Expired')
        }
        const redemptionCount = await PointsModel.countDocuments({ referred: token._id });
        if (redemptionCount >= token.userLimit) {
           return reject('Token redemption limit reached' )
        }

        const userRedemption = await PointsModel.findOne({ userId:userID, referred: token._id });
        if (userRedemption) {
           return reject('User has already redeemed this token' )
        }

        const pointsEntry = new PointsModel({
            userId: userID,
            type: pointType.SECRET,
            points: token.points, 
            referred: token._id,
        });

        await pointsEntry.save();
        resolve({message:'REDEEMED',point:token.points});
      } catch (error) {
        reject(error);
      }
    });
  };
  