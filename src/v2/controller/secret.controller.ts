import { generateToken } from "../helper/secret.helper";
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
        const { secret } = body;
        const token = await findToken(secret)
        if (!token) {
            reject('invalid Token')
        }
        if (new Date() > token.expiryTime) {
            reject('Token Expired')
        }

        resolve(token);
      } catch (error) {
        reject(error);
      }
    });
  };
  