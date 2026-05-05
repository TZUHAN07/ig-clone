async function getComments(postId) {
  const token = getToken();
  try {
    const res = await fetch(`${API_BASE_URL}/posts/${postId}/comments`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("取得留言失敗", err.message);
    return null;
  }
}

async function createComment(postId, content) {
  const token = getToken();
  try {
    const res = await fetch(`${API_BASE_URL}/posts/${postId}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content }),
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("新增留言失敗", err.message);
    return null;
  }
}

async function deleteComment(commentId) {
  const token = getToken();
  try {
    const res = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("刪除留言失敗", err.message);
    return null;
  }
}
