import { STATUS_CODES, SERVER_MESSAGES } from "../constants";
import { BAD_REQUEST_BODY, NOT_UID } from "../errors/errors";
import { NewUser } from "../types/types";
import { validate as uuidValidate } from "uuid";

const validateUser = (user: NewUser) => {
  const { username, age, hobbies } = user;
  if (
    username &&
    typeof username === "string" &&
    age &&
    typeof age === "number" &&
    hobbies &&
    Array.isArray(hobbies)
  ) {
    return true;
  }
  return false;
};

const validateUid = (uid: string) => {
  if (!uuidValidate(uid)) {
    throw new NOT_UID();
  }
};

const handleError = (error: unknown) => {
  let status = STATUS_CODES.CREATED;
  let message = "";
  if (error instanceof NOT_UID) {
    status = STATUS_CODES.BAD_REQUEST;
    message = JSON.stringify({ message: SERVER_MESSAGES.NOT_UID });
  } else if (error instanceof BAD_REQUEST_BODY) {
    status = STATUS_CODES.BAD_REQUEST;
    message = JSON.stringify({ message: SERVER_MESSAGES.BAD_REQUEST_BODY });
  } else {
    status = STATUS_CODES.INTERNAL_SERVER_ERROR;
    message = JSON.stringify({
      message: SERVER_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
  return { status, message };
};

export { validateUser, handleError, validateUid };
