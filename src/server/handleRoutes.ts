import type { IncomingMessage } from "http";
import { STATUS_CODES, BASE_URL, SERVER_MESSAGES } from "../constants";

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
      } catch (error) {
        console.log(error);
        throw new Error();
      }

      if (endpointLength === 2) {
        switch (req.method) {
          case METHODS.GET: {
            status = STATUS_CODES.OK;
            message = "all users";
            break;
          }
          case METHODS.POST: {
            status = STATUS_CODES.CREATED;
            message = JSON.stringify(body);
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
            status = STATUS_CODES.OK;
            message = `user ${uid}`;
            break;
          }

          case METHODS.PUT: {
            status = STATUS_CODES.OK;
            message = JSON.stringify(body);

            break;
          }
          case METHODS.DELETE: {
            status = STATUS_CODES.NO_CONTENT;
            message = "user deleted";
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
    console.log(error);
  }

  return {
    status,
    message,
  };
};

export { handleRoutes };
