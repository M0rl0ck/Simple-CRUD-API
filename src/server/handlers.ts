import { STATUS_CODES, SERVER_MESSAGES } from "../constants";
import { validateUser } from "./utils";
import cluster from "cluster";
import { IDB } from "../types/types";
import { DB, WorkerDB } from "../db";
import { NewUser } from "../types/types";
import { BAD_REQUEST_BODY } from "../errors/errors";

let db: IDB;
if (process.env.MULTI_MODE === "true" && cluster.isWorker) {
  db = new WorkerDB();
} else {
  db = new DB();
}

const getUsers = async () => {
  const status = STATUS_CODES.OK;
  const allUsers = await db.getAllUsers();
  const message = JSON.stringify(allUsers);
  return { status, message };
};

const getUser = async (uid: string) => {
  const user = await db.getUser(uid);
  const status = user ? STATUS_CODES.OK : STATUS_CODES.NOT_FOUND;
  const message = user
    ? JSON.stringify(user)
    : JSON.stringify({ message: SERVER_MESSAGES.USER_NOT_FOUND(uid) });
  return { status, message };
};

const createUser = async (body: NewUser) => {
  if (!validateUser(body)) {
    throw new BAD_REQUEST_BODY();
  }
  const user = await db.addUser(body);
  const status = STATUS_CODES.CREATED;
  const message = JSON.stringify(user);

  return { status, message };
};

const changeUser = async (uid: string, body: NewUser) => {
  let status = STATUS_CODES.CREATED;
  let message = "";
  if (!validateUser(body)) {
    throw new BAD_REQUEST_BODY();
  }
  const user = await db.changeUser(uid, body);
  status = user ? STATUS_CODES.OK : STATUS_CODES.NOT_FOUND;
  message = user
    ? JSON.stringify(user)
    : JSON.stringify({ message: SERVER_MESSAGES.USER_NOT_FOUND(uid) });

  return { status, message };
};

const deleteUser = async (uid: string) => {
  const res = await db.deleteUser(uid);
  const status = res ? STATUS_CODES.NO_CONTENT : STATUS_CODES.NOT_FOUND;
  const message =
    status === STATUS_CODES.NO_CONTENT
      ? ""
      : JSON.stringify({ message: SERVER_MESSAGES.USER_NOT_FOUND(uid) });
  return { status, message };
};

export { getUsers, getUser, createUser, changeUser, deleteUser };
