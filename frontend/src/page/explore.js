const exploreList = document.querySelector(".explore-list");

const token = getToken();
if (!token) {
  setTimeout(() => {
    window.location.href = "login.html";
  }, 1500);
}

const loadExplorePosts = async () => {
  const posts = await getExplorePosts();
  if (!posts || !posts.data) return;

  posts.data.forEach((post) => {
    const exploreCard = createExploreCard(post);
    exploreList.appendChild(exploreCard);
  });
};

document.addEventListener("sidebarLoaded", (e) => {
  const { resetModal, getFormData } = e.detail;
  const shareBtn = document.getElementById("share-btn");
  const modal = document.getElementById("create-modal");

  loadExplorePosts();

  shareBtn.addEventListener("click", async () => {
    const formData = getFormData();
    if (!formData) return;

    const data = await createPost(formData);

    if (data && data.success) {
      modal.classList.add("hidden");
      resetModal();
    }
  });
});
