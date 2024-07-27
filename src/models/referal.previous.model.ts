import mongoose from "mongoose";

const ReferalSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    referedById: {
        type: String,
        required: true
    }
})

export const ReferalModel = mongoose.model('referals', ReferalSchema)