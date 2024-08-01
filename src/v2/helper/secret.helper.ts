import { TokenModel } from "../models/secret.model";


export const generateToken = async (data) => {
    const {secretToken, points, userLimit, expiryTime } = data;
    try{
        const newToken = new TokenModel({
            secretToken,
            points,
            userLimit,
            expiryTime,
        });
        
        await newToken.save();
        return true
    }catch(err){
        return false;
    }
  }