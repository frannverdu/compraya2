import navbar from "../components/navbar.js";
navbar.createNavbar();

window.onload = function () {
  navbar.updateCartButton();
};

function renderItemList() {
  const productList = document.getElementById("itemsList");
  productList.innerHTML = "";
  const items = JSON.parse(localStorage.getItem("cart") || "[]");
  if (items.length) {
    items.forEach((item) => {
      const listItem = document.createElement("div");
      listItem.classList.add("container-fluid");
      listItem.className =
        "container-fluid shadow-sm rounded border border-dark-subtle my-2";
      listItem.innerHTML = `
        <div class="row align-items-center">
            <div class="col-md-2 col-sm-3 col-lg-2 p-0">
                <img src="${item.item.image}" alt="${item.item.name}" class="item-image img-fluid rounded shadow-sm ">
            </div>
            <div class="col-lg-6 col-md-4 col-sm-9 p-3">
                <h5 class="mb-1">${item.item.name}</h5>
                <p class="price mb-0">Precio: $${item.item.price}</p>
            </div>
            <div class="col-md-3 col-sm-12 col-lg-2 p-2">
                <div class="input-group">
                    <span class="input-group-text">Cantidad</span>
                    <input type="number" class="form-control quantity-input" value="${item.quantity}" min="1" data-id="${item.item.id}">
                </div>
            </div>
            <div class="col-md-3 col-sm-12 col-lg-2 p-2">
                <button class="btn w-100 btn-sm btn-danger delete-btn" data-id="${item.item.id}">
                Eliminar
                </button>
            </div>
        </div>
      `;

      const deleteButton = listItem.querySelector(".delete-btn");
      deleteButton.addEventListener("click", () => {
        const itemId = deleteButton.dataset.id;
        const updatedItems = items.filter((r) => r.item.id !== itemId);
        localStorage.setItem("cart", JSON.stringify(updatedItems));
        renderItemList();
        navbar.updateCartButton();
      });

      productList.appendChild(listItem);
    });
    const actions = document.getElementById("actions");
    actions.innerHTML = `
      <button class="btn outlined btn-lg btn-outline-primary" id="cancelBtn">
        Cancelar
      </button>
      <button class="btn btn-lg btn-primary" id="continueBtn">
        Continuar
      </button>
    `;
  } else {
    const actions = document.getElementById("actions");
    actions.innerHTML = "";
    const emptyCartCard = `
    <div class="card text-center mt-3">
      <div class="card-body">
        <h5 class="card-title">Carro vacío</h5>
        <p class="card-text">No hay artículos agregados al carro.</p>
      </div>
    </div>
  `;
    productList.innerHTML = emptyCartCard;
  }
}

renderItemList();


const cancelButton = document.getElementById("cancelBtn");
const continueButton = document.getElementById("continueBtn");

if (cancelButton && continueButton) {
  cancelButton.addEventListener("click", () => {
    window.location.href = "/index.html";
  });
  continueButton.addEventListener("click", () => {
    window.open('https://link.mercadopago.com.ar/fverdu', "_blank");
  });
}
