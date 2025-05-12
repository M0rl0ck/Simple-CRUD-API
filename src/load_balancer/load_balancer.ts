// import { DB } from "../db/db";
import { IDB } from "../types/types";
import cluster, { Worker } from "cluster";
import http, { createServer } from "http";

const startLoadBalancer = (cpus: number, PORT: number) => {
  const workers: { worker: Worker; PORT: number }[] = [];

  const worker_db = cluster.fork({ DB: true });

  for (let i = 0; i < cpus; i++) {
    const WORKER_PORT = PORT + i + 1;
    const worker = cluster.fork({ WORKER_PORT: WORKER_PORT });
    let workerNote = { worker, PORT: WORKER_PORT };
    workers.push(workerNote);
    worker.on("exit", () => {
      const newWorker = cluster.fork({ WORKER_PORT: WORKER_PORT });
      const newWorkerNote = { worker: newWorker, PORT: WORKER_PORT };
      workers[workers.indexOf(workerNote)] = newWorkerNote;
      workerNote = newWorkerNote;
    });
    worker.on("message", (message: { cmd: keyof IDB; props: unknown[] }) => {
      worker_db.send(message);
      worker_db.once("message", (data) => {
        worker.send(data);
      });
    });
  }

  let counter = 0;

  createServer(async (req, res) => {
    const worker = workers[counter];
    counter = (counter + 1) % workers.length;

    req.pipe(
      http.request(
        {
          port: worker.PORT,
          path: req.url,
          method: req.method,
          headers: req.headers,
        },
        (response) => {
          const status = response.statusCode || 200;
          res.writeHead(status, response.headers);
          response.pipe(res);
        },
      ),
    );

    res.setHeader("Content-Type", "application/json");
  }).listen(PORT);
};

export { startLoadBalancer };
