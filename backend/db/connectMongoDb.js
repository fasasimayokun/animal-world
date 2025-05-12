import mongoose from "mongoose";


const db = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log(`Database connected successfully ${conn.connection.host}`);
    } catch (error) {
        console.log("Failed to connect to mongo db ", error.message);
    }
}

export default db;