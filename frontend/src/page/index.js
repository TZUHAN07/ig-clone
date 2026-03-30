const postList = document.querySelector(".post-list");
const profile = document.querySelector(".profile");
const createBtn = document.querySelector(".create-btn");
const modal = document.getElementById("create-modal");
const closeBtn = document.getElementById("close-modal");
const imageArea = document.querySelector(".post-image-area");
const imagePreview = document.getElementById("image-preview");
const imageInput = document.getElementById("image-input");
const postCaption = document.getElementById("post-caption");
const uploadLabel = document.querySelector(".upload-label");
const shareBtn = document.querySelector(".share-btn");
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

const resetModal = () => {
  imageInput.value = "";
  imagePreview.src = "";
  imagePreview.classList.add("hidden");
  uploadLabel.classList.remove("hidden");
  postCaption.value = "";
};

const loadPosts = async () => {
  postList.innerHTML = "<p style='text-align:center;'>貼文載入中...</p>";
  const posts = await getAllPosts();

  postList.innerHTML = "";

  posts.data.forEach((post) => {
    const card = createPostCard(post);
    postList.appendChild(card);
  });
};

const loadProfile = async () => {
  const user = await getMe();
  if (!user || !user.data) return;

  const avatar = createProfileAvatar(user.data);
  profile.appendChild(avatar);
};

createBtn.addEventListener("click", () => {
  modal.classList.remove("hidden");
});

closeBtn.addEventListener("click", () => {
  modal.classList.add("hidden");
  resetModal();
});

imageInput.addEventListener("change", () => {
  if (!imageInput.files[0]) return;
  imagePreview.src = URL.createObjectURL(imageInput.files[0]);
  imagePreview.classList.remove("hidden");
  uploadLabel.classList.add("hidden");
});

imagePreview.addEventListener("click", () => {
  imageInput.click();
});

shareBtn.addEventListener("click", async () => {
  const file = imageInput.files[0];
  const caption = postCaption.value;

  if (!file) {
    alert("choose photo");
    return;
  }
  if (!caption.trim()) {
    alert("enter caption");
    return;
  }

  const formData = new FormData();
  formData.append("image", file);
  formData.append("content", caption);

  const data = await createPost(formData);

  if (data && data.success) {
    modal.classList.add("hidden");
    resetModal();
    loadPosts();
  }
});

loadPosts();
loadProfile();
