let currentUser = null;
const postList = document.querySelector(".post-list");
const modal = document.getElementById("create-modal");

const asideContent = document.querySelector(".aside-content");
const token = getToken();

// if (!token) {
//   postList.innerHTML = `
//     <div style="text-align: center; margin-top: 50px; color: #f06272;">
//       <h3>請先登入</h3>
//       <p>正在為您跳轉到登入頁面...</p>
//     </div>
//   `;

//   setTimeout(() => {
//     window.location.href = "login.html";
//   }, 1500);
// }

requireAuth();  

const loadPosts = async () => {
  postList.innerHTML = "<p style='text-align:center;'>貼文載入中...</p>";
  const posts = await getFollowingPosts();

  postList.innerHTML = "";

  posts.data.forEach((post) => {
    const card = createPostCard(post);
    postList.appendChild(card);
  });
};

const loadSuggestions = async (meInfo) => {
  const users = await getAllUsers();

  const allUsers = users.data;

  const suggestions = allUsers
    .filter((user) => {
      if (user._id === meInfo._id) return false;
      if (
        meInfo.following.some(
          (id) => id === user._id || id.toString() === user._id,
        )
      )
        return false;

      return true;
    })
    .sort(() => Math.random() - 0.5)
    .slice(0, 5);

  // 把每個 suggestion 建立卡片插入 .aside-content

  suggestions.forEach((user) => {
    const card = createSuggestCard(user);
    asideContent.appendChild(card);
  });
};

document.addEventListener("sidebarLoaded", async (e) => {
  const { resetModal, getFormData } = e.detail;
  const shareBtn = document.getElementById("share-btn");

  const me = await getMe();
  currentUser = me?.data || null;
  console.log(currentUser);

  loadPosts();
  loadSuggestions(currentUser);

  shareBtn.addEventListener("click", async () => {
    const formData = getFormData();
    if (!formData) return;

    const data = await createPost(formData);

    if (data && data.success) {
      modal.classList.add("hidden");
      resetModal();
      loadPosts();
    }
  });
});
