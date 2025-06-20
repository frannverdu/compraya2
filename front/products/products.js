import navbar from "../components/navbar.js";
import { itemCard } from "../components/itemCard.js";

// Crear navbar
navbar.createNavbar();

const API_URL = 'http://localhost:3000/products/products';
const FILTER_API_URL = 'http://localhost:3000/products/product/byparams';

// Variables globales
let allProducts = [];
let filteredProducts = [];
let isUsingBackendFilter = false;

// Función para obtener productos desde la API
async function fetchProducts(url) {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
    }
    
    const data = await response.json();
    
    return data;
  } catch (error) {
    console.error('Error al obtener productos:', error);
    return [];
  }
}

// Función para obtener productos filtrados desde backend
async function fetchFilteredProducts(filters) {
  try {
    const response = await fetch(FILTER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(filters)
    });
    
    if (!response.ok) {
      if (response.status === 400) {
        // No se encontraron productos
        return [];
      }
      throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
    }
    
    const data = await response.json();
    
    return data;
  } catch (error) {
    console.error('Error al obtener productos filtrados:', error);
    throw error;
  }
}

// Función para actualizar contador de productos
function updateProductCount(count) {
  const countElement = document.getElementById('product-count');
  if (countElement) {
    countElement.textContent = count;
  }
}

// Función para actualizar indicador de modo de filtro
function updateFilterMode(isBackend) {
  const modeElement = document.getElementById('filter-mode');
  if (modeElement) {
    if (isBackend) {
      modeElement.textContent = 'Filtro Backend';
      modeElement.className = 'badge bg-primary';
    } else {
      modeElement.textContent = 'Filtro Local';
      modeElement.className = 'badge bg-secondary';
    }
  }
}

// Función para mostrar/ocultar filtros activos
function updateActiveFilters(filters) {
  const activeFiltersDiv = document.getElementById('activeFilters');
  const filterSummary = document.getElementById('filterSummary');
  
  const summary = [];
  
  if (filters.categories && filters.categories.length > 0) {
    summary.push(`Categorías: ${filters.categories.join(', ')}`);
  }
  
  if (filters.names && filters.names.length > 0) {
    summary.push(`Nombres: ${filters.names.join(', ')}`);
  }
  
  if (filters.prices && filters.prices.length > 0) {
    summary.push(`Precios: ${filters.prices.join(', ')}`);
  }
  
  if (summary.length > 0) {
    filterSummary.textContent = summary.join(' | ');
    activeFiltersDiv.classList.remove('d-none');
  } else {
    activeFiltersDiv.classList.add('d-none');
  }
}

// Función para renderizar las cards
function renderCards(items) {
  const container = document.getElementById("items-container");
  
  if (!container) {
    console.error('No se encontró el contenedor items-container');
    return;
  }

  if (!items || items.length === 0) {
    container.innerHTML = `
      <div class="col-12 text-center py-5">
        <i class="fa-solid fa-box-open fa-3x text-muted mb-3"></i>
        <h3 class="text-muted">No se encontraron productos</h3>
        <p class="text-muted">Intenta ajustar los filtros de búsqueda</p>
      </div>
    `;
    updateProductCount(0);
    return;
  }

  let cardsHTML = "";
  items.forEach((item) => {
    cardsHTML += `
        <div class="col col-12 col-sm-6 col-md-6 col-lg-4 p-2">
            ${itemCard(item)}
        </div>
    `;
  });
  
  container.innerHTML = cardsHTML;
  updateProductCount(items.length);
}

// Función para ordenar productos
function sortProducts(products, sortBy) {
  if (!sortBy) return products;
  
  const sortedProducts = [...products];
  
  switch (sortBy) {
    case 'name':
      sortedProducts.sort((a, b) => 
        (a.name || a.nombre || '').localeCompare(b.name || b.nombre || '', 'es', { sensitivity: 'base' })
      );
      break;
      
    case 'name-desc':
      sortedProducts.sort((a, b) => 
        (b.name || b.nombre || '').localeCompare(a.name || a.nombre || '', 'es', { sensitivity: 'base' })
      );
      break;
      
    case 'price-low':
      sortedProducts.sort((a, b) => (a.price || a.precio || 0) - (b.price || b.precio || 0));
      break;
      
    case 'price-high':
      sortedProducts.sort((a, b) => (b.price || b.precio || 0) - (a.price || a.precio || 0));
      break;
      
    case 'newest':
      sortedProducts.sort((a, b) => (b.id || 0) - (a.id || 0));
      break;
      
    default:
      break;
  }
  
  return sortedProducts;
}

// Función para aplicar filtros locales (frontend)
function applyLocalFilters() {
  const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
  const sortBy = document.getElementById('sortFilter')?.value || '';
  
  // Filtrar por búsqueda
  if (!searchTerm.trim()) {
    filteredProducts = [...allProducts];
  } else {
    filteredProducts = allProducts.filter(product => {
      const name = (product.name || product.nombre || '').toLowerCase();
      const description = (product.description || product.descripcion || '').toLowerCase();
      const category = (product.category || product.categoria || '').toLowerCase();
      
      return name.includes(searchTerm) || 
             description.includes(searchTerm) || 
             category.includes(searchTerm);
    });
  }
  
  // Ordenar productos filtrados
  filteredProducts = sortProducts(filteredProducts, sortBy);
  
  isUsingBackendFilter = false;
  updateFilterMode(false);
  
  renderCards(filteredProducts);
}

// Función para aplicar filtros backend
async function applyBackendFilters() {
  try {
    // Recopilar filtros del formulario
    const filters = {};
    
    // Categorías seleccionadas
    const categories = [];
    document.querySelectorAll('input[type="checkbox"]:checked').forEach(checkbox => {
      categories.push(checkbox.value);
    });
    if (categories.length > 0) {
      filters.categories = categories;
    }
    
    // Rango de precios con autocompletado
    const minPriceInput = document.getElementById('minPrice');
    const maxPriceInput = document.getElementById('maxPrice');
    const minPrice = minPriceInput?.value.trim();
    const maxPrice = maxPriceInput?.value.trim();
    
    if (minPrice || maxPrice) {
      const prices = [];
      
      // Si solo se ingresa precio mínimo, autocompletar máximo con valor alto
      if (minPrice && !maxPrice) {
        maxPriceInput.value = '999999';
        prices.push(minPrice, '999999');
      }
      // Si solo se ingresa precio máximo, autocompletar mínimo con 0
      else if (!minPrice && maxPrice) {
        minPriceInput.value = '0';
        prices.push('0', maxPrice);
      }
      // Si se ingresan ambos valores
      else if (minPrice && maxPrice) {
        prices.push(minPrice, maxPrice);
      }
      
      if (prices.length > 0) {
        filters.prices = prices;
      }
    }
    
    // Nombres específicos
    const nameFilter = document.getElementById('nameFilter')?.value.trim();
    if (nameFilter) {
      // Dividir por comas y limpiar espacios
      const names = nameFilter.split(',').map(name => name.trim()).filter(name => name.length > 0);
      if (names.length > 0) {
        filters.names = names;
      }
    }
    
    // Si no hay filtros, cargar todos los productos
    if (Object.keys(filters).length === 0) {
      await loadProducts();
      return;
    }
    
    // Enviar filtros al backend
    const backendProducts = await fetchFilteredProducts(filters);
    
    // Aplicar ordenamiento local a los resultados del backend
    const sortBy = document.getElementById('sortFilter')?.value || '';
    filteredProducts = sortProducts(backendProducts, sortBy);
    
    isUsingBackendFilter = true;
    updateFilterMode(true);
    updateActiveFilters(filters);
    
    renderCards(filteredProducts);
    
  } catch (error) {
    console.error('Error al aplicar filtros backend:', error);
    showErrorMessage('Error al aplicar filtros. Intenta de nuevo.');
  }
}

// Función para limpiar todos los filtros
function clearAllFilters() {
  // Limpiar formulario de filtros
  document.getElementById('nameFilter').value = '';
  document.getElementById('minPrice').value = '';
  document.getElementById('maxPrice').value = '';
  
  // Desmarcar checkboxes
  document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
    checkbox.checked = false;
  });
  
  // Ocultar filtros activos
  document.getElementById('activeFilters').classList.add('d-none');
  
  // Cargar todos los productos
  loadProducts();
}

// Función para mostrar mensaje de carga
function showLoadingMessage() {
  const container = document.getElementById("items-container");
  if (container) {
    container.innerHTML = `
      <div class="col-12 text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
        <p class="mt-3 text-muted">Aplicando filtros...</p>
      </div>
    `;
  }
}

// Función para mostrar mensajes de error
function showErrorMessage(message) {
  const container = document.getElementById("items-container");
  if (container) {
    container.innerHTML = `
      <div class="col-12 text-center py-5">
        <i class="fa-solid fa-exclamation-triangle fa-3x text-warning mb-3"></i>
        <h3 class="text-muted">¡Ups! Algo salió mal</h3>
        <p class="text-muted">${message}</p>
        <button class="btn btn-primary" onclick="loadProducts()">
          <i class="fa-solid fa-refresh"></i> Reintentar
        </button>
      </div>
    `;
  }
}

// Función para manejar el toggle del ícono de filtros
function setupFilterToggle() {
  const toggleButton = document.getElementById('toggleFilters');
  const filterIcon = document.getElementById('filterIcon');
  const advancedFilters = document.getElementById('advancedFilters');
  
  if (toggleButton && filterIcon && advancedFilters) {
    advancedFilters.addEventListener('shown.bs.collapse', function () {
      filterIcon.classList.remove('fa-chevron-down');
      filterIcon.classList.add('fa-chevron-up');
    });
    
    advancedFilters.addEventListener('hidden.bs.collapse', function () {
      filterIcon.classList.remove('fa-chevron-up');
      filterIcon.classList.add('fa-chevron-down');
    });
  }
}

// Configurar delegación de eventos para botones
function setupEventDelegation() {
  const container = document.getElementById("items-container");
  
  if (container) {
    container.addEventListener('click', function(event) {
      if (event.target && event.target.id && event.target.id.startsWith('btn-')) {
        const itemId = event.target.id.replace('btn-', '');
        
        const item = filteredProducts.find(product => product.id.toString() === itemId);
        
        if (item) {
          const quantityInput = document.getElementById(`quantity-${itemId}`);
          const quantity = quantityInput ? parseInt(quantityInput.value) || 1 : 1;
          
          if (typeof addItemTocart === 'function') {
            addItemTocart(item, quantity);
          } else {
            console.warn('Función addItemTocart no encontrada');
            alert(`Producto "${item.name || item.nombre}" agregado al carrito (Cantidad: ${quantity})`);
          }
        } else {
          console.error('No se encontró el producto con ID:', itemId);
        }
      }
    });
  }
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

// Función principal para cargar productos
async function loadProducts() {
  try {
    const products = await fetchProducts(API_URL);
    allProducts = products;
    filteredProducts = [...products];
    isUsingBackendFilter = false;
    updateFilterMode(false);
    renderCards(filteredProducts);
  } catch (error) {
    console.error('Error al cargar productos:', error);
  }
}

// Configurar event listeners cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
  loadProducts();
  setupEventDelegation();
  setupFilterToggle();
  
  // Configurar búsqueda en tiempo real (solo filtro local)
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    let searchTimeout;
    
    searchInput.addEventListener('input', function() {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        if (!isUsingBackendFilter) {
          applyLocalFilters();
        }
      }, 300);
    });
  }
  
  // Configurar ordenamiento (funciona con ambos tipos de filtro)
  const sortFilter = document.getElementById('sortFilter');
  if (sortFilter) {
    sortFilter.addEventListener('change', function() {
      if (isUsingBackendFilter) {
        // Re-aplicar ordenamiento a productos del backend
        const sortBy = this.value;
        filteredProducts = sortProducts(filteredProducts, sortBy);
        renderCards(filteredProducts);
      } else {
        applyLocalFilters();
      }
    });
  }
  
  // Configurar botones de filtros avanzados
  const applyFiltersBtn = document.getElementById('applyFilters');
  const clearFiltersBtn = document.getElementById('clearFilters');
  
  if (applyFiltersBtn) {
    applyFiltersBtn.addEventListener('click', applyBackendFilters);
  }
  
  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener('click', clearAllFilters);
  }
});