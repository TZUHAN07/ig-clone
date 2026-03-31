const exploreList = document.querySelector(".explore-list");

const loadExplorePosts = async () => {
  const posts = await getExplorePosts();
  posts.data.forEach((post) => {
    const exploreCard = createExploreCard(post);
    exploreList.appendChild(exploreCard);
  });
};

document.addEventListener("sidebarLoaded", () => {
  loadExplorePosts();
});
