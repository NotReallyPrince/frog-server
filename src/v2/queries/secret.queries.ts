import { IToken, TokenModel } from "../models/secret.model";



export const getAllTokens = async () => {
  return await TokenModel.find();
};

export const findToken = async (token: string): Promise<IToken | null> => {
  return await TokenModel.findOne({ secretToken: token });
};
