async function getMe() {
  return await apiFetch(`${API_BASE_URL}/users/me`);
}

async function changeUserAvatar(userId, formData) {
  return await apiFetch(`${API_BASE_URL}/users/${userId}`, {
    method: "PUT",
    body: formData,
  });
}
