const config = {
  API_BASE_URL:
    window.location.hostname === "localhost" && window.location.port !== "80"
      ? "http://localhost:3000"
      : "/api",
};
