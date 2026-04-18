import { describe, expect, test } from "bun:test";

describe("server scaffold", () => {
  test("documents the service name", () => {
    expect("litnest-api").toBe("litnest-api");
  });
});
