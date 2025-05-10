import { server as app } from "../../server/server";
import request from "supertest";
import { STATUS_CODES } from "../../constants/statusCodes";
import { BASE_URL } from "../../constants/baseUrl";
import { SERVER_MESSAGES } from "../../constants/serverMessages";
import { v4 as uuid } from "uuid";

let userId = "";
const fakeUser = {
  username: "John",
  age: 30,
  hobbies: ["Cooking", "Singing"],
};
const updatedUser = {
  username: "Jane",
  age: 29,
  hobbies: ["Cooking", "Singing", "Dancing"],
};
Object.freeze(fakeUser);

const res = request(app);

describe("Scenario1: basic CRUD api test", () => {
  it("should return users", async () => {
    const result = await res.get(BASE_URL);
    expect(result.status).toBe(STATUS_CODES.OK);
    expect(result.body).toBeInstanceOf(Array);
  });
  it("should create user", async () => {
    const result = await res.post(BASE_URL).send(fakeUser);
    userId = result.body.id;
    expect(result.status).toBe(STATUS_CODES.CREATED);
    expect(result.body).toEqual({ ...fakeUser, id: userId });
  });
  it("should get user", async () => {
    const result = await res.get(`${BASE_URL}/${userId}`);
    expect(result.status).toBe(STATUS_CODES.OK);
    expect(result.body).toEqual({ ...fakeUser, id: userId });
  });
  it("should update user", async () => {
    const result = await res.put(`${BASE_URL}/${userId}`).send(updatedUser);
    expect(result.status).toBe(STATUS_CODES.OK);
    expect(result.body).toEqual({ ...updatedUser, id: userId });
  });
  it("should delete user", async () => {
    const result = await res.delete(`${BASE_URL}/${userId}`);
    expect(result.status).toBe(STATUS_CODES.NO_CONTENT);
    const result2 = await res.get(`${BASE_URL}/${userId}`);
    expect(result2.status).toBe(STATUS_CODES.NOT_FOUND);
    expect(result2.body).toEqual({
      message: SERVER_MESSAGES.USER_NOT_FOUND(userId),
    });
  });
});

describe("Scenario2: invalid api test", () => {
  it("should return error if user id is not valid with get user", async () => {
    const result = await res.get(`${BASE_URL}/123`);
    expect(result.status).toBe(STATUS_CODES.BAD_REQUEST);
    expect(result.body).toEqual({ message: SERVER_MESSAGES.NOT_UID });
  });

  it("should return error if user id is not valid with delete user", async () => {
    const result = await res.delete(`${BASE_URL}/123`);
    expect(result.status).toBe(STATUS_CODES.BAD_REQUEST);
    expect(result.body).toEqual({ message: SERVER_MESSAGES.NOT_UID });
  });

  it("should return error if user id is not valid with update user", async () => {
    const result = await res.put(`${BASE_URL}/123`).send(updatedUser);
    expect(result.status).toBe(STATUS_CODES.BAD_REQUEST);
    expect(result.body).toEqual({ message: SERVER_MESSAGES.NOT_UID });
  });

  it("should return error if endpoint not found", async () => {
    const result = await res.get("/123");
    expect(result.status).toBe(STATUS_CODES.NOT_FOUND);
    expect(result.body).toEqual({
      message: SERVER_MESSAGES.ENDPOINT_NOT_FOUND,
    });
  });
});

describe("Scenario3: not found api test", () => {
  userId = uuid();
  it("should return status 404 and corresponding message if user id is not found with get user", async () => {
    const result = await res.get(`${BASE_URL}/${userId}`);
    expect(result.status).toBe(STATUS_CODES.NOT_FOUND);
    expect(result.body).toEqual({
      message: SERVER_MESSAGES.USER_NOT_FOUND(userId),
    });
  });

  it("should return status 404 and corresponding message if user id is not found with delete user", async () => {
    const result = await res.delete(`${BASE_URL}/${userId}`);
    expect(result.status).toBe(STATUS_CODES.NOT_FOUND);
    expect(result.body).toEqual({
      message: SERVER_MESSAGES.USER_NOT_FOUND(userId),
    });
  });

  it("should return status 404 and corresponding message if user id is not found with update user", async () => {
    const result = await res.put(`${BASE_URL}/${userId}`).send(updatedUser);
    expect(result.status).toBe(STATUS_CODES.NOT_FOUND);
    expect(result.body).toEqual({
      message: SERVER_MESSAGES.USER_NOT_FOUND(userId),
    });
  });
});

describe("Scenario4: bad request api test", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const testRequest = async (body: any) => {
    let result = await res.post(BASE_URL).send(body);
    expect(result.status).toBe(STATUS_CODES.BAD_REQUEST);
    expect(result.body).toEqual({ message: SERVER_MESSAGES.BAD_REQUEST_BODY });
    result = await res.put(`${BASE_URL}/${userId}`).send(body);
    expect(result.status).toBe(STATUS_CODES.BAD_REQUEST);
    expect(result.body).toEqual({ message: SERVER_MESSAGES.BAD_REQUEST_BODY });
  };

  it("should create user", async () => {
    const result = await res.post(BASE_URL).send(fakeUser);
    userId = result.body.id;
    expect(result.status).toBe(STATUS_CODES.CREATED);
    expect(result.body).toEqual({ ...fakeUser, id: userId });
  });

  it("should return status 400 and corresponding message if body is empty object", async () => {
    await testRequest({});
  });
  it("should return status 400 and corresponding message if body is not object", async () => {
    await testRequest("string");
    await testRequest([]);
  });

  it("should return status 400 and corresponding message if body does not contain required fields", async () => {
    await testRequest({ username: "John", age: 30 });
    await testRequest({ username: "John", hobbies: ["swimming", "reading"] });
    await testRequest({ age: 30, hobbies: ["swimming", "reading"] });
  });

  it("should return status 400 and corresponding message if body contains wrong data type", async () => {
    await testRequest({
      username: 11,
      age: 30,
      hobbies: ["swimming", "reading"],
    });
    await testRequest({
      username: "John",
      age: "30",
      hobbies: ["swimming", "reading"],
    });
    await testRequest({
      username: "John",
      age: 30,
      hobbies: "swimming",
    });
    await testRequest({
      username: "John",
      age: [30],
      hobbies: ["swimming", "reading"],
    });
    await testRequest({
      username: "John",
      age: 30,
      hobbies: {},
    });
  });
});
