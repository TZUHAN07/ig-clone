const createPostCard = (post) => {
  const card = document.createElement("div");
  card.className = "post-card";

  card.innerHTML = `
    <img class="post-avatar" src="${post.user.avatar}" alt="${post.user.username}"/>
    <div class="post-user">${post.user.username}</div>
    <div class="post-time">${formatTime(post.createdAt)}</div>
    <img class="post-image" src="${post.image}" alt="${post.user.username}"/>
    <div class="post-like">${post.likes.length}</div>
    <div class="post-comment">${post.comments.length}</div>
    <div class="post-content">${post.content}</div>
  `;

  return card;
};
