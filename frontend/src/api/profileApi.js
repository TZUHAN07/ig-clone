async function getUserPosts(userId) {
  const token = getToken();
  try {
    const res = await fetch(`${API_BASE_URL}/posts/user/${userId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("取得貼文失敗", err.message);
    return null;
  }
}


