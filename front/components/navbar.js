const categoriesDropdown = [];

async function getCategories() {
  try {
    const response = await fetch("../data/categories.json");
    if (!response.ok) {
      throw new Error("Error al cargar el archivo JSON");
    }
    const data = await response.json();
    data.forEach((category) => {
      categoriesDropdown.push({ title: category.name, url: category.url });
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

await getCategories();

export function createNavbar() {
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
                Categorías
              </a>
              <ul class="dropdown-menu">
                ${categoriesDropdown
                  .map(
                    (category) => `
                  <li><a class="dropdown-item" href="${category.url}"> ${category.title} </a></li>
                `
                  )
                  .join("")}
              </ul>
            </li>
          </ul>
          <div class="d-flex justify-content-end" role="search">
            <button class="btn btn-outline-primary btn-sm me-2" id="carritoButton">
              Carrito
              <i class="fa-solid fa-cart-shopping fa-lg"></i>
            </button>
            <button class="btn btn-outline-secondary btn-sm" id="logoutButton">
              Cerrar sesión
              <i class="fa-solid fa-right-from-bracket fa-lg"></i>
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
    const logoutButton = document.getElementById("logoutButton");

    if (carritoButton) {
      carritoButton.addEventListener("click", () => {
        window.location.href = "../checkout/checkout.html";
      });
    }

    if (logoutButton) {
      logoutButton.addEventListener("click", () => {
        window.location.href = "../auth/login.html";
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

export default { createNavbar, updateCartButton };
