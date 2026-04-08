const profileContainer = document.querySelector(".profile-container");

document.addEventListener("sidebarLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const profileId = urlParams.get("id");

  const me = await getMe();
  const myId = me.data._id;

  const targetId = profileId || myId;

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

  if (!profileId || profileId === myId) {
    profileBtn.textContent = "Edit Profile";
  } else {
    let isFollowing = user.followers.some((id) => id === myId || id.toString() === myId);
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
    })
  }

  const profileList = document.querySelector(".profile-list");
  profileList.innerHTML = "";
  posts.forEach((post) => {
    const img = document.createElement("img");
    img.src = post.image;
    img.alt = post.user.username;
    profileList.appendChild(img);
  });
});
