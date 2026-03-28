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
