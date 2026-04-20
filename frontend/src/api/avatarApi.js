async function getMe() {
  const token = getToken();
  try {
    const res = await fetch(`${API_BASE_URL}/users/me`, {
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

async function changeUserAvatar(userId, formData) {
  const token = getToken();
  try {
    const res = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    const data = await res.json();
    console.log(data);
    return data;
  } catch (err) {
    console.log("更新頭像失敗", err.message);
    return null;
  }
}
