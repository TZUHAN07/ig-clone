const { API_BASE_URL } = config;

async function getConversations() {
  return await apiFetch(`${API_BASE_URL}/messages`);
}

async function getMessagesWithUser(userId) {
  return await apiFetch(`${API_BASE_URL}/messages/${userId}`);
}
