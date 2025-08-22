// import path, { dirname } from 'path';
// import express from 'express';
// import session from 'express-session';
// import { RedisStore } from "connect-redis";

// import router from './router/index.js';
// import redis from './config/redis.js';
// import cors from 'cors';
// import { generateMongooseDuplicateKeyMessage } from './libs/utils.js';
// const app = express();

// const __dirname = import.meta.dirname;
// const redisStore = new RedisStore({
// 	client: redis.duplicate(),
// 	prefix: "document:",
// });

// export const sessionMiddleware = session({
// 	store: redisStore,
// 	resave: false,
// 	saveUninitialized: false,
// 	secret: process.env.SESSION_SECRET || "keyboard cat",
// 	cookie: {
// 		domain: process.env.BASE_DOMAIN || 'https://signature-backend-79t1.onrender.com'
// 	}
// });
// // app.use(cors({
// // 	origin: (origin, cb) => {
// // 		return cb(null, origin);
// // 	},
// // 	credentials: true,
// // }))
// app.use(cors({
// 	origin: process.env.FRONTEND_URL,
// 	credentials: true,

// }))
// // make uplaod static
// app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
// app.use('/SignedData',express.static(path.join(__dirname,"../SignedData")));
// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, '/views'));
// app.use(sessionMiddleware);
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use("/public", express.static(path.join(__dirname, "../public")));
// app.use('/', router);

// app.use((error, req, res, next) => {
// 	try {
// 		console.error(error);
// 		if (error.code === 11000) {
// 			return res.status(500).json({
// 				error: generateMongooseDuplicateKeyMessage(error),
// 			});
// 		}
// 		return res.status(500).json({
// 			error: 'Internal server error',
// 		});
// 	} catch (error) {
// 		console.error(error);
// 		return res.status(500).json({
// 			error: 'Internal server error',
// 		});
// 	}
// });

// export default app;


import path from 'path';
import express from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import cors from 'cors';

import router from './router/index.js';
import { generateMongooseDuplicateKeyMessage } from './libs/utils.js';

const app = express();
const __dirname = import.meta.dirname;

// ✅ Use MongoDB session store
export const sessionMiddleware = session({
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_CONNECTION_STRING,     // your MongoDB connection string
        collectionName: "sessions",          // collection for sessions
        ttl: 14 * 24 * 60 * 60               // session expiry in seconds (14 days)
    }),
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET || "keyboard cat",
    cookie: {
        httpOnly: true,                      // prevents JS access to cookie
        secure: process.env.NODE_ENV === "production", // only send over HTTPS in production
        sameSite: "lax",                     // CSRF protection
        domain: process.env.BASE_DOMAIN || undefined,
        maxAge: 14 * 24 * 60 * 60 * 1000     // 14 days in ms
    }
});

// ✅ CORS
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));

// ✅ Static folders
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/SignedData", express.static(path.join(__dirname, "../SignedData")));
app.use("/public", express.static(path.join(__dirname, "../public")));

// ✅ View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

// ✅ Session middleware
app.use(sessionMiddleware);

// ✅ Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Routes
app.use('/', router);

// ✅ Error handler
app.use((error, req, res, next) => {
    try {
        console.error(error);
        if (error.code === 11000) {
            return res.status(500).json({
                error: generateMongooseDuplicateKeyMessage(error),
            });
        }
        return res.status(500).json({
            error: 'Internal server error',
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: 'Internal server error',
        });
    }
});

export default app;
