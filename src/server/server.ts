import { createServer } from "http";
import { handleRoutes } from "./handleRoutes";

const server = createServer(async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  const { status, message } = await handleRoutes(req);

  res.writeHead(status);
  res.end(message);
});
const startServer = (PORT: string) => {
  server.listen(PORT);
  console.log(`Server started on http://localhost:${PORT}`);
};

export { startServer, server };
