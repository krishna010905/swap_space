import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";
import expressListRoutes from "express-list-routes";

// --------------------------------
import path from "path"

dotenv.config({
    path: path.resolve(process.cwd(), '.env')
})

// -------------------------------

connectDB().then(
    () => {
        console.log("✅ Database connected. Logging registered routes...");

        // Log all registered routes
        // expressListRoutes(app);

        app.listen(process.env.PORT || 8000, () =>{
            console.log(`Server is running on port ${process.env.PORT || 8000}`);
        })
    }
).catch((err) => {
    console.log("MONGO DB Connection failed in src/index.js ", err)
})