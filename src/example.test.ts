import { describe, expect, it } from "vitest";
import { setDevMode } from "../test/setup";

describe("example", () => {
  it("should pass", () => {
    expect(1 + 1).toBe(2);
  });

  it("defaults __DEV__ to true and supports setDevMode", () => {
    expect(__DEV__).toBe(true);
    setDevMode(false);
    expect(__DEV__).toBe(false);
  });
});
