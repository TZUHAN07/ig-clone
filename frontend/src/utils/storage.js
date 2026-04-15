const setToken = (token) => {
  return localStorage.setItem("token", token);
};

const getToken = () => {
  return localStorage.getItem("token");
};

const removeToken = () => {
  return localStorage.removeItem("token");
};

const requireAuth = () => {
  if (!getToken()) {
    window.location.href = "login.html";
    return false;
  }
  return true;
};

const redirectIfLoggedIn = () => {
  if (getToken()) {
    window.location.href = "index.html";
  }
};
