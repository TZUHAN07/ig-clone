const io = require("socket.io-client");

const URL = process.env.SOCKET_URL || "http://localhost:3000";
const validToken = process.argv[2];

if (!validToken) {
  console.error("❌ 用法：node scripts/test-socket.js <JWT_TOKEN>");
  console.error("   先 curl POST /login 拿 token 再丟進來");
  process.exit(1);
}

const tests = [
  {
    name: "Case 1：正確 token 應該連上",
    auth: { token: validToken },
    expectConnect: true,
  },
  {
    name: "Case 2：沒帶 token 應該被拒",
    auth: {},
    expectConnect: false,
  },
  {
    name: "Case 3：錯誤 token 應該被拒",
    auth: { token: "fake.token.here" },
    expectConnect: false,
  },
];

const runTest = (test) =>
  new Promise((resolve) => {
    const socket = io(URL, {
      auth: test.auth,
      reconnection: false, 
      timeout: 3000,
    });

    let settled = false;
    const finish = (passed, reason) => {
      if (settled) return;
      settled = true;
      socket.close();
      resolve({ name: test.name, passed, reason });
    };

    socket.on("connect", () =>
      finish(
        test.expectConnect,
        test.expectConnect
          ? `連上成功（socket.id=${socket.id}）`
          : "預期被拒卻連上了",
      ),
    );
    socket.on("connect_error", (err) =>
      finish(!test.expectConnect, `被拒：${err.message}`),
    );

    setTimeout(() => finish(false, "timeout（3.5 秒沒回應）"), 3500);
  });

(async () => {
  console.log(`連線目標：${URL}\n`);
  let passCount = 0;
  for (const t of tests) {
    const r = await runTest(t);
    console.log(`${r.passed ? "✅ PASS" : "❌ FAIL"}  ${r.name}`);
    console.log(`         └ ${r.reason}\n`);
    if (r.passed) passCount++;
  }
  console.log(`──── 總計：${passCount}/${tests.length} 通過 ────`);
  process.exit(passCount === tests.length ? 0 : 1);
})();
