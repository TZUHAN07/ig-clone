let currentUser = null;

requireAuth();

document.addEventListener("sidebarLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const postId = params.get("id");

  if (!postId) {
    document.querySelector(".post-page").innerHTML =
      "<p style='text-align:center; padding:40px;'>Post not found.</p>";
    return;
  }

  const me = await getMe();
  currentUser = me?.data || null;

  const postRes = await getPost(postId);
  if (!postRes || !postRes.success) {
    document.querySelector(".post-page").innerHTML =
      "<p style='text-align:center; padding:40px;'>Post not found.</p>";
    return;
  }

  const post = postRes.data;

  document.querySelector(".post-page-back").addEventListener("click", () => {
    if (document.referrer) {
      history.back();
    } else {
      window.location.href = "explore.html";
    }
  });

  const imageEl = document.querySelector(".post-page-image");
  imageEl.src = post.image;

  const avatarEl = document.querySelector(".post-page-avatar");
  const usernameEl = document.querySelector(".post-page-username");
  avatarEl.src = post.user.avatar;
  usernameEl.textContent = post.user.username;

  [avatarEl, usernameEl].forEach((el) => {
    el.style.cursor = "pointer";
    el.addEventListener("click", () => {
      window.location.href = `profile.html?id=${post.user._id}`;
    });
  });
  const followBtn = document.querySelector(".post-page-follow-btn");
  if (currentUser && post.user._id !== currentUser._id) {
    followBtn.classList.remove("hidden");

    const meRes = await getMe();
    const myFollowing = meRes?.data?.following || [];
    let isFollowing = myFollowing.some(
      (id) => id === post.user._id || id.toString() === post.user._id,
    );

    followBtn.textContent = isFollowing ? "Following" : "Follow";
    followBtn.addEventListener("click", async () => {
      if (isFollowing) {
        await unfollowUser(post.user._id);
        followBtn.textContent = "Follow";
        isFollowing = false;
      } else {
        await followUser(post.user._id);
        followBtn.textContent = "Following";
        isFollowing = true;
      }
    });
  }

  const captionEl = document.querySelector(".post-page-caption");
  captionEl.innerHTML = `
    <span class="post-page-caption-text">${post.content}</span>
  `;

  document.querySelector(".post-page-time").textContent = formatTime(
    post.createdAt,
  );

  const viewComments = document.querySelector(".post-page-overlay-comment");
  const commentCount = post.comments.length;
  if (commentCount > 0) {
    viewComments.addEventListener("click", () => {
      openCommentModal(post, () => {
        const currentCount = parseInt(commentsCountEl.textContent) || 0;
        commentsCountEl.textContent = `${currentCount + 1} `;
      });
    });
  }

  const likesCountEl = document.querySelector(".post-page-likes-count");
  const commentsCountEl = document.querySelector(".post-page-comments-count");
  const timeEl = document.querySelector(".post-page-time");

  likesCountEl.textContent = `${post.likes.length} `;
  commentsCountEl.textContent = `${post.comments.length} `;
  timeEl.textContent = formatTime(post.createdAt);

  const likeBtn = document.querySelector(".post-page-overlay-like");
  const isLikedInit = currentUser
    ? post.likes.some((id) => id.toString() === currentUser._id.toString())
    : false;

  let liked = isLikedInit;
  let count = post.likes.length;
  likeBtn.classList.toggle("liked", liked);
  likeBtn.dataset.loading = "false";

  likeBtn.addEventListener("click", async () => {
    if (likeBtn.dataset.loading === "true") return;
    likeBtn.dataset.loading = "true";

    const preLiked = liked;
    const prevCount = count;

    liked = !liked;
    count += liked ? 1 : -1;
    if (count < 0) count = 0;
    likesCountEl.textContent = `${count}`;
    likeBtn.classList.toggle("liked", liked);

    const data = preLiked
      ? await unlikePost(post._id)
      : await likePost(post._id);

    if (!data || !data.success) {
      liked = preLiked;
      count = prevCount;
      likesCountEl.textContent = `${count} likes`;
      likeBtn.classList.toggle("liked", liked);
    }

    likeBtn.dataset.loading = "false";
  });

  document
    .querySelector(".post-page-overlay-comment")
    .addEventListener("click", () => {
      openCommentModal(post);
    });
});

