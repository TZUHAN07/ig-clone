const exploreList = document.querySelector(".explore-list");

const token = getToken();
if (!token) {
  postList.innerHTML = `
    <div style="text-align: center; margin-top: 50px; color: #f06272;">
      <h3>請先登入</h3>
      <p>正在為您跳轉到登入頁面...</p>
    </div>
  `;
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

  loadExplorePosts();

  shareBtn.addEventListener("click", async () => {
    const formData = getFormData();
    if (!formData) return;
    formData.append("image", file);
    formData.append("content", caption);

    const data = await createPost(formData);

    if (data && data.success) {
      modal.classList.add("hidden");
      resetModal();
    }
  });
});
