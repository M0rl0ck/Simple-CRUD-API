interface NewUser {
  username: string;
  age: number;
  hobbies: string[];
}
interface IUser extends NewUser {
  id: string;
}

interface IDB {
  getAllUsers: () => IUser[];
  getUser: (id: string) => IUser | undefined;
  addUser: (newUser: NewUser) => IUser;
  changeUser: (id: string, changes: NewUser) => IUser | false;
  deleteUser: (id: string) => boolean;
}

export { IUser, NewUser, IDB };
