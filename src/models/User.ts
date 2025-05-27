import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
    _id: string;
    content: string;
    createdAt: Date;
}

const MessageSchema: Schema<Message> = new Schema({

    content: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

export interface Users extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    isAcceptingMessages: boolean;
    messages: Message[];
}

const UserSchema: Schema<Users> = new Schema({

    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    verifyCode: {
        type: String,
        required: true,
        trim: true,
    },
    verifyCodeExpiry: {
        type: Date,
        required: true,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isAcceptingMessages: {
        type: Boolean,
        default: false,
    },
    messages: {
        type: [MessageSchema],
        default: [],
    },
})

const User = mongoose.models.UserFeedback as mongoose.Model<Users> || mongoose.model<Users>("UserFeedback", UserSchema);

export default User;