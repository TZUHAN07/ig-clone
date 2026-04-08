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
    console.log(data);
    return data;
  } catch (err) {
    console.log("取得貼文失敗", err.message);
    return null;
  }
}

async function getUser(userId) {
  const token = getToken();
  try {
    const res = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    console.log(data);
    return data;
  } catch (err) {
    console.log("取得本人失敗", err.message);
    return null;
  }
}

async function followUser(targetId) {
  const token = getToken();
  try {
    const res = await fetch(`${API_BASE_URL}/users/${targetId}/follow`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    console.log(data);
    return data;
  } catch (err) {
    console.log("追蹤用戶失敗", err.message);
    return null;
  }
}

async function unfollowUser(targetId) {
  const token = getToken();
  try {
    const res = await fetch(`${API_BASE_URL}/users/${targetId}/follow`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    console.log(data);
    return data;
  } catch (err) {
    console.log("取消追蹤用戶失敗", err.message);
    return null;
  }
}
