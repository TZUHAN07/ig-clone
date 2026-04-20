const profileContainer = document.querySelector(".profile-container");

requireAuth();

document.addEventListener("sidebarLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const profileId = urlParams.get("id");

  const me = await getMe();
  const myId = me.data._id;
  const targetId = profileId || myId;
  const isMyProfile = !profileId || profileId === myId;

  const [userRes, postsRes] = await Promise.all([
    getUser(targetId),
    getUserPosts(targetId),
  ]);

  const user = userRes.data;
  const posts = postsRes.data;

  const avatarEl = document.querySelector(".profile-avatar");
  const usernameEl = document.querySelector(".profile-username");

  if (avatarEl) {
    const defaultAvatar = "https://gravatar.com/avatar/?d=mp&s=200";
    avatarEl.src = user.avatar || defaultAvatar;
    avatarEl.onerror = () => {
      avatarEl.src = defaultAvatar;
    };
  }

  if (usernameEl) {
    usernameEl.textContent = user.username;
  }

  const statCounts = document.querySelectorAll(".stat-count");
  statCounts[0].textContent = posts.length;
  statCounts[1].textContent = user.followers.length;
  statCounts[2].textContent = user.following.length;

  const profileBtn = document.getElementById("profile-btn");

  if (isMyProfile) {
    profileBtn.textContent = "Edit Profile";

    // 只有自己的 profile 才能換頭貼
    avatarEl.classList.add("avatar-editable");
    avatarEl.addEventListener("click", () => openAvatarModal());
  } else {
    let isFollowing = user.followers.some(
      (id) => id === myId || id.toString() === myId,
    );
    profileBtn.textContent = isFollowing ? "Following" : "Follow";

    profileBtn.addEventListener("click", async () => {
      if (isFollowing) {
        await unfollowUser(targetId);
        profileBtn.textContent = "Follow";
        isFollowing = false;
      } else {
        await followUser(targetId);
        profileBtn.textContent = "Following";
        isFollowing = true;
      }
    });
  }

  const profileList = document.querySelector(".profile-list");
  profileList.innerHTML = "";
  posts.forEach((post) => {
    const img = document.createElement("img");
    img.src = post.image;
    img.alt = post.user.username;
    profileList.appendChild(img);
  });

  function openAvatarModal() {
    const existing = document.getElementById("avatar-modal");
    if (existing) existing.remove();

    const modal = document.createElement("div");
    modal.id = "avatar-modal";
    modal.className = "modal-overlay";

    modal.innerHTML = `
      <div class="avatar-modal-content">
        <h3>Change Profile Photo</h3>
        <button class="avatar-option upload-option">Upload Photo</button>
        <button class="avatar-option cancel-option">Cancel</button>
      </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector(".upload-option").addEventListener("click", () => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.click();

      input.addEventListener("change", async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("avatar", file);

        const res = await changeUserAvatar(myId, formData);

        if (res && res.success) {
          avatarEl.src = res.data.avatar;
          const sidebarAvatar = document.querySelector(".nav-avatar");
          if (sidebarAvatar) sidebarAvatar.src = res.data.avatar;
        } else {
          alert("Upload failed, please try again.");
        }

        modal.remove();
      });
    });

    modal.querySelector(".cancel-option").addEventListener("click", () => {
      modal.remove();
    });

    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
  }
});
