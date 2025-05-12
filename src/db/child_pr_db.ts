import { IDB } from "../types/types";
import { DB } from "./";

const db = new DB();

console.log("Created BD on child process");

process.on("message", (message: { cmd: keyof IDB; props: unknown[] }) => {
  if (message.cmd in db) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    db[message.cmd](...(message.props ? message.props : [])).then((result) => {
      if (!process.send) {
        throw new Error("Worker must be spawned with 'node' command");
      }
      process.send({ data: result });
    });
  }
});
