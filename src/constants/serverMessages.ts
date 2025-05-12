const SERVER_MESSAGES = {
  USER_NOT_FOUND: (id: string) => `User id=${id} not found`,
  BAD_REQUEST: "Bad request",
  ENDPOINT_NOT_FOUND: "Endpoint not found",
  NOT_UID: "UserId is not valid",
  INTERNAL_SERVER_ERROR: "Internal server error",
  BAD_REQUEST_BODY:
    "Request body does not contain required fields or is invalid",
};

export { SERVER_MESSAGES };
