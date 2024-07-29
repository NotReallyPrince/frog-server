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
    point: {
        type: String,
        required: true,
        index: true 
    }
}, {timestamps: true})

export const PointsModel = mongoose.model('userpoints', PointsSchema)