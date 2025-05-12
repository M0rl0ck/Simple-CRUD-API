import type { IncomingMessage } from "http";
import { BAD_REQUEST_BODY } from "../errors/errors";
import { STATUS_CODES, BASE_URL, SERVER_MESSAGES } from "../constants";
import { validateUid } from "./utils";
import {
  changeUser,
  createUser,
  deleteUser,
  getUser,
  getUsers,
} from "./handlers";
import { handleError } from "./utils";

const METHODS = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
};

type Status = (typeof STATUS_CODES)[keyof typeof STATUS_CODES];

const handleRoutes = async (req: IncomingMessage) => {
  let status: Status = STATUS_CODES.OK;
  let message = "";

  const endpointParts = req.url?.split("/").filter(Boolean);
  const endpointLength = endpointParts?.length;

  try {
    if (
      req.url?.startsWith(BASE_URL) &&
      endpointLength &&
      endpointLength <= 3
    ) {
      const buffer = [];
      for await (const chunk of req) {
        buffer.push(chunk);
      }

      let body;
      try {
        body = buffer.length
          ? JSON.parse(Buffer.concat(buffer).toString())
          : {};
      } catch {
        throw new BAD_REQUEST_BODY();
      }

      if (endpointLength === 2) {
        switch (req.method) {
          case METHODS.GET: {
            ({ status, message } = await getUsers());
            break;
          }
          case METHODS.POST: {
            ({ status, message } = await createUser(body));
            break;
          }
          default: {
            status = STATUS_CODES.BAD_REQUEST;
            message = SERVER_MESSAGES.BAD_REQUEST;
          }
        }
      }

      if (endpointLength === 3) {
        const [, , uid] = endpointParts;

        switch (req.method) {
          case METHODS.GET: {
            validateUid(uid);
            ({ status, message } = await getUser(uid));
            break;
          }

          case METHODS.PUT: {
            validateUid(uid);
            ({ status, message } = await changeUser(uid, body));

            break;
          }
          case METHODS.DELETE: {
            validateUid(uid);
            ({ status, message } = await deleteUser(uid));
            break;
          }
          default: {
            status = STATUS_CODES.NOT_FOUND;
            message = JSON.stringify({ message: SERVER_MESSAGES.BAD_REQUEST });
          }
        }
      }
    } else {
      status = STATUS_CODES.NOT_FOUND;
      message = JSON.stringify({ message: SERVER_MESSAGES.ENDPOINT_NOT_FOUND });
    }
  } catch (error) {
    ({ status, message } = handleError(error));
  }

  return {
    status,
    message,
  };
};

export { handleRoutes };
