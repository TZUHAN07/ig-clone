# IG Clone

> 全端 IG 仿作 — Socket.io 即時聊天 + S3 多圖上傳 + Docker 部署

🌐 **Live Demo**：Coming soon（Zeabur 部署中） | [🎯 Technical Highlights](#-technical-highlights)

## 📸 Demo

> EC2 部署 in progress，預計 2026/6/X 上線。先看截圖：

<!-- TODO: 補 4-6 張截圖：登入、首頁、發文、聊天室、profile、explore -->
<!-- 建議：用 GIF 錄 1. 發文 2. 聊天 即時雙裝置 3. 追蹤 三個操作流程 -->

| 首頁 | 聊天室 | Profile |
|---|---|---|
| (screenshot) | (screenshot) | (screenshot) |

## ✨ Features

- 📷 **多圖貼文上傳** — schema 支援 1-10 張（前端 UI 多圖選擇 in progress）
- 💬 **即時聊天室** — Socket.io + ack callback + 多裝置同步
- 🔍 **即時搜尋** — debounce + Mongoose regex
- ❤️ **追蹤 / 按讚 / 留言**
- 🔐 **JWT auth** + io.use socket 握手驗證
- 📱 **響應式 RWD** — mobile chat 切 view 模式（state class + CSS :has()）
- 🖼 **AWS S3 圖片儲存** + Sharp 自動 resize

## 🛠 Tech Stack

**Backend**
- Node.js / Express
- MongoDB / Mongoose
- Socket.io（即時通訊）
- JWT（auth）
- Multer + Sharp（圖片處理）
- AWS S3（圖片儲存）

**Frontend**
- 純 JavaScript（無 framework）
- HTML5 / CSS3 / CSS variable design system
- 響應式 RWD（含 mobile 切 view）

**DevOps**
- Docker / Docker Compose
- nginx（靜態檔伺服）
- nodemon（dev hot reload）

## 🚀 Quick Start

需求：Docker Desktop + Docker Compose

```bash
# 1. clone repo
git clone https://github.com/tzuhan1007/ig-clone.git
cd ig-clone

# 2. 設定環境變數
cp backend/.env.example backend/.env
# 編輯 backend/.env，填入：
#   MONGO_URI=mongodb://...
#   JWT_SECRET=your-secret
#   AWS_ACCESS_KEY_ID=...
#   AWS_SECRET_ACCESS_KEY=...
#   AWS_BUCKET_NAME=...

# 3. 啟動所有服務（backend + frontend + mongo）
docker compose up --build -d

# 4. 開瀏覽器
open http://localhost
```

服務 port：
- Frontend: `localhost:80`（nginx serve）
- Backend: `localhost:3000`
- MongoDB: container 內部，host 不對外開

## 🎯 Technical Highlights

### 1. Mobile RWD：state class 切 view 模式 + CSS :has() 偽類

mobile chat 桌面兩欄 layout（list 350px + message-area）在 375px 螢幕擠不下。改成 **IG 切 view 模式**：預設只看對話列表，點對話切到訊息畫面、加返回按鈕。

實作核心：**state class pattern** — JS 只切換 `.show-message` class、CSS 處理顯示：

```css
@media (max-width: 768px) {
  .message-area { display: none; }
  .chat-container.show-message .conversation-list { display: none; }
  .chat-container.show-message .message-area { display: flex; }
}
```

```js
const selectConversation = (user) => {
  chatContainerEl.classList.add('show-message');
};
```

**為什麼用 class 而非 JS 改 style**：CSS 一處管所有狀態、跟 JS 解耦、responsive 用 media query 自動處理桌面 / mobile 差異。React / Vue 都這套 state-driven UI 思路。

順帶用 **CSS4 `:has()` 偽類**（第一個 CSS 父選擇器）解決「body padding-top 只在有 mobile top nav 的頁面套用」：

```css
body:has(.mobile-top-nav) { padding-top: 50px; }
```

過去這事必須靠 JS 加 class，現在純 CSS 一條搞定。

**個人感想**：當初寫 mobile RWD 直覺是 JS 改 style，但發現桌面 / mobile 邏輯混在一起難維護。改成 state class 後 CSS 一處管所有狀態、邏輯跟外觀分離，瞬間懂了為什麼 React 強調 state-driven UI。`:has()` 是寫到一半發現 body padding-top 在 chat 頁變多餘留白才查到的 CSS4 新特性，正好替代過去要靠 JS 加 class 的繞路寫法。

### 2. Schema 改動的 3 個踩雷：沒 API contract 的代價

純 JS 雙端開發沒有靜態檢查，後端 schema 改了 → 前端必須**人工同步**，沒改就「**靜默壞掉**」（瀏覽器不報錯、畫面悄悄壞）。我踩過 3 個經典：

1. **`post.image` → `post.media[0].url`** — schema 改成多圖陣列後，前端 5 個地方還用舊欄位 → `<img src="undefined">` → home / explore 整頁圖片消失。
2. **Mongoose schema `trim: true`** — 把使用者留言開頭 / 結尾的 `\n` 自動吃掉，使用者的排版意圖被破壞。**修法**：移除 schema trim、純空白檢查交給 controller 用 `trim() === ""` 判斷但不修改 content 本身。
3. **Multer field name mismatch** — frontend 送 `formData.append("image", ...)`，但 backend 改成 `upload.array("media", 10)` → multer throw `LIMIT_UNEXPECTED_FILE` → 整個 500。

共通 root cause：**缺乏 API contract**。下個專案會引入 TypeScript 共用 types 或 OpenAPI spec 強制雙端 schema 對齊。

**個人感想**：3 個 bug 全是「改後端忘了同步前端」的同一類錯誤。教訓是 — **改 schema 第一件事是 grep 舊欄位名**，全 codebase 確認都改完才算完。長期解法是引入 TypeScript 共用 types 或 OpenAPI spec，讓編譯期 / API contract 自動抓不一致。這次踩完雷反而讓我更想學 TypeScript。

### 3. Socket.io 即時聊天：room + ack callback + 多裝置同步

訊息流：

```
A 送訊息 → socket.emit("sendMessage", payload, ack)
        → backend save to DB
        → io.to(B).emit + io.to(A).emit（雙推給 sender 跟 recipient）
        → A 跟 B 兩端 receiveMessage 觸發 UI 更新
        → backend 呼叫 ack callback → A 清空 input
```

**3 個核心設計**：

- **Room 用 `user._id` 當名稱**：使用者連線時 `socket.join(userId.toString())`，訊息推給 room 而非 socket → 同一個使用者多連線都收到。
- **Ack callback**：`socket.emit` 第三個參數是 callback，server 處理完 invoke → client 才清空 input。**避免送出後立刻清空但實際 server fail 訊息丟失**。
- **多裝置同步**：sender 也推自己一份 → 同一人在另一分頁/手機/桌面看到自己剛送的訊息即時更新。

**為什麼選 Socket.io 而非純 WebSocket**：socket.io 提供 auto-reconnect、polling fallback（網路不穩）、room API、ack callback。純 WS 這些都要自己寫，MVP 階段選 socket.io 省 70% 時間。

**個人感想**：io.use 認證卡了好一陣子 — 第一次踩雷是 socket 沒帶 token 連線被擋掉，後來查到 `socket.handshake.auth.token` 才接上。多裝置同步那段是想到自己用 IG 時兩個分頁同時開的體驗 — 如果只推給 recipient，sender 另一個裝置看不到自己剛發的訊息，UX 會很怪。**這種「使用者體驗反推設計」是平常用 app 累積的直覺**。

### 4. MongoDB Aggregation Pipeline：聊天列表一次完成

「我聊過天的所有人 + 最後一句」這個 query 純 `find()` 做不到 — 需要：
- group by「對話的另一個人」
- 取每組最新訊息
- join User 拿 username / avatar

```js
Message.aggregate([
  { $match: { $or: [{ sender: myId }, { recipient: myId }] } },
  { $sort: { createdAt: -1 } },
  { $group: {
      _id: { $cond: [{ $eq: ["$sender", myId] }, "$recipient", "$sender"] },
      lastMessage: { $first: "$$ROOT" },
  }},
  { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "user" } },
  { $unwind: "$user" },
  { $project: { ... } },
  { $sort: { "lastMessage.createdAt": -1 } },
]);
```

對應 SQL `WHERE → ORDER BY → GROUP BY → JOIN`。Aggregation 把這些寫成 stage pipeline，**每個 stage 接受上游 doc array 輸出新形狀**（$group 後 doc 結構完全變了）。

**踩過的雷**：aggregation 比對 ObjectId 不會自動 cast，要顯式 `new mongoose.Types.ObjectId(req.user._id)`，跟 `find({})` 不同。

**個人感想**：ObjectId 沒 cast 那個雷 debug 半天 — 用 `console.log` 看到 `myId` 是 string 但 sender 是 ObjectId，比較永遠 false。`Mongoose.find()` 會自動 cast 是我平常的習慣，aggregation 不會 cast 才知道**兩種 API 的差異**。寫 aggregation 像在組裝管線，每個 stage 進什麼出什麼形狀要心裡有圖。

### 5. JWT 登出設計取捨：4 種策略對比

JWT 是 stateless，沒有「server 端 session 可清」的概念。「登出」實際上有 4 種策略：

| 策略 | 做法 | trade-off |
|---|---|---|
| **A. Frontend remove token** | localStorage 刪 token | 簡單，但 token 直到 exp 仍可用 |
| **B. Server blacklist** | DB 存 revoked tokens | 多 1 次 DB query 每 request |
| **C. Refresh token pair** | short-lived access + long-lived refresh | 業界標準，實作複雜 |
| **D. 退回 session-based** | 不用 JWT 改 Redis session | 失去 stateless 優勢 |

我選 **A**：個人專案 + JWT 已設 1 天 expire + portfolio 重點不在 auth。**未來上 prod 會升級到 C**。

**面試 takeaway**：JWT 的 stateless 是優點也是痛點，trade-off 看 use case 而非絕對好壞。

**個人感想**：JWT stateless 在我這個 portfolio 場景 OK，但學了 4 種策略後知道 production scale 一定要 refresh token pair（短期 access + 長期 refresh）才能在「**安全 + UX + 不打爆 DB**」之間取平衡。這個 trade-off **是設計題不是技術題** — 沒有絕對好壞，看 use case。

## 💎 Other Notable Patterns

純 JS 無 framework 場景下，幾個用 raw API 達成「框架級設計」的小設計：

### A. CustomEvent + `setTimeout(fn, 0)` 跨檔通訊
sidebar 載入完通知各頁面初始化，純 JS 用 CustomEvent 取代 framework 的 Context / EventBus：

```js
// sidebar.js
setTimeout(() => {                    // 排到 event queue 後，確保各頁 listener 先註冊
  document.dispatchEvent(new CustomEvent("sidebarLoaded", {
    detail: { resetModal, getFormData, currentUser },
  }));
}, 0);

// 各頁面
document.addEventListener("sidebarLoaded", (e) => {
  const { currentUser } = e.detail;
  // ...
});
```

**亮點**：純 DOM API 做到「dispatcher 帶 payload」+「subscriber 解構接收」，本質是 React Context 的手刻版。

### B. 動態元件 factory pattern（return DOM 而非 string）
```js
const createCard = (data) => {
  const card = document.createElement("div");
  card.innerHTML = `<img src="${data.image}" ... />`;
  card.querySelector(".btn").addEventListener("click", ...);
  return card;     // ⬅️ 回傳 element，caller 用 appendChild
};

container.appendChild(createCard(data));   // ✅
container.innerHTML = createCard(data);    // ❌ 變 "[object HTMLDivElement]"
```

**亮點**：把「**事件綁定 + 樣式 + 結構**」封裝在一個 function，每張卡片獨立 — 概念上等同 React component 的 raw JS 版。

### C. `requestAnimationFrame` 解決 scrollHeight 渲染時機
卡片 caption 截斷 + 「more」按鈕：要判斷文字是否真的被截斷才顯示 more。但 DOM 剛插入時 `scrollHeight = 0`（瀏覽器還沒 render）：

```js
container.appendChild(card);
requestAnimationFrame(() => {   // ⬅️ 等下一個 frame，渲染完才讀
  if (caption.scrollHeight <= caption.clientHeight) {
    moreBtn.style.display = "none";   // 沒被截斷，隱藏 more
  }
});
```

**亮點**：理解 **DOM insert → reflow / paint** 的時機差距，知道 `requestAnimationFrame` 是「等下一個 frame 開始前」的 API。

### D. FormData 不能手動加 Content-Type
經典踩雷 — `multipart/form-data` 的 boundary 必須由瀏覽器自動生成，手動加 → boundary 對不上 → multer parse 失敗：

```js
fetch(url, {
  body: formData,
  headers: {
    Authorization: `Bearer ${token}`,
    // ⚠️ 不加 Content-Type，讓瀏覽器自動設 multipart/form-data; boundary=...
  }
});
```

**亮點**：知道為什麼這跟 `application/json` 不同 — boundary 是動態 token，手動寫死會 corrupt request body。

## 📋 Roadmap

### 短期（in progress）
- [ ] Frontend 多圖選擇 UI + carousel 預覽（backend schema 已準備）
- [ ] Read receipt / typing indicator（chat 階段 3）
- [ ] EC2 部署上線

### 中期
- [ ] Cursor-based pagination（取代 skip/limit，避免大資料量效能下降）
- [ ] TypeScript migration（API contract、避免再踩 schema mismatch）
- [ ] CI/CD pipeline（GitHub Actions 自動測試 + 部署）
- [ ] Unit test 補完（Jest，目前 frontend 純函式有手動驗證）
- [ ] Search 加 hashtag

### 長期
- [ ] Stories（IG 限時動態）
- [ ] Reels（短影音）

## 👤 Author

**Tzu Han Chao**

- 📧 Email: joannechao1007@gmail.com
- 🐙 GitHub: [@tzuhan1007](https://github.com/tzuhan1007)

## 📄 License

MIT
