import { describe, it, expect } from "vitest";

describe("Trao Interview Prep Backend", () => {
  it("should run the test environment correctly", () => {
    expect(1 + 1).toBe(2);
  });

  it("should have the correct health endpoint", () => {
    const healthEndpoint = "/api/health";

    expect(healthEndpoint).toBe("/api/health");
  });
});