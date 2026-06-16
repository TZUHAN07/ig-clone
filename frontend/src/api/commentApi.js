async function getComments(postId) {
  return await apiFetch(`${API_BASE_URL}/posts/${postId}/comments`);
}

async function createComment(postId, content) {
  return await apiFetch(`${API_BASE_URL}/posts/${postId}/comments`, {
    method: "POST",
    body: JSON.stringify({ content }),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

async function deleteComment(commentId) {
  return await apiFetch(`${API_BASE_URL}/comments/${commentId}`, {
    method: "DELETE",
  });
}
