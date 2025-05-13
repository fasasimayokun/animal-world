import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/user.model.js";
import Animal from "../models/animal.model.js";

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB connected");

    // Clear existing data
    await User.deleteMany();
    await Animal.deleteMany();

    // Dummy users
    const users = await User.insertMany([
      {
        username: "makayfash",
        fullname: "Makay Fash",
        email: "maykayfash@example.com",
        password: "123456",
        isAdmin: true,
      },
      {
        username: "jamesanderson",
        email: "james.anderson@example.com",
        fullname: "James Anderson",
        password: "123456",
        profileImg: "https://randomuser.me/api/portraits/men/1.jpg",
      },
      {
        username: "oliviamiller",
        email: "olivia.miller@example.com",
        fullname: "Olivia Miller",
        password: "123456",
        profileImg: "https://randomuser.me/api/portraits/women/2.jpg",
      },
      {
        username: "danielrodriguez",
        email: "daniel.rodriguez@example.com",
        fullname: "Daniel Rodriguez",
        password: "123456",
        profileImg: "https://randomuser.me/api/portraits/men/7.jpg",
      },
      {
        username: "ameliagarcia",
        email: "amelia.garcia@example.com",
        fullname: "Amelia Garcia",
        password: "123456",
        profileImg: "https://randomuser.me/api/portraits/women/8.jpg",
      },
      
    ]);

    console.log("Users seeded");

    // Dummy animal posts
    await Animal.insertMany([
      {
        name: "Elephant",
        description: "Large land mammal with tusks.",
        image: "",
        habitat: "land",
        facts: "Elephants can live up to 70 years.",
        thumbsUp: [users[1]._id, users[2]._id],
        comments: [
          {
            author: users[1]._id,
            text: "They are so majestic!",
            thumbsUp: [users[2]._id],
            replies: [
              {
                author: users[2]._id,
                text: "Absolutely agree!",
              },
              {
                author: users[3]._id,
                text: "Yes, and very intelligent.",
              },
            ],
          },
        ],
      },
      {
        name: "Penguin",
        description: "Flightless bird that swims.",
        image: "",
        habitat: "water",
        facts: "Penguins are excellent swimmers.",
        createdBy: users[1]._id,
        thumbsUp: [users[0]._id, users[3]._id],
        thumbsDown: [users[1]._id],
        comments: [
          {
            author: users[4]._id,
            text: "So cute and funny!",
            thumbsUp: [users[0]._id],
          },
        ],
      },
      {
        name: "Dolphin",
        description: "Dolphins are intelligent water mammals.",
        image: "",
        habitat: "water",
        facts: "They use echolocation to communicate.",
        comments: [
          {
            author: users[1]._id,
            text: "They are so majestic!",
            thumbsUp: [users[2]._id],
            replies: [
              {
                author: users[2]._id,
                text: "Absolutely agree!",
              },
              {
                author: users[3]._id,
                text: "Yes, and very intelligent.",
              },
            ],
          },
        ],
      },
      {
        name: "Eagle",
        description: "Eagles are powerful birds of prey.",
        image: "",
        habitat: "air",
        facts: "They have excellent eyesight.",
        comments: [
          {
            author: users[1]._id,
            text: "They are so majestic!",
            thumbsUp: [users[2]._id],
            replies: [
              {
                author: users[2]._id,
                text: "Absolutely agree!",
              },
              {
                author: users[3]._id,
                text: "Yes, and very intelligent.",
              },
            ],
          },
        ],
      },
      {
        name: "Frog",
        description: "Frogs live both in water and on land.",
        image: "",
        habitat: "land", // note: your current schema only allows one habitat value
        facts: "They undergo metamorphosis from tadpoles.",
        comments: [
          {
            author: users[1]._id,
            text: "They are so good!",
            thumbsUp: [users[2]._id],
            replies: [
              {
                author: users[2]._id,
                text: "i think so too!",
              },
              {
                author: users[3]._id,
                text: "Yes, and very intelligent.",
              },
            ],
          },
        ],
      },
      {
        name: "Crocodile",
        description: "Crocodiles are reptiles that live in water and land.",
        image: "",
        habitat: "water",
        facts: "They have powerful jaws and stealthy hunting techniques.",
        comments: [
          {
            author: users[1]._id,
            text: "They are so majestic!",
            thumbsUp: [users[0]._id,users[1]._id,users[2]._id],
            thumbsDown: [users[3]._id],
            replies: [
              {
                author: users[2]._id,
                text: "i don't agree!",
                thumbsUp: [users[0]._id, users[1]._id, users[2]._id],
                thumbsDown: [users[3]._id],
              },
              {
                author: users[3]._id,
                text: "Yes, and very intelligent.",
                thumbsUp: [users[2]._id, users[3]._id],
                thumbsDown: [users[1]._id],
              },
            ],
          },
        ],
      },
    ]);

    console.log("Animals seeded");
    process.exit();
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
};

seedDatabase();
