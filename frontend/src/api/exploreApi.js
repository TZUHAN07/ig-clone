async function getExplorePosts() {
  return await apiFetch(`${API_BASE_URL}/posts`);
}
