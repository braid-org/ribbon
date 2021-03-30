import { send, error } from "../src/utils";
import { getMockRes } from "@jest-mock/express";

test("send", async () => {
  const { res } = getMockRes();
  send(res, []);
  expect(res.statusCode).toEqual(200);
  expect(res.end).toHaveBeenCalledWith("[]");
});

test("error", async () => {
  const { res } = getMockRes();
  error(res, "bad");
  expect(res.statusCode).toEqual(400);
  expect(res.end).toHaveBeenCalledWith('{\n  "error": "bad"\n}');
});
