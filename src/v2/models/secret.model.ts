import mongoose, { Document, Schema } from 'mongoose';

// Token Document Interface
export interface IToken extends Document {
    platform: string;
    secretToken: string;
    points: number;
    userLimit: number;
    expiryTime: Date;
}

// Token Schema
const TokenSchema = new Schema<IToken>({
    platform: {
        type: String,
        required: true,
        enum: ['Instagram', 'Telegram', 'Twitter'], // Restrict to valid platforms
    },
    secretToken: {
        type: String,
        required: true,
        unique: true, // Ensure uniqueness
    },
    points: {
        type: Number,
        required: true,
        min: 1, // Points must be positive
    },
    userLimit: {
        type: Number,
        required: true,
        min: 1, // Ensure at least one user can redeem
    },
    expiryTime: {
        type: Date,
        required: true,
    }
}, { timestamps: true });

export const TokenModel = mongoose.model<IToken>('Token', TokenSchema);
