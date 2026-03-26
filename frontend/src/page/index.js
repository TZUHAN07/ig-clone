const postList = document.querySelector(".post-list");
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
const loadPosts = async () => {
  postList.innerHTML = "<p style='text-align:center;'>貼文載入中...</p>";
  const posts = await getAllPosts();

  postList.innerHTML = "";

  posts.data.forEach((post) => {
    const card = createPostCard(post);
    postList.appendChild(card);
  });
};

loadPosts();
