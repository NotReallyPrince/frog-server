import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    tgId: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    isPremium: {
        type: Boolean,
        required: true,
        default: false
    },
    accountAge: {
        type: String,
        required: true
    },
    referredBy: {
        type: String
    }
}, {timestamps: true})

export const UserModel = mongoose.model('users',UserSchema)
export type IUserModel = {
    _id: string;
    tgId: string;
    userName: string;
    firstName: string;
    lastName: string;
    isPremium: string;
    accountAge: string;
    referredBy: string;
}