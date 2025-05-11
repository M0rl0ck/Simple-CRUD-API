import type { NewUser, IDB, IUser } from "../types/types";

class WorkerDB implements IDB {
  async getAllUsers() {
    const result = new Promise<IUser[]>((resolve) => {
      if (!process.send) {
        throw new Error("Worker must be spawned with 'node' command");
      }
      process.send({ cmd: "getAllUsers" });
      process.once("message", (data: { data: IUser[] }) => {
        const { data: users } = data;
        if (users) {
          resolve(users);
        }
      });
    });
    return result;
  }
  async getUser(id: string) {
    const result = new Promise<IUser | undefined>((resolve) => {
      if (!process.send) {
        throw new Error("Worker must be spawned with 'node' command");
      }
      process.send({ cmd: "getUser", props: [id] });
      process.once("message", (data: { data: IUser | undefined }) => {
        const { data: user } = data;
        resolve(user);
      });
    });

    return result;
  }

  async addUser(newUser: NewUser) {
    const addedUser = new Promise<IUser>((resolve) => {
      if (!process.send) {
        throw new Error("Worker must be spawned with 'node' command");
      }
      process.send({ cmd: "addUser", props: [newUser] });
      process.once("message", (data: { data: IUser }) => {
        const { data: user } = data;
        resolve(user);
      });
    });
    return addedUser;
  }

  async changeUser(id: string, changes: NewUser) {
    const user = new Promise<IUser | false>((res) => {
      if (!process.send) {
        throw new Error("Worker must be spawned with 'node' command");
      }
      process.send({ cmd: "changeUser", props: [id, changes] });
      process.once("message", (data: { data: IUser | false }) => {
        const { data: user } = data;
        res(user);
      });
    });

    return user;
  }

  async deleteUser(id: string) {
    const res = new Promise<boolean>((resolve) => {
      if (!process.send) {
        throw new Error("Worker must be spawned with 'node' command");
      }
      process.send({ cmd: "deleteUser", props: [id] });
      process.once("message", (data: { data: boolean }) => {
        const { data: res } = data;
        resolve(res);
      });
    });
    return res;
  }
}

export { WorkerDB };
