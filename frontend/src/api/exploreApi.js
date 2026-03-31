const { API_BASE_URL } = config;

async function getExplorePosts() {
  const token = getToken();
  try {
    const res = await fetch(`${API_BASE_URL}/posts`, {
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
