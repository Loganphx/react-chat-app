import express from 'express';
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import {connectDB} from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import fileUpload from "express-fileupload";
import path from "node:path";

const app = express();

const PORT = process.env.PORT;

const __dirname = path.resolve();

app.use(express.json());

app.use(cors({
    origin: ["http://localhost:5175", `http://localhost:${PORT}`],
    credentials: true
}));

app.use(cookieParser());

app.use(fileUpload({
    useTempFiles: true, // so you can send file paths directly to Cloudinary
    tempFileDir: "/tmp/",
    createParentPath: true
}));

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

if(process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "frontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
    })
}

const connections = new Set();

await connectDB();
const server = app.listen(PORT, async () => {
    console.log('Server running on port ', PORT);
})

server.on('connection', (conn) => {
    connections.add(conn);

    conn.on('close', () => {
        connections.delete(conn);
    });
});
server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use!`);
        process.exit(1);
    } else {
        console.error('Server error:', err);
    }
});

process.on('SIGINT', async () => {
    console.log(`Received SIGINT. Closing server...`);
    connections.forEach(conn => conn.destroy());
    process.exit(0);
});
// process.on('SIGTERM', async () => await gracefulShutdown('SIGTERM'));
// process.once('SIGUSR2', async () => await gracefulShutdown('SIGUSR2')); // nodemon restart