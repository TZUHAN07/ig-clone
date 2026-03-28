const createProfileAvatar = (user) => {
  const profileAvatar = document.createElement("a");
  profileAvatar.href = "profile.html";
  profileAvatar.className = "nav-action";

  profileAvatar.innerHTML = `
    <img class="profile-avatar" src="${user.avatar}" alt="${user.username}"/>
    <span>Profile</span>
    `;

  return profileAvatar;
};
