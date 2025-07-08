import { login } from "../controllers/authControllers.js";
import { User } from "../models/User.js";
import httpMocks from "node-mocks-http";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { jest } from '@jest/globals';

jest.mock("../models/User.js");

describe("Login Controller", () => {
  it("should return 200, token and user object with email and subscription", async () => {
    const mockUser = {
      id: 1,
      email: "test@example.com",
      password: await bcrypt.hash("password123", 10),
      subscription: "starter",
      save: jest.fn(),
    };

    User.findOne = jest.fn().mockResolvedValue(mockUser);

    const req = httpMocks.createRequest({
      method: "POST",
      body: {
        email: "test@example.com",
        password: "password123",
      },
    });

    const res = httpMocks.createResponse();
    const next = jest.fn();

    await login(req, res, next);

    const data = res._getJSONData();

    expect(res.statusCode).toBe(200);
    expect(data.token).toBeDefined();
    expect(typeof data.token).toBe("string");

    expect(data.user).toBeDefined();
    expect(typeof data.user.email).toBe("string");
    expect(typeof data.user.subscription).toBe("string");
  });
});
