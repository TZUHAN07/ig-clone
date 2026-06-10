require("../setup");
const request = require("supertest");
const app = require("../../app");

describe("POST /register", () => {
  test("註冊成功 → 回 201 + success: true", async () => {
    const userData = {
      username: "alice",
      email: "alice@test.com",
      password: "Aa12345678",
    };

    const res = await request(app).post("/register").send(userData);

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBeDefined();
  });

  // === Case 2: 缺欄位（你寫，提示在下面）===
  test("缺欄位 → 回 400 + success: false", async () => {
    const userData = {
      username: "alice",
    };
    const res = await request(app).post("/register").send(userData);

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBeDefined();
  });

  // === Case 3: 重複 email（你寫，提示在下面）===
  test("重複 email → 回 400", async () => {
    const user1Data = {
      username: "alice",
      email: "alice@test.com",
      password: "Aa12345678",
    };
    await request(app).post("/register").send(user1Data);
    const user2Data = {
      username: "bob",
      email: "alice@test.com",
      password: "Bb12345678",
    };
    const res = await request(app).post("/register").send(user2Data);

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain("電子郵件");
  });
});
