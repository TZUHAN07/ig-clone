const sidebarContainer = document.querySelector(".sidebar-container");
const modalContainer = document.querySelector(".modal-container");

function loadSidebar() {
  if (!sidebarContainer) return;

  const sidebar = document.createElement("nav");
  sidebar.className = "sidebar";

  sidebar.innerHTML = `
      <div class="logo">
          <a href="index.html">
            <svg
              role="img"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077"
              />
            </svg>
          </a>
      </div>

      <ul class="nav-menu">
        <li class="home">
          <a href="index.html">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#e8eaed"
            >
              <path
                d="M160-120v-480l320-240 320 240v480H560v-280H400v280H160Z"
              />
            </svg>
            <span>Home</span>
          </a>
        </li>
        <li class="explore">
          <a href="explore.html" class="nav-action">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#e8eaed"
            >
              <path
                d="m300-300 280-80 80-280-280 80-80 280Zm180-120q-25 0-42.5-17.5T420-480q0-25 17.5-42.5T480-540q25 0 42.5 17.5T540-480q0 25-17.5 42.5T480-420Zm0 340q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"
              />
            </svg>
            <span>Explore</span>
          </a>
        </li>

        <li class="search">
          <button class="search-btn nav-action">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#e8eaed"
            >
              <path
                d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"
              />
            </svg>
            <span>Search</span>
          </button>
        </li>
        <li class="messages">
          <a href="chat.html" class="nav-action">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M568.4 37.7C578.2 34.2 589 36.7 596.4 44C603.8 51.3 606.2 62.2 602.7 72L424.7 568.9C419.7 582.8 406.6 592 391.9 592C377.7 592 364.9 583.4 359.6 570.3L295.4 412.3C290.9 401.3 292.9 388.7 300.6 379.7L395.1 267.3C400.2 261.2 399.8 252.3 394.2 246.7C388.6 241.1 379.6 240.7 373.6 245.8L261.2 340.1C252.1 347.7 239.6 349.7 228.6 345.3L70.1 280.8C57 275.5 48.4 262.7 48.4 248.5C48.4 233.8 57.6 220.7 71.5 215.7L568.4 37.7z"/></svg>
            <span>Messages</span>
          </a>
        </li>
        <li class="create">
          <button class="create-btn nav-action">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#e8eaed"
            >
              <path
                d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"
              />
            </svg>
            <span>Create</span>
          </button>
        </li>
        <li class="profile"></li>
      </ul>

      <div class="sidebar-bottom">
          <button class="logout-btn nav-action">
             <svg 
                xmlns="http://www.w3.org/2000/svg" 
                height="24px" 
                viewBox="0 -960 960 960" 
                width="24px" 
                fill="#e8eaed"
                >
                <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"
                />
                </svg>
             <span>Logout</span>
          </button>
      </div>
    `;

  sidebarContainer.appendChild(sidebar);

  loadSearchPanel();
  loadMobileTopNav();
  loadBottomNav();
  loadModal();
  loadLogout();
  // 使用 setTimeout 確保 DOM 已載入完成後再 dispatch event
  loadProfile().then((userData) => {
    setTimeout(() => {
      document.dispatchEvent(
        new CustomEvent("sidebarLoaded", {
          detail: { resetModal, getFormData, currentUser: userData },
        }),
      );
    }, 0);
  });
}

function loadModal() {
  const modal = document.createElement("div");
  modal.id = "create-modal";
  modal.className = "modal-overlay hidden";

  modal.innerHTML = `
     <div class="create-post">
          <div class="modal-step" id="step-1">
        <div class="new-post-header">
          <button class="close-btn" id="close-modal">✕</button>
          <span class="header-text">New Post</span>
          <span class="next-btn" id="next-btn" data-disabled="true">Next</span>
        </div>

        <div class="post-image-area">
          <img id="image-preview" src="" alt="" class="hidden" />
          <label for="image-input" class="upload-label">
            <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="currentColor">
              <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/>
            </svg>
            <span>Select photo</span>
          </label>
          <input type="file" id="image-input" accept="image/*"  class="hidden"/>
        </div>
      </div>

        <div class="modal-step hidden" id="step-2">
        <div class="new-post-header">
          <button class="back-btn" id="back-btn">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
              <path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z"/>
            </svg>
          </button>
          <span class="header-text">New Post</span>
          <button class="publish-btn" id="publish-btn">Share</button>
        </div>

        <div class="step2-body">
          <img id="image-thumbnail" src="" alt="" />
          <textarea id="post-caption" placeholder="Add a caption..."></textarea>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // modal 插入後才選取元素，這時 DOM 已存在
  const createBtn = document.querySelector(".create-btn");
  const closeBtn = document.getElementById("close-modal");
  const nextBtn = document.getElementById("next-btn");
  const backBtn = document.getElementById("back-btn");
  const imageInput = document.getElementById("image-input");
  const imagePreview = document.getElementById("image-preview");
  const imageThumbnail = document.getElementById("image-thumbnail");
  const uploadLabel = document.querySelector(".upload-label");
  const step1 = document.getElementById("step-1");
  const step2 = document.getElementById("step-2");
  const shareBtn = document.getElementById("publish-btn");

  const goToStep2 = () => {
    step1.classList.add("hidden");
    step2.classList.remove("hidden");
  };

  const goToStep1 = () => {
    step2.classList.add("hidden");
    step1.classList.remove("hidden");
  };

  createBtn.addEventListener("click", () => {
    modal.classList.remove("hidden");
  });

  closeBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
    resetModal();
  });

  nextBtn.addEventListener("click", () => {
    if (nextBtn.dataset.disabled === "true") return;
    goToStep2();
  });

  backBtn.addEventListener("click", () => {
    goToStep1();
  });

  imageInput.addEventListener("change", () => {
    if (!imageInput.files[0]) return;
    const url = URL.createObjectURL(imageInput.files[0]);
    imagePreview.src = url;
    imageThumbnail.src = url;
    imagePreview.classList.remove("hidden");
    uploadLabel.classList.add("hidden");
    nextBtn.dataset.disabled = "false";
  });

  imagePreview.addEventListener("click", () => {
    imageInput.click();
  });

  const bottomCreateBtn = document.querySelector(".bottom-create-btn");
  if (bottomCreateBtn) {
    bottomCreateBtn.addEventListener("click", () => {
      modal.classList.remove("hidden");
    });
  }

  shareBtn.addEventListener("click", async () => {
    if (shareBtn.disabled) return;

    const formData = getFormData();
    if (!formData) return;

    shareBtn.disabled = true;
    shareBtn.textContent = "Sharing...";

    const res = await createPost(formData);

    if (res && res.success) {
      modal.classList.add("hidden");
      resetModal();

      document.dispatchEvent(
        new CustomEvent("postCreated", { detail: res.data }),
      );
    } else {
      shareBtn.disabled = false;
      shareBtn.textContent = "Share";
    }
  });
}

const resetModal = () => {
  const imageInput = document.getElementById("image-input");
  const imagePreview = document.getElementById("image-preview");
  const imageThumbnail = document.getElementById("image-thumbnail");
  const uploadLabel = document.querySelector(".upload-label");
  const postCaption = document.getElementById("post-caption");
  const nextBtn = document.getElementById("next-btn");
  const step1 = document.getElementById("step-1");
  const step2 = document.getElementById("step-2");
  const shareBtn = document.getElementById("publish-btn");

  imageInput.value = "";
  imagePreview.src = "";
  imageThumbnail.src = "";
  imagePreview.classList.add("hidden");
  uploadLabel.classList.remove("hidden");
  postCaption.value = "";
  nextBtn.dataset.disabled = "true";
  nextBtn.classList.remove("active");
  step1.classList.remove("hidden");
  step2.classList.add("hidden");
  shareBtn.disabled = false;
  shareBtn.textContent = "Share";
};

function getFormData() {
  const imageInput = document.getElementById("image-input");
  const postCaption = document.getElementById("post-caption");

  const file = imageInput.files[0];
  const caption = postCaption.value;

  if (!file) {
    alert("choose photo");
    return null;
  }
  if (!caption.trim()) {
    alert("enter caption");
    return null;
  }

  const formData = new FormData();
  formData.append("media", file);
  formData.append("content", caption);

  return formData;
}

const createProfileAvatar = (user) => {
  const navAvatar = document.createElement("a");
  navAvatar.href = "profile.html";
  navAvatar.className = "nav-action";

  navAvatar.innerHTML = `
    <img class="nav-avatar " src="${user.avatar}" alt="${user.username}"/>
    <span>Profile</span>
    `;

  return navAvatar;
};

const loadProfile = async () => {
  const profile = document.querySelector(".profile");
  if (!profile) return;

  const user = await getCachedMe();
  if (!user || !user.data) return;

  const avatar = createProfileAvatar(user.data);
  profile.appendChild(avatar);
  return user.data;
};

const loadLogout = () => {
  const logout = document.querySelector(".logout-btn");
  logout.addEventListener("click", () => {
    clearCachedMe();
    removeToken();
    window.location.href = "login.html";
  });
};

const loadSearchPanel = () => {
  const panel = document.createElement("div");
  panel.className = "search-panel";

  panel.innerHTML = `  
    <div class="search-panel-header">
    <h2>Search</h2>
    <button class="search-close-btn">✕</button>
    </div>

    <div class="search-wrapper">
    <input type="text" class="search-input" placeholder="Search" />
            <button class="input-close-btn">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="10" height="10">
    <path d="M18 6L6 18M6 6l12 12" stroke="white" stroke-width="3" stroke-linecap="round" fill="none"/>
  </svg>
            </button>
    </div >
    <div class="search-results"></div>
    `;

  sidebarContainer.appendChild(panel);

  const sidebar = document.querySelector(".sidebar");
  const searchBtn = document.querySelector(".search-btn");
  const closeBtn = panel.querySelector(".search-close-btn");
  const searchInput = panel.querySelector(".search-input");
  const searchResults = panel.querySelector(".search-results");
  const inputCloseBtn = panel.querySelector(".input-close-btn");

  let isOpen = false;

  const openPanel = () => {
    isOpen = true;
    panel.classList.add("open");
    sidebar.classList.add("sidebar-collapsed");
    searchInput.focus();
  };

  const closePanel = () => {
    isOpen = false;
    panel.classList.remove("open");
    sidebar.classList.remove("sidebar-collapsed");
    searchInput.value = "";
    searchResults.innerHTML = "";
  };

  searchBtn.addEventListener("click", () => {
    if (isOpen) {
      closePanel();
    } else {
      openPanel();
    }
  });

  closeBtn.addEventListener("click", () => {
    closePanel();
  });

  inputCloseBtn.addEventListener("click", () => {
    searchInput.value = "";
    searchResults.innerHTML = "";
    searchInput.focus();
  });

  document.addEventListener("click", (e) => {
    if (!isOpen) return;
    if (panel.contains(e.target) || searchBtn.contains(e.target)) return;

    closePanel();
  });

  setupSearchInput(searchInput, searchResults);
};
const setupSearchInput = (inputEl, resultsEl) => {
  let debounceTimer = null;

  inputEl.addEventListener("input", () => {
    clearTimeout(debounceTimer);
    const query = inputEl.value.trim();

    if (!query) {
      resultsEl.innerHTML = "";
      return;
    }

    debounceTimer = setTimeout(async () => {
      const users = await searchUsers(query);
      resultsEl.innerHTML = "";

      if (!users || !users.success || users.data.length === 0) {
        resultsEl.innerHTML = `<p class="search-no-result">No results found.</p>`;
      } else {
        users.data.forEach((user) => {
        const card = document.createElement("a");
        card.href = `profile.html?id=${user._id}`;
        card.className = "search-result-card";
        card.innerHTML = `
        <div class="result-card">
        <div class="result-info">
          <img src="${user.avatar}" alt="${user.username}" />
          <span>${user.username}</span>
        </div>
        </div>
        `;

        resultsEl.appendChild(card);
      });
      }
    }, 300);
  });
}
const loadMobileTopNav = () => {
  const isHomePage =
    window.location.pathname.endsWith("index.html") ||
    window.location.pathname === "/";
  if (!isHomePage) return;

  const topNav = document.createElement("header");
  topNav.className = "mobile-top-nav";

  topNav.innerHTML = `
    <a href="index.html" class="mobile-logo">
      <svg
              role="img"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077"
              />
            </svg>
    </a>
    <div class="mobile-search-wrapper">
    <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#e8eaed"
            >
              <path
                d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"
              />
            </svg>
      <input class="mobile-search-input" type="search" placeholder="Search" />
      
      <div class="mobile-search-results"></div>
    </div>
  `;

  document.body.prepend(topNav);

  const mobileInput = topNav.querySelector(".mobile-search-input");
  const mobileResults = topNav.querySelector(".mobile-search-results");
  setupSearchInput(mobileInput, mobileResults);
}

function loadBottomNav() {
  const bottomNav = document.createElement("nav");
  bottomNav.className = "bottom-nav";

  bottomNav.innerHTML = `
    <a href="index.html" class="bottom-nav-item">
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px">
        <path d="M160-120v-480l320-240 320 240v480H560v-280H400v280H160Z"/>
      </svg>
    </a>
    <a href="explore.html" class="bottom-nav-item">
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px">
        <path d="m300-300 280-80 80-280-280 80-80 280Zm180-120q-25 0-42.5-17.5T420-480q0-25 17.5-42.5T480-540q25 0 42.5 17.5T540-480q0 25-17.5 42.5T480-420Zm0 340q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"/>
      </svg>
    </a>
    <button class="bottom-nav-item bottom-create-btn">
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px">
        <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/>
      </svg>
    </button>
    <a href="chat.html" class="bottom-nav-item">
       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width="26" height="26">
    <path d="M568.4 37.7C578.2 34.2 589 36.7 596.4 44C603.8 51.3 606.2 62.2 602.7 72L424.7 568.9C419.7 582.8 406.6 592 391.9 592C377.7 592 364.9 583.4 359.6 570.3L295.4 412.3C290.9 401.3 292.9 388.7 300.6 379.7L395.1 267.3C400.2 261.2 399.8 252.3 394.2 246.7C388.6 241.1 379.6 240.7 373.6 245.8L261.2 340.1C252.1 347.7 239.6 349.7 228.6 345.3L70.1 280.8C57 275.5 48.4 262.7 48.4 248.5C48.4 233.8 57.6 220.7 71.5 215.7L568.4 37.7z"/>
  </svg>
    </a>
    <a href="profile.html" class="bottom-nav-item bottom-profile">
    </a>
    `;
  document.body.appendChild(bottomNav);

  bottomNav
    .querySelector(".bottom-create-btn")
    .addEventListener("click", () => {
      const modal = document.getElementById("create-modal");
      if (modal) modal.classList.remove("hidden");
    });

  loadBottomProfile(bottomNav);
}

async function loadBottomProfile(bottomNav) {
  const profileLink = bottomNav.querySelector(".bottom-profile");
  if (!profileLink) return;

  const user = await getCachedMe();
  if (user && user.data) {
    profileLink.innerHTML = `<img src="${user.data.avatar}" alt="${user.data.username}" />`;
  } else {
    profileLink.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px">
        <path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Z"/>
      </svg>
    `;
  }
}

loadSidebar();
