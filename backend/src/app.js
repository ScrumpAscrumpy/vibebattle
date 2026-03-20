import cors from "cors";
import express from "express";
import { currentUser } from "./middlewares/currentUser.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { logger } from "./middlewares/logger.js";
import { notFound } from "./middlewares/notFound.js";
import { router } from "./routes/index.js";

function buildCorsOptions() {
  const rawOrigin = process.env.CORS_ORIGIN || "*";

  if (rawOrigin === "*") {
    return { origin: "*" };
  }

  const allowedOrigins = rawOrigin
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  return {
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`CORS blocked for origin: ${origin}`));
    },
  };
}

export function createApp() {
  const app = express();

  app.use(cors(buildCorsOptions()));
  app.use(express.json());
  app.use(logger);
  app.use(currentUser);

  app.use(router);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
