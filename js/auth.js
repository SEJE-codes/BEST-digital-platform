const API = "http://localhost:5000/api";

async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("Enter email and password");
    return;
  }

  try {
    const res = await fetch(API + "/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (data.token) {
      localStorage.setItem("token", data.token);
      window.location = "createAudit.html";
    } else {
      alert(data.message || "Login failed");
    }

  } catch (err) {
    console.error(err);
    alert("Server error");
  }
}

function savePage(page) {
  let history = JSON.parse(localStorage.getItem("navHistory")) || [];

  if (history[history.length - 1] !== page) {
    history.push(page);
  }

  localStorage.setItem("navHistory", JSON.stringify(history));
}

function goBack() {
  let history = JSON.parse(localStorage.getItem("navHistory")) || [];

  history.pop(); // remove current page
  const prev = history.pop(); // get previous

  localStorage.setItem("navHistory", JSON.stringify(history));

  if (prev) {
    window.location.href = prev;
  } else {
    window.location.href = "createAudit.html";
  }
}