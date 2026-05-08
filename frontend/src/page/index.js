let currentUser = null;
let currentPage = 1;
let isLoading = false;
let hasMore = true;

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

const loadPosts = async (page = 1) => {
  if (isLoading || !hasMore) return;
  isLoading = true;

  const spinner = document.createElement("div");
  spinner.className = "loading-spinner";
  spinner.id = "loading-spinner";
  postList.after(spinner);

  const result = await getFollowingPosts(page);

  document.getElementById("loading-spinner")?.remove();

  if (page === 1) postList.innerHTML = "";

  if (!result || !result.data) {
    isLoading = false;
    return;
  }

  result.data.forEach((post) => {
    const card = createPostCard(post);
    postList.appendChild(card);
  });

  hasMore = result.pagination.hasMore;
  isLoading = false;

  if (hasMore) observer.observe(sentinel);
};

const sentinel = document.createElement("div");
sentinel.id = "sentinel";
postList.after(sentinel);

const observer = new IntersectionObserver(
  (entries) => {
    if (entries[0].isIntersecting && !isLoading && hasMore) {
      currentPage++;
      loadPosts(currentPage);
      observer.unobserve(entries[0].target);
    }
  },
  {
    root: null,
    rootMargin: "0px 0px 200px 0px",
    threshold: 0.1,
  },
);

const loadSuggestions = async (meInfo) => {
  if (!meInfo) return;

  const users = await getAllUsers();
  if (!users || !users.data) return;

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
  const { resetModal, getFormData, currentUser } = e.detail;
  const shareBtn = document.getElementById("share-btn");

  loadPosts();
  if (currentUser) loadSuggestions(currentUser);
});

document.addEventListener("postCreated", (e) => {
  currentPage = 1;
  hasMore = true;
  loadPosts(1);
});
