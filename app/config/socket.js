import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import redis from './redis.js';

const pubClient = redis.duplicate();
const subClient = pubClient.duplicate();

/**
 * @type {Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>}
 */
export let io = null;

export function createSocketServer(server) {
    io = new Server(server, {
        cors: {
            origin: process.env.FRONTEND_URL,
            credentials: true,
            preflightContinue: true,
        },
        adapter: createAdapter(pubClient, subClient)
    });

    io.on("connection", (socket) => {
        if (!socket.request.session.userId) {
            return socket.disconnect();
        }
        socket.join(socket.request.session.userId);
    });

    return io;
}


export default { io };

// import { Server } from "socket.io";
// import { createAdapter } from "@socket.io/mongo-adapter";
// import { MongoClient } from "mongodb";

// export let io = null;

// export async function createSocketServer(server) {
//     const mongoClient = new MongoClient(process.env.MONGO_CONNECTION_STRING);
//     await mongoClient.connect();

//     const db = mongoClient.db("socketIO"); // database for socket events
//     const collection = db.collection("socket-events");
    
//     // must be capped collection for Pub/Sub
//     await collection.drop().catch(() => {}); 
//     await db.createCollection("socket-events", { capped: true, size: 1e6 });

//     io = new Server(server, {
//         cors: {
//             origin: process.env.FRONTEND_URL,
//             credentials: true,
//             preflightContinue: true,
//         }
//     });

//     io.adapter(createAdapter(collection, db.collection("socket-events-sync")));

//     io.on("connection", (socket) => {
//         if (!socket.request.session?.userId) {
//             return socket.disconnect();
//         }
//         socket.join(socket.request.session.userId);
//     });

//     return io;
// }

// export default { io };
