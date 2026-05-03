const form = document.getElementById("form");
const usernameInput = document.getElementById("username");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const repeatPasswordInput = document.getElementById("repeat-password");
const errorMessage = document.getElementById("error-message");
const submitButton = document.getElementById("submit-button");

console.log("validation loaded");
redirectIfLoggedIn();

form.addEventListener("submit", async (e) => {
  console.log("submit triggered");
  e.preventDefault();
  let errors = [];

  if (usernameInput) {
    errors = getSignupFormErrors(
      usernameInput.value,
      emailInput.value,
      passwordInput.value,
      repeatPasswordInput.value,
    );

    if (errors.length === 0) {
      await registerApi(
        usernameInput.value,
        emailInput.value,
        passwordInput.value,
      );
    }
  } else {
    errors = getLoginFormErrors(emailInput.value, passwordInput.value);
    if (errors.length === 0) {
      await loginApi(emailInput.value, passwordInput.value);
    }
  }

  if (errors.length > 0) {
    errorMessage.innerText = errors.join("|");
  }
});

function getSignupFormErrors(username, email, password, repeatPassword) {
  let errors = [];

  if (username.trim() === "") {
    errors.push("請輸入使用者名稱");
    usernameInput.parentElement.classList.add("incorrect");
  } else if (username.length < 2 || username.length > 20) {
    errors.push("使用者名稱長度為2~20");
    usernameInput.parentElement.classList.add("incorrect");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email.trim() === "") {
    errors.push("請輸入電子郵件");
    emailInput.parentElement.classList.add("incorrect");
  } else if (!emailRegex.test(email)) {
    errors.push("請提供有效的電子郵件地址");
    emailInput.parentElement.classList.add("incorrect");
  }

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  if (password.trim() === "") {
    errors.push("請輸入密碼");
    passwordInput.parentElement.classList.add("incorrect");
  } else if (!passwordRegex.test(password)) {
    errors.push("密碼需至少8位字元，包含大小寫字母與數字");
    passwordInput.parentElement.classList.add("incorrect");
  }

  if (password !== repeatPassword) {
    errors.push("密碼不一致");
    passwordInput.parentElement.classList.add("incorrect");
    repeatPasswordInput.parentElement.classList.add("incorrect");
  }

  return errors;
}

const getLoginFormErrors = (email, password) => {
  let errors = [];

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email.trim() === "") {
    errors.push("請輸入電子郵件");
    emailInput.parentElement.classList.add("incorrect");
  } else if (!emailRegex.test(email)) {
    errors.push("email 格式不正確");
    emailInput.parentElement.classList.add("incorrect");
  }

  if (password.trim() === "") {
    errors.push("請輸入密碼");
    passwordInput.parentElement.classList.add("incorrect");
  }

  return errors;
};

const allInputs = Array.from(document.querySelectorAll("input"));
allInputs.forEach((input) => {
  input.addEventListener("input", () => {
    if (input.parentElement.classList.contains("incorrect")) {
      input.parentElement.classList.remove("incorrect");
      errorMessage.innerText = "";
    }
  });
});

document.querySelectorAll(".toggle-password").forEach((btn) => {
  btn.addEventListener("click", () => {
    const wrapper = btn.closest(".password-wrapper");
    const input = wrapper.querySelector("input");
    const isHidden = input.type === "password";
    input.type = isHidden ? "text" : "password";
    wrapper.classList.toggle("password-visible", isHidden);
  });
});
