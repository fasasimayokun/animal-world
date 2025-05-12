import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    fullname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    isadmin: {
        type: Boolean,
        default: false
    },
    profileImg: {
        type: String,
        default: ""
    },
    bio: {
        type: String,
        default: ""
    },
    saved: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Animal",
            default: []
        }
    ]
}, { timestamps: true});


const User = mongoose.model("user", UserSchema);

export default User;