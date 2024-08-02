import mongoose from "mongoose";

const PointsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        index: true 
    },
    type: {
        type: String,
        required: true
    },
    referred: {
        type:  mongoose.Schema.Types.ObjectId,
    },
    points: {
        type: Number,
        required: true,
        index: true 
    }
}, {timestamps: true})

export const PointsModel = mongoose.model('userpoints', PointsSchema)