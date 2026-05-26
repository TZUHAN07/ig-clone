requireAuth();

const SOCKET_URL = `${window.location.protocol}//${window.location.hostname}:3000`;

const socket = io(SOCKET_URL, {
  auth: { token: getToken() },
});

socket.on("connect", () => {
  console.log("socket connected", socket.id);
});

socket.on("disconnect", (reason) => {
  console.log("socket disconnected", reason);
});

socket.on("receiveMessage", (msg) => {
  const fromId = typeof msg.sender === "object" ? msg.sender._id : msg.sender;
  const toId =
    typeof msg.recipient === "object" ? msg.recipient._id : msg.recipient;

  if (currentChatUser) {
    const inCurrentChat =
      fromId === currentChatUser._id ||
      (fromId === currentMe._id && toId === currentChatUser._id);

    if (inCurrentChat) {
      appendMessage(msg);
    }
  }
  loadConversations();
});

const EMPTY_STATE_HTML = `
  <div class="empty-state">
    <div class="empty-icon">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
        <path d="M568.4 37.7C578.2 34.2 589 36.7 596.4 44C603.8 51.3 606.2 62.2 602.7 72L424.7 568.9C419.7 582.8 406.6 592 391.9 592C377.7 592 364.9 583.4 359.6 570.3L295.4 412.3C290.9 401.3 292.9 388.7 300.6 379.7L395.1 267.3C400.2 261.2 399.8 252.3 394.2 246.7C388.6 241.1 379.6 240.7 373.6 245.8L261.2 340.1C252.1 347.7 239.6 349.7 228.6 345.3L70.1 280.8C57 275.5 48.4 262.7 48.4 248.5C48.4 233.8 57.6 220.7 71.5 215.7L568.4 37.7z"/>
      </svg>
    </div>
    <h3>Your messages</h3>
    <p>傳送私訊開始對話</p>
  </div>
`;

const appendMessage = (msg) => {
  const emptyEl = messageListEl.querySelector(".empty-state");
  if (emptyEl) emptyEl.remove();

  const messages = messageListEl.querySelectorAll(".message");
  const lastMsg = messages[messages.length - 1];
  const newDate = new Date(msg.createdAt).toDateString();
  
  if (!lastMsg || newDate !== lastMsg.dataset.date) {
    messageListEl.appendChild(createDateDivider(msg.createdAt));
  }

  messageListEl.appendChild(createMessageBubble(msg));
  messageListEl.scrollTop = messageListEl.scrollHeight;
};

const conversationListEl = document.getElementById("conversation-list");
const messageListEl = document.getElementById("message-list");
const chatHeaderEl = document.getElementById("chat-header");
const chatAvatarEl = document.getElementById("chat-avatar");
const chatUsernameEl = document.getElementById("chat-username");
const messageFormEl = document.getElementById("message-form");

let currentMe = null;
let currentChatUser = null;

let cachedConversations = [];

const loadConversations = async () => {
  const result = await getConversations();
  if (!result || !result.data) {
    conversationListEl.innerHTML = '<li class="empty">取得對話列表失敗</li>';
    return;
  }
  cachedConversations = result.data;

  if (result.data.length === 0) {
    conversationListEl.innerHTML = '<li class="empty">還沒有對話</li>';
    return;
  }

  conversationListEl.innerHTML = "";
  result.data.forEach((chat) => {
    conversationListEl.appendChild(createConversationItem(chat));
  });
};

const openChatFromUrl = async () => {
  const params = new URLSearchParams(window.location.search);
  const targetUserId = params.get("userId");
  if (!targetUserId) return;
  if (currentMe && targetUserId === currentMe._id) return;

  const existing = cachedConversations.find((c) => c.user._id === targetUserId);
  if (existing) {
    selectConversation(existing.user);
    return;
  }

  const userRes = await getUser(targetUserId);
  if (userRes && userRes.data) {
    selectConversation(userRes.data);
  }
};

const createConversationItem = (chat) => {
  const li = document.createElement("li");
  li.dataset.userId = chat.user._id;
  li.innerHTML = `
    <img src="${chat.user.avatar}" alt="${chat.user.username}" />
    <div class="info">
      <div class="username">${chat.user.username}</div>
      <div class="preview">${chat.lastMessage.content}</div>
    </div>
  `;
  li.addEventListener("click", () => selectConversation(chat.user));
  return li;
};

messageFormEl.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!currentChatUser) {
    return;
  }
  const inputEl = document.getElementById("message-input");
  const content = inputEl.value.trim();
  if (!content) return;

  const submitBtn = messageFormEl.querySelector("button");
  submitBtn.disabled = true;

  socket.emit(
    "sendMessage",
    { recipientId: currentChatUser._id, content },
    (response) => {
      if (response.success) {
        inputEl.value = "";
      } else {
        alert(response.message || "傳送失敗");
      }
      submitBtn.disabled = false;
    },
  );
});

const selectConversation = async (user) => {
  currentChatUser = user;

  document.querySelectorAll("#conversation-list li").forEach((el) => {
    el.classList.toggle("active", el.dataset.userId === user._id);
  });

  chatAvatarEl.src = user.avatar;
  chatUsernameEl.textContent = user.username;
  chatHeaderEl.classList.remove("hidden");
  messageFormEl.classList.remove("hidden");

  await loadMessages(user._id);
};

const loadMessages = async (userId) => {
  const result = await getMessagesWithUser(userId);
  if (!result || !result.data) {
    messageListEl.innerHTML = '<p class="empty-hint">載入失敗</p>';
    return;
  }

  if (result.data.length === 0) {
    messageListEl.innerHTML = EMPTY_STATE_HTML;
    return;
  }

  messageListEl.innerHTML = "";

  const messages = [...result.data].reverse();
  messages.forEach((msg, i) => {
    const prev = messages[i - 1];

    if (!prev || !isSameDay(prev.createdAt, msg.createdAt)) {
      messageListEl.appendChild(createDateDivider(msg.createdAt));
    }
    messageListEl.appendChild(createMessageBubble(msg));
  });

  messageListEl.scrollTop = messageListEl.scrollHeight;
};

const createMessageBubble = (msg) => {
  const div = document.createElement("div");
  const isMine = msg.sender._id === currentMe._id;
  div.className = `message ${isMine ? "mine" : "theirs"}`;
  div.textContent = msg.content;
  div.dataset.time = formatClockTime(msg.createdAt);
  div.dataset.date = new Date(msg.createdAt).toDateString();

  return div;
};

const createDateDivider = (iso) => {
  const div = document.createElement("div");
  div.className = "date-divider";
  div.textContent = formatDateDivider(iso);

  return div;
};

document.addEventListener("sidebarLoaded", async (e) => {
  currentMe = e.detail.currentUser;
  await loadConversations();
  await openChatFromUrl();
});
