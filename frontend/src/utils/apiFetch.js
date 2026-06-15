async function apiFetch(url, options = {}) {
  const token = getToken();

  const headers = {
    ...options.headers,
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  try {
    const res = await fetch(url, { ...options, headers });

    if (res.status === 401) {
      removeToken();
      clearCachedMe();
      window.location.href = "login.html";
      return null;
    }

    return await res.json();
  } catch (err) {
    console.error(`API ${url} 錯誤:`, err.message);
    return null;
  }
}