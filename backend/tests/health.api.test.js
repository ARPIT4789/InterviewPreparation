import { describe, it, expect } from "vitest";

const BASE_URL = "http://localhost:5000";

describe("Health API", () => {
  it("should return a successful health response", async () => {
    const response = await fetch(`${BASE_URL}/api/health`);

    expect(response.status).toBe(200);

    const data = await response.json();

    expect(data.success).toBe(true);
    expect(data.message).toBe("Trao Interview Prep API is running");
  });
});