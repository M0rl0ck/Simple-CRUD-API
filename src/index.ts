import { STATUS_CODE } from "./constants/errors";

for (let i = 0; i < 10; i++) {
  console.log(i);
}
console.log("Hi node.");
console.log(JSON.stringify(STATUS_CODE.OK));
