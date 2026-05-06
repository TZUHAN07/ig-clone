const { API_BASE_URL } = config;
async function getFollowingPosts(page = 1) {
  const token = getToken();

  try {
    const res = await fetch(
      `${API_BASE_URL}/posts/following?page=${page}&limit=5`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("取得貼文失敗", err.message);
    return null;
  }
}

async function createPost(formData) {
  const token = getToken();

  try {
    const res = await fetch(`${API_BASE_URL}/posts`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("新增貼文失敗", err.message);
    return null;
  }
}

async function likePost(postId) {
  const token = getToken();

  try {
    const res = await fetch(`${API_BASE_URL}/posts/${postId}/like`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("按讚失敗", err.message);
    return null;
  }
}

async function unlikePost(postId) {
  const token = getToken();

  try {
    const res = await fetch(`${API_BASE_URL}/posts/${postId}/like`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("取消按讚失敗", err.message);
    return null;
  }
}

async function getPost(postId) {
  const token = getToken();

  try {
    const res = await fetch(`${API_BASE_URL}/posts/${postId}`, {
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
