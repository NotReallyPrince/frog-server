import mongoose, { Document, Schema } from "mongoose";

// Token Document Interface
export interface ITask extends Document {
  name: string;
  link: string;
  isActive: boolean;
}

// Token Schema
const TaskSchema = new Schema<ITask>(
  {
    name: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const TaskModel = mongoose.model<ITask>("Task", TaskSchema);
