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

async function openCommentModal(post, onCommentAdded) {
  const modal = document.getElementById("comment-modal");
  const image = document.querySelector(".comment-image");
  const avatar = document.querySelector(".comment-modal-avatar");
  const username = document.querySelector(".comment-modal-username");
  const caption = document.querySelector(".comment-modal-caption");
  const commentList = document.querySelector(".comment-list");
  const commentInput = document.getElementById("comment-input");

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
