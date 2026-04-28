const createExploreCard = (post) => {
  const card = document.createElement("div");
  card.className = "explore-card";

  card.innerHTML = `
        <img class="explore-image" src="${post.image}" alt="${post.user.username}"/>

    `;

  card.addEventListener("click", () => {
    if (window.innerWidth < 768) {
      window.location.href = `${basePath}post.html?id=${post._id}`;
    } else {
      openCommentModal(post);
    }
  });

  return card;
};
