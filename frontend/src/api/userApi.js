async function getUser(userId) {
  return await apiFetch(`${API_BASE_URL}/users/${userId}`);
}

// 取得所有用戶
async function getAllUsers() {
  return await apiFetch(`${API_BASE_URL}/users`);
}

// 追蹤用戶
async function followUser(targetId) {
  return await apiFetch(`${API_BASE_URL}/users/${targetId}/follow`, {
    method: "POST",
  });
}

async function unfollowUser(targetId) {
  return await apiFetch(`${API_BASE_URL}/users/${targetId}/follow`, {
    method: "DELETE",
  });
}

async function searchUsers(query) {
  return await apiFetch(
    `${API_BASE_URL}/users/search?query=${encodeURIComponent(query)}`,
  );
}
