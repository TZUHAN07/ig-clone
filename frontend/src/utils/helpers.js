const formatTime = (createdAt) => {
  const time = new Date();
  const past = new Date(createdAt);
  const diff = time - past;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) {
    return `${seconds}s`;
  }
  if (minutes < 60) {
    return `${minutes}m `;
  }
  if (hours < 24) {
    return `${hours}h `;
  }
  if (days < 7) {
    return `${days}d`;
  }

  return `${past.getFullYear()}/${past.getMonth() + 1}/${past.getDate()}`;
};
