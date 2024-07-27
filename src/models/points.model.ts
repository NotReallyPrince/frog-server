import mongoose from "mongoose";

const PointsSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    point: {
        type: String,
        required: true
    }
}, {timestamps: true})

export const PointsModel = mongoose.model('userpoints', PointsSchema)