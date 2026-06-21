import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { errorMiddleware, notFound } from "./middlewares/error.middleware";
import { apiRoutes } from "./routes";
import { apiDocumentation } from "./config/swagger";

export const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(",") || true, credentials: true }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 100 }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: { title: "OfficeFlow Backend API", version: "1.0.0" },
    servers: [{ url: "/api" }],
    ...apiDocumentation,
  },
  apis: ["./src/routes/*.ts"],
});

app.get("/health", (_req, res) => res.json({ success: true, data: { status: "ok" } }));
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api", apiRoutes);
app.use(notFound);
app.use(errorMiddleware);
