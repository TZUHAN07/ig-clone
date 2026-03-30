 const { API_BASE_URL } = config;
 async function getAllPosts() {
  const token = getToken();

  try {
    const res = await fetch(`${API_BASE_URL}/posts`, {
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