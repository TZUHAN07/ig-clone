const basePath = window.location.pathname.replace(/[^/]*\.html$/, "");

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
    return `${minutes}m`;
  }
  if (hours < 24) {
    return `${hours}h`;
  }
  if (days < 7) {
    return `${days}d`;
  }

  return `${past.getFullYear()}/${past.getMonth() + 1}/${past.getDate()}`;
};

const formatClockTime = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleTimeString("zh-TW", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

const isSameDay = (isoA, isoB) => {
  const dateA = new Date(isoA).toDateString();
  const dateB = new Date(isoB).toDateString();
  return dateA === dateB;
};

const formatDateDivider = (iso) => {
  if (!iso) return "";

  const d = new Date(iso);
  const now = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const timeStr = formatClockTime(iso);

  if (isSameDay(d, now)) return `today ${timeStr}`;
  if (isSameDay(d, yesterday)) return `yesterday ${timeStr}`;

  return `${d.getMonth() + 1}/${d.getDate()} ${timeStr}`;
};
