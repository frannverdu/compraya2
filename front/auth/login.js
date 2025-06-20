function login(event) {
  event.preventDefault();
  const userName = document.getElementById('user');
  sessionStorage.setItem('userName', userName.value);
  window.location.href = "../index.html";
}