async function getUserPosts(userId) {
  return await apiFetch(`${API_BASE_URL}/posts/user/${userId}`);
}
