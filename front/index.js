import navbar from "./components/navbar.js";

navbar.createNavbar();

const API_URL = 'http://localhost:3000/products/products';

window.onload = function () {
  navbar.updateCartButton();
};

async function getRandomItems() {
  try {
    const response = await fetch(API_URL);
    
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
    }
    
    const products = await response.json();
    
    if (!products || products.length === 0) {
      console.warn('No se encontraron productos en el backend');
      showFallbackCarousel();
      return;
    }

    // Seleccionar 3 productos aleatorios
    const selectedItems = [];
    const availableProducts = [...products]; // Copia para no modificar el original
    
    const itemsToSelect = Math.min(3, availableProducts.length);
    
    for (let i = 0; i < itemsToSelect; i++) {
      const randomIndex = Math.floor(Math.random() * availableProducts.length);
      const randomItem = availableProducts.splice(randomIndex, 1)[0];
      selectedItems.push(randomItem);
    }

    // Agregar items al carousel
    let activeItem = true;
    selectedItems.forEach((item) => {
      addCarouselItem(item, activeItem);
      activeItem = false;
    });

  } catch (error) {
    console.error("Error al obtener productos del backend:", error);
    showErrorCarousel();
  }
}

function addCarouselItem(item, activeItem) {
  const carousel = document.getElementById("carousel");

  if (!carousel) {
    console.error('No se encontró el elemento carousel');
    return;
  }

  const carouselItemHTML = `
    <div class="carousel-item ${activeItem ? "active" : ""}">
      <img src="${item.image}" class="carousel-image w-100 img-fluid" alt="${item.name}" onerror="this.src='https://via.placeholder.com/800x400?text=Imagen+No+Disponible'">
      <div class="card carousel-caption d-none d-md-block bg-dark mx-2">
        <h5>${item.name}</h5>
        <p class="mb-1">${item.description}</p>
        <p class="mb-0"><strong class="text-warning">${item.price}</strong></p>
      </div>
    </div>
  `;
  
  carousel.insertAdjacentHTML("beforeend", carouselItemHTML);
}

// Función para mostrar carousel de fallback cuando no hay productos
function showFallbackCarousel() {
  const carousel = document.getElementById("carousel");
  
  if (!carousel) return;
  
  const fallbackHTML = `
    <div class="carousel-item active">
      <div class="d-flex align-items-center justify-content-center bg-light" style="height: 400px;">
        <div class="text-center text-muted">
          <i class="fa-solid fa-box-open fa-3x mb-3"></i>
          <h4>No hay productos disponibles</h4>
          <p>Próximamente nuevos productos</p>
        </div>
      </div>
    </div>
  `;
  
  carousel.innerHTML = fallbackHTML;
}

// Función para mostrar error en el carousel
function showErrorCarousel() {
  const carousel = document.getElementById("carousel");
  
  if (!carousel) return;
  
  const errorHTML = `
    <div class="carousel-item active">
      <div class="d-flex align-items-center justify-content-center bg-danger-subtle" style="height: 400px;">
        <div class="text-center text-danger">
          <i class="fa-solid fa-exclamation-triangle fa-3x mb-3"></i>
          <h4>Error al cargar productos</h4>
          <p>No se pudieron obtener los productos del servidor</p>
          <button class="btn btn-outline-danger" onclick="location.reload()">
            <i class="fa-solid fa-refresh"></i> Reintentar
          </button>
        </div>
      </div>
    </div>
  `;
  
  carousel.innerHTML = errorHTML;
}

// Inicializar
getRandomItems();