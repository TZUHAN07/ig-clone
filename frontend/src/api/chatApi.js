const { API_BASE_URL } = config;

async function getConversations() {
  const token = getToken();
  try {
    const res = await fetch(`${API_BASE_URL}/messages`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    return await res.json();
  } catch (err) {
    console.error("取得對話列表失敗", err.message);
    return null;
  }
}

async function getMessagesWithUser(userId) {
  const token = getToken();
  try {
    const res = await fetch(`${API_BASE_URL}/messages/${userId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    return await res.json();
  } catch (err) {
    console.error("取得對話歷史失敗", err.message);
    return null;
  }
}