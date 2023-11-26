import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import "dotenv/config";
import { authRouter } from "./routes/auth.router.js";
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));
// routes
app.use("/login", authRouter);
export { app };
//# sourceMappingURL=app.js.map