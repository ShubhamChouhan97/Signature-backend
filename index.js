// import { createServer } from 'http';
// import argvMap from './app/libs/argvMap.js';
// import './app/config/env.js';
// import mongoose from './app/config/mongoose.js';

// import { createSocketServer } from './app/config/socket.js';
// import app, { sessionMiddleware } from './app/index.js';

// const server = createServer(app);

// const io = createSocketServer(server);
// app.set("io", io);
// io.engine.use(sessionMiddleware);

// const PORT = argvMap.get('port') ?? 3000;

// server.listen(PORT, (err) => {
//     if (!err) {
//         console.info(`Server Started at port ${PORT}`);
//         return;
//     }
//     console.error(err);
// });

import { createServer } from "http";
import argvMap from "./app/libs/argvMap.js";
import "./app/config/env.js";
import mongoose from "./app/config/mongoose.js";

import { createSocketServer } from "./app/config/socket.js";
import app, { sessionMiddleware } from "./app/index.js";

const PORT = argvMap.get("port") ?? 3000;

// 1. Create HTTP server
const server = createServer(app);

// 2. Create socket.io server attached to http server
const io = createSocketServer(server);

// 3. Attach express-session middleware to socket.io BEFORE using socket connections
if (io && io.engine) {
    io.engine.use(sessionMiddleware);
} else {
    console.error("❌ Socket.IO not initialized correctly");
}

// 4. Store io instance in app (so routes/controllers can use it)
app.set("io", io);

// 5. Start server
server.listen(PORT, (err) => {
    if (!err) {
        console.info(`🚀 Server started on port ${PORT}`);
    } else {
        console.error("❌ Failed to start server:", err);
    }
});
