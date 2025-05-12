interface NewUser {
  username: string;
  age: number;
  hobbies: string[];
}
interface IUser extends NewUser {
  id: string;
}

interface IDB {
  getAllUsers: () => Promise<IUser[]>;
  getUser: (id: string) => Promise<IUser | undefined>;
  addUser: (newUser: NewUser) => Promise<IUser>;
  changeUser: (id: string, changes: NewUser) => Promise<IUser | false>;
  deleteUser: (id: string) => Promise<boolean>;
}

export type { IUser, NewUser, IDB };
