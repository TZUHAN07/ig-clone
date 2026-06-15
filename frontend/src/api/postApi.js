const { API_BASE_URL } = config;
async function getFollowingPosts(page = 1) {
  return await apiFetch(`${API_BASE_URL}/posts/following?page=${page}&limit=5`);
}

async function createPost(formData) {
  return await apiFetch(`${API_BASE_URL}/posts`, {
    method: "POST",
    body: formData,
  });
}

async function likePost(postId) {
  return await apiFetch(`${API_BASE_URL}/posts/${postId}/like`, {
    method: "POST",
  });
}

async function unlikePost(postId) {
  return await apiFetch(`${API_BASE_URL}/posts/${postId}/like`, {
    method: "DELETE",
  });
}

async function getPost(postId) {
  return await apiFetch(`${API_BASE_URL}/posts/${postId}`);
}

async function deletePost(postId) {
  return await apiFetch(`${API_BASE_URL}/posts/${postId}`, {
    method: "DELETE",
  });
}
