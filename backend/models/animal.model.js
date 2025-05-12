import mongoose from "mongoose";


const ReplySchema = mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    text: {
        type: String,
        trim: true,
        default: ""
    },
    thumbsUp: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: []
        }
    ],
    thumbsUp: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ]
}, {timestamps: true});

const CommentSchema = mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    text: {
        type: String,
        trim: true,
        default: ""
    },
    replies: {
        type: [ReplySchema],
        default: []
    },
    thumbsUp: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: []
        }
    ],
    thumbsUp: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: []
        }
    ]
}, {timestamps: true});



const AnimalSchema = new mongoose.Schema({
    name: {
        type: String
    },
    image: {
        type: String,
        default: ""
    },
    description: {
        type: String,
        default: ""
    },
    habitat: {
        type: String,
        required: true,
        enum: ["air", "land", "water"]
    },
    facts: {
        type: String,
        default: ""
    },
    comments: {
        type: [CommentSchema],
        default: []
    },
    thumbsUp: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: []
        }
    ],
    thumbsUp: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: []
        }
    ]
}, {timestamps: true});


const Animal = mongoose.model("animal", AnimalSchema);

export default Animal;