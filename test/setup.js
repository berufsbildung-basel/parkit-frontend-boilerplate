import { afterAll, beforeAll, expect } from "vitest";
import { setupMockServer } from "../mock/server.js";
import matchers from "@testing-library/jest-dom/matchers";
import { cleanup } from "@testing-library/react";

let server;

expect.extend(matchers);

beforeAll(() => {
  server = setupMockServer();
});

afterAll(() => {
  server.close();
  cleanup();
});
