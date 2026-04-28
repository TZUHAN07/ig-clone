 const { API_BASE_URL } = config;
 async function getFollowingPosts() {
  const token = getToken();

  try {
    const res = await fetch(`${API_BASE_URL}/posts/following`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    console.log(data)
    return data;
  } catch (err) {
    console.log("取得貼文失敗", err.message);
    return null;
  }
};

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
    console.log(data)
    return data;
  } catch (err) {
    console.log("新增貼文失敗", err.message);
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
    console.log(data)
    return data;
  } catch (err) {
    console.log("按讚失敗", err.message);
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
    console.log(data)
    return data;
  } catch (err) {
    console.log("取消按讚失敗", err.message);
    return null;
  }
}

async function getPost (postId) {
  const token = getToken();

  try {
    const res = await fetch(`${API_BASE_URL}/posts/${postId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    console.log(data)
    return data;
  } catch (err) {
    console.log("取得貼文失敗", err.message);
    return null;
  }
}