import request from "supertest";
import app from "../app.js"; // Якщо app експортовано
import { sequelize } from "../db/sequelize.js";

describe("GET /api/testimonials", () => {
  beforeAll(async () => {
    await sequelize.authenticate();
  });

  it("should return list of testimonials", async () => {
    const res = await request(app).get("/api/testimonials");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
