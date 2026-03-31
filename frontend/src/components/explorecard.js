const createExploreCard = (post) => {
  const card = document.createElement("div");
  card.className = "explore-card";

  card.innerHTML = `
        <img class="explore-image" src="${post.image}" alt="${post.user.username}"/>

    `;

  return card;
};
