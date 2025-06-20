import navbar from "../components/navbar.js";
navbar.createNavbar();
import { itemCard } from "../components/itemCard.js";
let globalCategory = null;

window.onload = function () {
  navbar.updateCartButton();
};

async function getCategories() {
  try {
    const response = await fetch("../data/categories.json");
    if (!response.ok) {
      throw new Error("Error al cargar el archivo JSON");
    }
    const data = await response.json();
    setCategoriesData(data);
  } catch (error) {
    console.error("Error:", error);
  }
}

await getCategories();

function renderCards(items) {
  const container = document.getElementById("items-container");
  let cardsHTML = "";
  items.forEach((item) => {
    cardsHTML += `
        <div class="col col-12 col-sm-6 col-md-6 col-lg-4 p-2">
            ${itemCard(item)}
        </div>
    `;
  });
  container.innerHTML = cardsHTML;

  items.forEach((item) => {
    const button = document.getElementById(`btn-${item.id}`);
    if (button) {
      button.addEventListener("click", function () {
        const quantityInput = document.getElementById(`quantity-${item.id}`);
        const quantity = quantityInput ? quantityInput.value : 1;
        addItemTocart(item, quantity);
      });
    }
  });
}

function addItemTocart(item, q) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existingItemIndex = cart.findIndex(
    (cartItem) => cartItem.item.id === item.id
  );
  if (existingItemIndex !== -1) {
    cart[existingItemIndex].quantity += Number(q);
  } else {
    cart.push({ item, quantity: Number(q) });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  confetti({
    particleCount: 100,
    spread: 70,
    position: {
      x: 50,
      y: 100,
    },
  });
  navbar.updateCartButton();
}

function addCategoryHeader(category) {
  const categoryHeaderDiv = document.getElementById("category-header");
  const title = document.getElementById("title");
  title.innerHTML = `Compra YA! - ${category.name}`;

  const categoryHTML = `
      <div class="d-flex align-items-center justify-content-between">
        <h3 class="m-0">${category.name} </h3>
        <h6 class="m-0">${category.items.length} items</h6>
      </div>
      <hr />
    `;
  categoryHeaderDiv.innerHTML += categoryHTML;
}

function setCategoriesData(data) {
  let categoryObject = null;
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const category = urlParams.get("category");
  if (category) {
    categoryObject = data.find((item) => item.id === category);
    globalCategory = categoryObject;
  } else {
    window.location = "/index.html";
  }

  addCategoryHeader(categoryObject);
  if (categoryObject) {
    renderCards(categoryObject.items);
  } else {
    console.error(`Categoría "${categoryId}" no encontrada.`);
  }
}

const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("input", (event) => {
  const query = event.target.value.toLowerCase();
  const filteredItems = globalCategory.items.filter((item) =>
    item.name.toLowerCase().includes(query)
  );
  renderCards(filteredItems);
});
