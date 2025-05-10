import { STATUS_CODES, SERVER_MESSAGES } from "../constants";
import { validateUser } from "./utils";
import { DB } from "../db/db";
import { NewUser } from "../types/types";
import { BAD_REQUEST_BODY } from "../errors/errors";

const db = new DB();

const getUsers = () => {
  const status = STATUS_CODES.OK;
  const allUsers = db.getAllUsers();
  const message = JSON.stringify(allUsers);
  return { status, message };
};

const getUser = (uid: string) => {
  const user = db.getUser(uid);
  const status = user ? STATUS_CODES.OK : STATUS_CODES.NOT_FOUND;
  const message = user
    ? JSON.stringify(user)
    : JSON.stringify({ message: SERVER_MESSAGES.USER_NOT_FOUND(uid) });
  return { status, message };
};

const createUser = (body: NewUser) => {
  if (!validateUser(body)) {
    throw new BAD_REQUEST_BODY();
  }
  const user = db.addUser(body);
  const status = STATUS_CODES.CREATED;
  const message = JSON.stringify(user);

  return { status, message };
};

const changeUser = (uid: string, body: NewUser) => {
  let status = STATUS_CODES.CREATED;
  let message = "";
  if (!validateUser(body)) {
    throw new BAD_REQUEST_BODY();
  }
  const user = db.changeUser(uid, body);
  status = user ? STATUS_CODES.OK : STATUS_CODES.NOT_FOUND;
  message = user
    ? JSON.stringify(user)
    : JSON.stringify({ message: SERVER_MESSAGES.USER_NOT_FOUND(uid) });

  return { status, message };
};

const deleteUser = (uid: string) => {
  const res = db.deleteUser(uid);
  const status = res ? STATUS_CODES.NO_CONTENT : STATUS_CODES.NOT_FOUND;
  const message =
    status === STATUS_CODES.NO_CONTENT
      ? ""
      : JSON.stringify({ message: SERVER_MESSAGES.USER_NOT_FOUND(uid) });
  return { status, message };
};

export { getUsers, getUser, createUser, changeUser, deleteUser };
