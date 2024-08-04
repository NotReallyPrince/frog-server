import { TokenModel } from "../models/secret.model";

export const generateToken = async (data) => {
  const { secretToken, points, userLimit, expiryTime } = data;
  try {
    const newToken = new TokenModel({
      secretToken,
      points,
      userLimit,
      expiryTime,
    });

    await newToken.save();
    return true;
  } catch (err) {
    return false;
  }
};

export const getExpiryDate = (): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      // Using UTC for consistent date calculations
      const now = new Date();
      const startOfToday = new Date(
        Date.UTC(
          now.getUTCFullYear(),
          now.getUTCMonth(),
          now.getUTCDate(),
          0,
          0,
          0
        )
      );
      const endOfToday = new Date(
        Date.UTC(
          now.getUTCFullYear(),
          now.getUTCMonth(),
          now.getUTCDate(),
          23,
          59,
          59,
          999
        )
      );

      // Logging for debugging
      console.log("Start of Today (UTC):", startOfToday);
      console.log("End of Today (UTC):", endOfToday);

      // Query for tokens expiring today
      const tokens = await TokenModel.findOne({
        expiryTime: {
          $gte: startOfToday,
          $lt: endOfToday,
        },
        
      },{ expiryTime: 1, _id: 0 });

      
      resolve(tokens);
    } catch (error) {
      console.error("Error fetching tokens:", error);
      reject(error);
    }
  });
};
