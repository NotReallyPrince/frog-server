import { IToken, TokenModel } from "../models/secret.model";

export const getActiveToken = async () => {
  return await TokenModel.find({ expiryTime: { $gt: new Date() } });
};

export const findToken = async (token: string): Promise<IToken | null> => {
  return await TokenModel.findOne({ secretToken: token });
};
