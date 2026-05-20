const io = require("socket.io-client");

const URL = process.env.SOCKET_URL || "http://localhost:3000";
const [, , tokenA, userIdA, tokenB, userIdB] = process.argv;

if (!tokenA || !userIdA || !tokenB || !userIdB) {
  console.error("用法：node scripts/test-chat.js <tokenA> <userIdA> <tokenB> <userIdB>");
  console.error("提示：先 curl POST /login 拿 token，再 curl GET /users/me 拿 userId");
  process.exit(1);
}

const connect = (token) =>
  new Promise((resolve, reject) => {
    const s = io(URL, { auth: { token }, reconnection: false, timeout: 3000 });
    s.on("connect", () => resolve(s));
    s.on("connect_error", reject);
  });

const sendMessage = (socket, payload) =>
  new Promise((resolve) => {
    socket.emit("sendMessage", payload, resolve);
  });

const waitFor = (socket, event, timeout = 3000) =>
  new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("timeout")), timeout);
    socket.once(event, (data) => {
      clearTimeout(timer);
      resolve(data);
    });
  });

(async () => {
  console.log(`連線 A (${userIdA.slice(-6)}) 與 B (${userIdB.slice(-6)})...`);
  const [socketA, socketB] = await Promise.all([connect(tokenA), connect(tokenB)]);
  console.log(`A: ${socketA.id} · B: ${socketB.id}\n`);

  let pass = 0;
  const total = 3;

  console.log("Case 1: 缺 recipientId → ack 應 fail");
  let r = await sendMessage(socketA, { content: "hi" });
  if (!r.success) {
    console.log(`  ✅ PASS  ack: ${r.message}`);
    pass++;
  } else console.log(`  ❌ FAIL  不該成功`);

  console.log("\nCase 2: 傳給自己 → ack 應 fail");
  r = await sendMessage(socketA, { recipientId: userIdA, content: "self" });
  if (!r.success) {
    console.log(`  ✅ PASS  ack: ${r.message}`);
    pass++;
  } else console.log(`  ❌ FAIL  不該成功`);

  console.log("\nCase 3: A → B 正常傳訊息");
  const content = `來自 A 的 hello ${Date.now()}`;
  const waitB = waitFor(socketB, "receiveMessage");  
  r = await sendMessage(socketA, { recipientId: userIdB, content });

  if (r.success && r.data.content === content) {
    console.log(`  ✅ PASS  A 收到 ack with data`);
  } else {
    console.log(`  ❌ FAIL  ack:`, r);
  }

  try {
    const received = await waitB;
    if (received.content === content) {
      console.log(`  ✅ PASS  B 收到「${received.content}」`);
      pass++;
    } else {
      console.log(`  ❌ FAIL  B 收到的內容對不上:`, received);
    }
  } catch (err) {
    console.log(`  ❌ FAIL  B 沒收到 (${err.message})`);
  }

  console.log(`\n──── 總計 ${pass}/${total} 通過 ────`);

  socketA.close();
  socketB.close();
  process.exit(pass === total ? 0 : 1);
})();
