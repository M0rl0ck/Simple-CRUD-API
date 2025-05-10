class NOT_UID extends Error {
  constructor() {
    super("NOT_UID");
    this.name = "NOT_UID";
  }
}

class NOT_FOUND extends Error {
  constructor() {
    super("NOT_FOUND");
    this.name = "NOT_FOUND";
  }
}

class BAD_REQUEST_BODY extends Error {
  constructor() {
    super("BAD_REQUEST_BODY");
    this.name = "BAD_REQUEST_BODY";
  }
}

export { NOT_UID, NOT_FOUND, BAD_REQUEST_BODY };
