function loadCommentModal() {
  const modal = document.createElement("div");
  modal.id = "comment-modal";
  modal.className = "modal-overlay hidden";

  modal.innerHTML = `
    <button class="close-btn" id="close-comment-modal">✕</button>
    
    <div class="comment-modal-content">
        <div class="comment-image-area">
            <img class="comment-image" src="" alt="" />
        </div>
      
        <div class="comment-content-area">
            <div class="comment-modal-header">
                <img class="comment-modal-avatar" src="" alt="" />
                <span class="comment-modal-username"></span>
            </div>
        
            <div class="comment-modal-body">
                <div class="comment-modal-caption"></div>
                <div class="comment-list"></div>
            </div>

           <div class="modal-post-footer">
                <div class="modal-post-actions">
                <div class="modal-post-like">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                    </svg>
                </div>

                 <div class="modal-post-comment">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
                    </svg>
                </div>
                </div>

                <span class="modal-post-likes-count"></span>
                <span class="modal-post-time"></span>

            </div>
        
            <div class="comment-input-area">
                <textarea type="text" id="comment-input" placeholder="Add a comment..." ></textarea>
                <button id="post-comment-btn">Post</button>
            </div>
        </div>
    </div>
    `;
  document.body.appendChild(modal);

  document
    .getElementById("close-comment-modal")
    .addEventListener("click", () => {
      modal.classList.add("hidden");
    });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.add("hidden");
    }
  });
}

async function openCommentModal(post, onCommentAdded, onLikeChanged) {
  const modal = document.getElementById("comment-modal");
  const image = document.querySelector(".comment-image");
  const avatar = document.querySelector(".comment-modal-avatar");
  const username = document.querySelector(".comment-modal-username");
  const caption = document.querySelector(".comment-modal-caption");
  const commentList = document.querySelector(".comment-list");
  const modalLike = modal.querySelector(".modal-post-like");
  const modalComment = modal.querySelector(".modal-post-comment");
  const likesCount = modal.querySelector(".modal-post-likes-count");
  const postTime = modal.querySelector(".modal-post-time");
  const commentInput = document.getElementById("comment-input");

  likesCount.textContent = `${post.likes.length} likes`;
  postTime.textContent = formatTime(post.createdAt);

  const isLikedInit = currentUser
  ? post.likes.some((id) => id.toString() === currentUser._id.toString())
  : false;

modalLike.classList.toggle("liked", isLikedInit);
modalLike.dataset.loading = "false";

let liked = isLikedInit;
let count = post.likes.length;

modalLike.addEventListener("click", async () => {
  if (modalLike.dataset.loading === "true") return;
  modalLike.dataset.loading = "true";

  const preLiked = liked;
  const prevCount = count;

  liked = !liked;
  count += liked ? 1 : -1;
  if (count < 0) count = 0;
  likesCount.textContent = `${count} likes`;
  modalLike.classList.toggle("liked", liked);

  const data = preLiked ? await unlikePost(post._id) : await likePost(post._id);

  if (!data || !data.success) {
    liked = preLiked;
    count = prevCount;
    likesCount.textContent = `${count} likes`;
    modalLike.classList.toggle("liked", liked);
    alert("操作失敗");
  }

  modalLike.dataset.loading = "false";

  if (onLikeChanged) onLikeChanged(liked, count);
});

modalComment.addEventListener("click", () => {
  commentInput.focus();
});


  image.src = post.image;
  avatar.src = post.user.avatar;
  username.textContent = post.user.username;
  caption.innerHTML = `
    <img class="comment-modal-avatar" src=${post.user.avatar} alt=${post.user.username} />
    <div class="comment-content">
        <div class="comment-header">
            <span class="comment-username">${post.user.username}</span>
            <span class="comment-text">${post.content}</span>
        </div>
        <span class="comment-timestamp">${formatTime(post.createdAt)}</span>
    </div>
  `;

  commentInput.value = "";
  commentList.innerHTML =
    "<p style='text-align:center; color:#888;'>載入中...</p>";
  modal.classList.remove("hidden");

  const data = await getComments(post._id);
  commentList.innerHTML = "";

  if (data && data.success) {
    data.data.forEach((comment) => {
      const commentCard = createCommentCard(comment);
      commentList.appendChild(commentCard);
    });
  }

  const oldBtn = document.getElementById("post-comment-btn");
  const newBtn = oldBtn.cloneNode(true);
  oldBtn.parentNode.replaceChild(newBtn, oldBtn);

  newBtn.addEventListener("click", async () => {
    const content = commentInput.value.trim();
    if (!content) return;

    newBtn.disabled = true;
    const result = await createComment(post._id, content);
    newBtn.disabled = false;

    if (result && result.success) {
      commentInput.value = "";
      commentInput.style.height = "40px";
      newBtn.disabled = true;
      const commentCard = createCommentCard(result.data);
      commentList.appendChild(commentCard);

      commentList.scrollTop = commentList.scrollHeight;
      if (onCommentAdded) onCommentAdded();
    }
  });

  commentInput.addEventListener("input", () => {
    commentInput.style.height = "auto";
    if (commentInput.scrollHeight > 45) {
      commentInput.style.height = commentInput.scrollHeight + "px";
    } else {
      commentInput.style.height = "40px";
    }

    newBtn.disabled = commentInput.value.trim() === "";
  });

  commentInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!newBtn.disabled) newBtn.click();
    }
  });
}

function createCommentCard(comment) {
  const card = document.createElement("div");
  card.className = "comment-card";

  card.innerHTML = `
        <img class="comment-avatar" src="${comment.user.avatar}" alt="${comment.user.username}" />
        <div class="comment-content">
            <div class="comment-header">
                <span class="comment-username">${comment.user.username}</span>
                <span class="comment-text">${comment.content}</span>
            </div>
            <span class="comment-timestamp">${formatTime(comment.createdAt)}</span>
        </div>
      `;
  return card;
}

loadCommentModal();
