export function createNavbar() {
  // Verificar si hay una sesión activa
  const userName = sessionStorage.getItem("userName");
  const isLoggedIn = userName && userName.trim() !== "";
  
  // Cambiar texto y icono del botón según el estado de la sesión
  const authButtonText = isLoggedIn ? "Cerrar sesión" : "Iniciar sesión";
  const authButtonIcon = isLoggedIn ? "fa-right-from-bracket" : "fa-right-to-bracket";
  
  const navbarHTML = `
    <nav class="navbar navbar-expand-lg bg-body-tertiary shadow-sm">
      <div class="container-fluid">
        <a class="navbar-brand" href="/index.html">Compra YA!</a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarScroll"
          aria-controls="navbarScroll"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarScroll">
          <ul
            class="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll"
            style="--bs-scroll-height: 100px"
          >
            <li class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Productos
              </a>
              <ul class="dropdown-menu">
                  <li><a class="dropdown-item" href="/products/products.html"> Todos </a></li>
              </ul>
            </li>
          </ul>
          <div class="d-flex justify-content-end" role="search">
            <button class="btn btn-outline-primary btn-sm me-2" id="carritoButton">
              Carrito
              <i class="fa-solid fa-cart-shopping fa-lg"></i>
            </button>
            <button class="btn btn-outline-secondary btn-sm" id="authButton">
              ${authButtonText}
              <i class="fa-solid ${authButtonIcon} fa-lg"></i>
            </button>
          </div>
        </div>
      </div>
    </nav>
  `;

  const navbarContainer = document.getElementById("navbar-container");
  if (navbarContainer) {
    navbarContainer.innerHTML = navbarHTML;

    const carritoButton = document.getElementById("carritoButton");
    const authButton = document.getElementById("authButton");

    if (carritoButton) {
      carritoButton.addEventListener("click", () => {
        window.location.href = "../checkout/checkout.html";
      });
    }

    if (authButton) {
      authButton.addEventListener("click", () => {
        if (isLoggedIn) {
          sessionStorage.removeItem("userName");
          sessionStorage.removeItem("userEmail");
          sessionStorage.removeItem("token");
          window.location.href = "../auth/login.html";
        } else {
          // Si no está logueado, ir a login
          window.location.href = "../auth/login.html";
        }
      });
    }
  }
}

function updateCartButton() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const totalItems = cart.reduce(
    (sum, cartItem) => sum + Number(cartItem.quantity),
    0
  );

  const cartButton = document.getElementById("carritoButton");
  if (cartButton) {
    cartButton.innerHTML = `
      Carrito (${totalItems})
      <i class="fa-solid fa-cart-shopping fa-lg"></i>
    `;
  }
}

// Nueva función para actualizar el estado del botón de autenticación
function updateAuthButton() {
  const userName = sessionStorage.getItem("userName");
  const isLoggedIn = userName && userName.trim() !== "";
  
  const authButton = document.getElementById("authButton");
  if (authButton) {
    const authButtonText = isLoggedIn ? "Cerrar sesión" : "Iniciar sesión";
    const authButtonIcon = isLoggedIn ? "fa-right-from-bracket" : "fa-right-to-bracket";
    
    authButton.innerHTML = `
      ${authButtonText}
      <i class="fa-solid ${authButtonIcon} fa-lg"></i>
    `;
  }
}

export default { createNavbar, updateCartButton, updateAuthButton };