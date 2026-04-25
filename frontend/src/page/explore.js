let currentUser = null;
const exploreList = document.querySelector(".explore-list");

// const token = getToken();
// if (!token) {
//   setTimeout(() => {
//     window.location.href = "login.html";
//   }, 1500);
// }
requireAuth();

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

  const exploreSearchInput = document.querySelector(".explore-search-input");
  const cancelBtn = document.querySelector(".explore-search-cancel");

  cancelBtn.classList.add("hidden");

  if (exploreSearchInput && cancelBtn) {
    const params = new URLSearchParams(window.location.search);
    if (params.get("search") === "true") {
      exploreSearchInput.focus();
    }

    let debounceTimer = null;

    const restoreExplore = () => {
      exploreSearchInput.value = "";
      cancelBtn.classList.add("hidden");
      exploreList.style.display = "";
      exploreList.style.gridTemplateColumns = "";
      exploreList.innerHTML = "";

      loadExplorePosts();
    };

    exploreSearchInput.addEventListener("input", () => {
      clearTimeout(debounceTimer);
      const query = exploreSearchInput.value.trim();

      cancelBtn.classList.remove("hidden");

      if (!query) {
        exploreList.style.display = "";
        exploreList.style.gridTemplateColumns = "";  
        exploreList.innerHTML = "";
        loadExplorePosts();

        return;
      }

      debounceTimer = setTimeout(async () => {
        const data = await searchUsers(query);
        exploreList.innerHTML = "";
        exploreList.style.gridTemplateColumns = "1fr";

        if (!data || !data.success || data.data.length === 0) {
          exploreList.innerHTML = `<p class="search-no-result">No results found.</p>`;
          return;
        }
        exploreList.style.display = "";
        data.data.forEach((user) => {
          const card = document.createElement("a");
          card.href = `profile.html?id=${user._id}`;
          card.className = "explore-search-result";
          card.innerHTML = `
          <img src="${user.avatar}" alt="${user.username}" />
          <span>${user.username}</span>
        `;
          exploreList.appendChild(card);
        });
      }, 300);
    });

    cancelBtn.addEventListener("click", () => {
      restoreExplore();
      exploreSearchInput.blur();
    });
  }

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
