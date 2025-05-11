import { startServer } from "./server";
import { argv, env } from "node:process";
import { availableParallelism } from "node:os";
import cluster from "cluster";
import { startLoadBalancer } from "./load_balancer/load_balancer";
import "dotenv/config";

const PORT = env ? Number(process.env.PORT) : 3000;

const cpus = availableParallelism();

const args = argv.slice(2);

if (args.includes("-multi") && cpus > 2) {
  process.env.MULTI_MODE = "true";

  if (cluster.isPrimary) {
    startLoadBalancer(cpus, PORT);
  } else {
    startServer(Number(process.env.WORKER_PORT));
  }
} else {
  startServer(PORT);
}
