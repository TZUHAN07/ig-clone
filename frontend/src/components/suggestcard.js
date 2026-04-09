const createSuggestCard = (user) => {
  const card = document.createElement("div");
  card.className = "suggest-card";

  card.innerHTML = `
      <div class="user-info">
        <img class="post-avatar" src="${user.avatar}" alt="${user.username}"/>
        <span class="post-user">${user.username}</span>
      </div>
      <button class="follow-btn">Follow</button>
  `;

  // 按鈕點擊邏輯
  const followBtn = card.querySelector(".follow-btn");
  followBtn.addEventListener("click", async () => {
    const data = await followUser(user._id);
    if (data && data.success) {
      followBtn.textContent = "Following";
      followBtn.disabled = true;
      followBtn.classList.add("following");
    }
  });

  const postAvatar = card.querySelector(".post-avatar");
  postAvatar.addEventListener("click", () => {
    window.location.href = `${basePath}profile.html?id=${user._id}`;
  });

  const postUser = card.querySelector(".post-user");
  postUser.addEventListener("click", () => {
    window.location.href = `${basePath}profile.html?id=${user._id}`;
  });

  return card;
};
