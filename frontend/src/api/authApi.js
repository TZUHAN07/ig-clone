const { API_BASE_URL } = config;
const message = document.getElementById("error-message");

const loginApi = async function login(email, password) {
  try {
    const res = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
    const data = await res.json();

    if (data.success) {
      setToken(data.token);

      message.innerText = "登入成功，歡迎回來！";
      message.style.color = "#28a745";

      setTimeout(() => {
        window.location.href = "index.html";
      }, 1500);
    } else {
      alert(data.message);
    }
  } catch (err) {
    message.innerText = "登入失敗";
  }
};

const registerApi = async function register(username, email, password) {
  try {
    const res = await fetch(`${API_BASE_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        email,
        password,
      }),
    });
    const data = await res.json();
    console.log(data);

    if (data.success) {
      message.innerText = "註冊成功！正在為您跳轉...";
      message.style.color = "#28a745";

      setTimeout(() => {
        window.location.href = "login.html";
      }, 1500);
    } else {
      message.innerText = "伺服器連線失敗";
    }
  } catch (err) {
    console.log("註冊錯誤", err);
  }
};
