import { v4 as uuid } from "uuid";
import type { IUser, NewUser, IDB } from "../types/types";

class DB implements IDB {
  private users: IUser[];
  constructor() {
    this.users = [];
  }

  private findUser(id: string) {
    return this.users.findIndex((user) => user.id === id);
  }

  async getAllUsers() {
    return this.users;
  }
  async getUser(id: string) {
    return this.users.find((user) => user.id === id);
  }

  async addUser(newUser: NewUser) {
    const { username, age, hobbies } = newUser;
    const user = {
      username,
      age,
      hobbies,
      id: uuid(),
    };
    this.users.push(user);
    return user;
  }

  async changeUser(id: string, changes: NewUser) {
    const index = this.findUser(id);
    if (index === -1) {
      return false;
    }
    this.users[index] = { ...this.users[index], ...changes };
    return this.users[index];
  }

  async deleteUser(id: string) {
    if (!this.getUser(id)) {
      return false;
    }
    this.users = this.users.filter((user) => user.id !== id);
    return true;
  }
}

export { DB };
export default DB;
