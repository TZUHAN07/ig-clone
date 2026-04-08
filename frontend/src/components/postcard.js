const basePath = window.location.pathname.replace(/[^/]*\.html$/, "");

const createPostCard = (post) => {
  const card = document.createElement("div");
  card.className = "post-card";

  card.innerHTML = `
    <div class="post-header">
      <div class="user-info">
        <img class="post-avatar" src="${post.user.avatar}" alt="${post.user.username}"/>
        <span class="post-user">${post.user.username}</span>
        <span class="post-time"> · ${formatTime(post.createdAt)}</span>
      </div>
    </div>
 
    <img class="post-image" src="${post.image}" alt="${post.user.username}"/>
    
    <div class="post-footer">
    <div class="post-actions">
      <div class="post-like">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
        </svg>
        <span>${post.likes.length}</span>
      </div>
      <div class="post-comment">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
        </svg>
        <span>${post.comments.length}</span>
      </div>
    </div>
 
    <div class="post-content">
      <span class="post-user"><strong>${post.user.username}</strong></span>
      <span class="caption truncated">${post.content}</span>
      <span class="more-btn">more</span>
    </div>
    </div>
  `;

  const caption = card.querySelector(".caption");
  const moreBtn = card.querySelector(".more-btn");

  requestAnimationFrame(() => {
    if (caption.scrollHeight <= caption.clientHeight) {
      moreBtn.style.display = "none";
    }
  });

  moreBtn.addEventListener("click", () => {
    caption.classList.remove("truncated");
    moreBtn.style.display = "none";
  });

  const postAvatar = card.querySelector(".post-avatar");
  postAvatar.addEventListener("click", () => {
    window.location.href = `${basePath}profile.html?id=${post.user._id}`;
  });

  const postUser = card.querySelectorAll(".post-user");
  postUser.forEach((user) => {
    user.addEventListener("click", () => {
      window.location.href = `${basePath}profile.html?id=${post.user._id}`;
    });
  });

  return card;
};
