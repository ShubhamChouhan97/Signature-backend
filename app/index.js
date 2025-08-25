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

import path from "path";
import express from "express";
import session from "express-session";
import { RedisStore } from "connect-redis";   // ✅ v7 syntax
import redis from "./config/redis.js";
import cors from "cors";
import router from "./router/index.js";
import { generateMongooseDuplicateKeyMessage } from "./libs/utils.js";

const app = express();
const __dirname = path.resolve();

// ✅ Create RedisStore instance
const redisStore = new RedisStore({
  client: redis,
  prefix: "document:",
});

// ✅ Session middleware
export const sessionMiddleware = session({
  store: redisStore,
  secret: process.env.SESSION_SECRET || "keyboard cat",
  resave: false,
  saveUninitialized: false,
  cookie: {
    domain:'.onrender.com',
    secure: process.env.NODE_ENV === "production", // HTTPS on Render
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 1000 * 60 * 60, // 1h
  },
});

// ✅ CORS setup
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

// ✅ Static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/SignedData", express.static(path.join(__dirname, "SignedData")));
app.use("/public", express.static(path.join(__dirname, "public")));

// ✅ Views
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ✅ Middlewares
app.use(sessionMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Routes
app.use("/", router);

app.get('/check-cookies', async (req, res) => {
  try {
    res.cookie("test1", "test1", {
      domain: '.onrender.com',
      sameSite: "lax",
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    res.cookie("test2", "test2", {
      domain: '.onrender.com',
      sameSite: "lax",
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    res.cookie("test3", "test3", {
      domain: '.onrender.com',
      sameSite: "lax",
      path: "/",
      httpOnly: true,
      secure: false,
    });
    res.json({ cookies: req.cookies })
  } catch (error) {
    res.json({ error });
  }
});

// ✅ Error handler
app.use((error, req, res, next) => {
  console.error(error);
  if (error.code === 11000) {
    return res.status(500).json({
      error: generateMongooseDuplicateKeyMessage(error),
    });
  }
  return res.status(500).json({
    error: "Internal server error",
  });
});

export default app;
