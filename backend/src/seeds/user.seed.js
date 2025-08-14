import seedData from './MOCK_DATA.json' with {type: "json"};
import {connectDB} from "../lib/db.js";
import User from "../models/user.model.js";

console.log(seedData);

const seedDatabase = async () => {
    try {
        await User.insertMany(seedData);
        console.log("Database seeded successfully.");
    } catch (error) {
        console.log(error);
    }
}

export default seedDatabase;