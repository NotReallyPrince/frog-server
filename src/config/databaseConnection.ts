import mongoose from "mongoose";

export const connectDatabase = async () => {
    const uri: string = process.env.DATABASE_URL || "";
    console.log({uri});
    
    await mongoose.connect(uri).then(() =>
      console.log('Database Connected successfully!'
      ))
}