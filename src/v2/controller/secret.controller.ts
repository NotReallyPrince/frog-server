import mongoose from "mongoose";
import { pointType } from "../../config/points";
import { generateToken, getExpiryDate } from "../helper/secret.helper";
import { PointsModel } from "../models/points.model";
import { TokenModel } from "../models/secret.model";
import { TaskModel } from "../models/tasks.model";
import { findToken, getAllTokens } from "../queries/secret.queries";

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
      const tokens = await getAllTokens();
      resolve(tokens);
    } catch (error) {
      reject(error);
    }
  });
};

export const deleteTokens = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const tokens = await TokenModel.findByIdAndDelete(id);
      resolve(tokens);
    } catch (error) {
      reject(error);
    }
  });
};

export const redeemToken = (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { secret, userID } = body;
      const token = await findToken(secret);
      console.log(token);
      if (!token) {
        return reject("invalid Token");
      }
      if (new Date() > token.expiryTime) {
        return reject("Token Expired");
      }
      const redemptionCount = await PointsModel.countDocuments({
        referred: token._id,
      });
      if (redemptionCount >= token.userLimit) {
        return reject("Token redemption limit reached");
      }

      const userRedemption = await PointsModel.findOne({
        userId: userID,
        referred: token._id,
      });
      if (userRedemption) {
        return reject("User has already redeemed this token");
      }

      const pointsEntry = new PointsModel({
        userId: userID,
        type: pointType.SECRET,
        points: token.points,
        referred: token._id,
      });

      await pointsEntry.save();
      resolve({ message: "REDEEMED", point: token.points });
    } catch (error) {
      reject(error);
    }
  });
};

export const getValidity = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const validity = await getExpiryDate();
      resolve(validity);
    } catch (error) {
      reject(error);
    }
  });
};

export const createTask = (body) => {
  const { name, link } = body;
  return new Promise(async (resolve, reject) => {
    try {
      const Task = new TaskModel({
        name,
        link,
      });

      await Task.save();
    } catch (error) {
      reject(error);
    }
  });
};

export const getTask = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await TaskModel.find();

      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
};

export const changeStatus = (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      const {id,status} = body
      if (!id || !status) {
        return reject(new Error("Invalid input: id and status are required"));
      }
        
      const result = await TaskModel.updateOne(
        { _id: new mongoose.Types.ObjectId(id) }, 
        { $set: { status } }                      
      );

      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
};
