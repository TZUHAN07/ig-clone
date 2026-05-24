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
      messageListEl.appendChild(createMessageBubble(msg));
      messageListEl.scrollTop = messageListEl.scrollHeight;
    }
  }
  loadConversations();
});

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

  messageListEl.innerHTML = "";

  const messages = [...result.data].reverse();
  messages.forEach((msg) => {
    messageListEl.appendChild(createMessageBubble(msg));
  });

  messageListEl.scrollTop = messageListEl.scrollHeight;
};

const createMessageBubble = (msg) => {
  const div = document.createElement("div");
  const isMine = msg.sender._id === currentMe._id;
  div.className = `message ${isMine ? "mine" : "theirs"}`;
  div.textContent = msg.content;
  return div;
};

document.addEventListener("sidebarLoaded", async (e) => {
  currentMe = e.detail.currentUser;
  await loadConversations();
  await openChatFromUrl();
});
