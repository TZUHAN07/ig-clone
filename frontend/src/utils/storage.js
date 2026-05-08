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

let _cachedMe = null;

const getCachedMe = async () => {
  if (_cachedMe) return _cachedMe; 
  const res = await getMe(); 
  if (res && res.data) {
    _cachedMe = res;
  }
  return _cachedMe;
};

const clearCachedMe = () => {
  _cachedMe = null; 
};
