import { startServer } from "./server";
import "dotenv/config";

const PORT = process.env.PORT || "3000";

startServer(PORT);
