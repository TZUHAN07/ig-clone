const exploreList = document.querySelector(".explore-list");

const loadExplorePosts = async () => {
  const posts = await getExplorePosts();
  posts.data.forEach((post) => {
    const exploreCard = createExploreCard(post);
    exploreList.appendChild(exploreCard);
  });
};

document.addEventListener("sidebarLoaded", () => {
  const profile = document.querySelector(".profile");

  const loadProfile = async () => {
    const user = await getMe();
    if (!user || !user.data) return;

    const avatar = createProfileAvatar(user.data);
    profile.appendChild(avatar);
  };
  loadProfile();
  loadExplorePosts();
});
