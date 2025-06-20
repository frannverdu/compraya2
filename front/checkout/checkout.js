import navbar from "../components/navbar.js";

navbar.createNavbar();

const SALES_API_URL = 'http://localhost:3000/sales/sale';

window.onload = function () {
  navbar.updateCartButton();
};

// Función para registrar la venta en el backend
async function registerSale(saleData) {
  try {
    const response = await fetch(SALES_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(saleData)
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
    }

    const result = await response.json();
    console.log('Venta registrada exitosamente:', result);
    return result;
  } catch (error) {
    console.error('Error al registrar la venta:', error);
    throw error;
  }
}

// Función para procesar la compra
async function processPurchase() {
  try {
    const items = JSON.parse(localStorage.getItem("cart") || "[]");
    
    if (items.length === 0) {
      alert('El carrito está vacío');
      return;
    }

    // Obtener datos del formulario de dirección
    const address = document.getElementById('addressInput')?.value.trim();
    if (!address) {
      alert('Por favor ingresa una dirección de entrega');
      document.getElementById('addressInput')?.focus();
      return;
    }

    // Calcular total
    const total = items.reduce((sum, item) => {
      return sum + (item.item.price * item.quantity);
    }, 0);

    // Preparar datos de la venta según tu backend
    const saleData = {
      userId: 1, // Por ahora hardcodeado, puedes cambiarlo por el usuario logueado
      date: new Date().toISOString(),
      total: total,
      address: address,
      products: items.map(item => ({
        id: item.item.id,
        precio: item.item.price || item.item.precio,
        cantidad: item.quantity
      }))
    };

    // Mostrar loading
    showProcessingMessage();

    // Registrar venta en el backend
    const saleResult = await registerSale(saleData);

    // Si todo sale bien, limpiar carrito y redirigir
    localStorage.removeItem("cart");
    navbar.updateCartButton();

    // Redirigir a MercadoPago
    window.open('https://link.mercadopago.com.ar/fverdu', "_blank");
    
    // Mostrar mensaje de éxito
    showSuccessMessage(saleResult);

  } catch (error) {
    console.error('Error al procesar la compra:', error);
    showErrorMessage('Error al procesar la compra. Intenta de nuevo.');
  }
}

// Función para mostrar mensaje de procesamiento
function showProcessingMessage() {
  const actions = document.getElementById("actions");
  if (actions) {
    actions.innerHTML = `
      <div class="text-center">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Procesando...</span>
        </div>
        <p class="mt-2 text-muted">Procesando tu compra...</p>
      </div>
    `;
  }
}

// Función para mostrar mensaje de éxito
function showSuccessMessage(saleResult) {
  const itemsList = document.getElementById("itemsList");
  const actions = document.getElementById("actions");
  
  if (itemsList && actions) {
    itemsList.innerHTML = `
      <div class="card text-center mt-3 border-success">
        <div class="card-body">
          <i class="fa-solid fa-check-circle fa-3x text-success mb-3"></i>
          <h5 class="card-title text-success">¡Compra procesada exitosamente!</h5>
          <p class="card-text">Tu venta ha sido registrada con ID: <strong>${saleResult.id || 'N/A'}</strong></p>
          <p class="text-muted">Se abrió MercadoPago en una nueva ventana para completar el pago.</p>
        </div>
      </div>
    `;
    
    actions.innerHTML = `
      <button class="btn btn-lg btn-primary" onclick="window.location.href='/index.html'">
        <i class="fa-solid fa-home"></i> Volver al inicio
      </button>
    `;
  }
}

// Función para mostrar mensaje de error
function showErrorMessage(message) {
  const actions = document.getElementById("actions");
  if (actions) {
    actions.innerHTML = `
      <div class="alert alert-danger text-center" role="alert">
        <i class="fa-solid fa-exclamation-triangle"></i>
        ${message}
      </div>
      <button class="btn btn-lg btn-outline-primary" onclick="renderItemList()">
        <i class="fa-solid fa-refresh"></i> Reintentar
      </button>
    `;
  }
}

function renderItemList() {
  const productList = document.getElementById("itemsList");
  productList.innerHTML = "";
  const items = JSON.parse(localStorage.getItem("cart") || "[]");
  
  if (items.length) {
    items.forEach((item) => {
      const listItem = document.createElement("div");
      listItem.classList.add("container-fluid");
      listItem.className = "container-fluid shadow-sm rounded border border-dark-subtle my-2";
      listItem.innerHTML = `
        <div class="row align-items-center">
            <div class="col-md-2 col-sm-3 col-lg-2 p-0">
                <img src="${item.item.image}" alt="${item.item.name}" class="item-image img-fluid rounded shadow-sm">
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

    // Calcular total
    const total = items.reduce((sum, item) => {
      return sum + (item.item.price * item.quantity);
    }, 0);

    const actions = document.getElementById("actions");
    actions.innerHTML = `
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h4 class="mb-0">Total: <span class="text-primary">${total.toFixed(2)}</span></h4>
      </div>
      
      <!-- Formulario de dirección -->
      <div class="card mb-3">
        <div class="card-header">
          <h6 class="mb-0"><i class="fa-solid fa-map-marker-alt"></i> Datos de entrega</h6>
        </div>
        <div class="card-body">
          <div class="mb-3">
            <label for="addressInput" class="form-label">Dirección de entrega *</label>
            <textarea 
              class="form-control" 
              id="addressInput" 
              rows="3" 
              placeholder="Ingresa tu dirección completa..."
              required
            ></textarea>
            <div class="form-text">Incluye calle, número, piso/depto, ciudad y código postal</div>
          </div>
        </div>
      </div>
      
      <div class="d-flex gap-2">
        <button class="btn outlined btn-lg btn-outline-primary flex-fill" id="cancelBtn">
          <i class="fa-solid fa-times"></i> Cancelar
        </button>
        <button class="btn btn-lg btn-primary flex-fill" id="continueBtn">
          <i class="fa-solid fa-credit-card"></i> Continuar
        </button>
      </div>
    `;

    // Agregar event listeners a los nuevos botones
    setupActionButtons();
    
  } else {
    const actions = document.getElementById("actions");
    actions.innerHTML = "";
    const emptyCartCard = `
      <div class="card text-center mt-3">
        <div class="card-body">
          <i class="fa-solid fa-shopping-cart fa-3x text-muted mb-3"></i>
          <h5 class="card-title">Carro vacío</h5>
          <p class="card-text">No hay artículos agregados al carro.</p>
          <a href="/index.html" class="btn btn-primary">
            <i class="fa-solid fa-shopping-bag"></i> Ir a comprar
          </a>
        </div>
      </div>
    `;
    productList.innerHTML = emptyCartCard;
  }
}

function setupActionButtons() {
  const cancelButton = document.getElementById("cancelBtn");
  const continueButton = document.getElementById("continueBtn");

  if (cancelButton) {
    cancelButton.addEventListener("click", () => {
      if (confirm('¿Estás seguro de cancelar la compra?')) {
        window.location.href = "/index.html";
      }
    });
  }

  if (continueButton) {
    continueButton.addEventListener("click", () => {
      if (confirm('¿Confirmas que quieres proceder con la compra?')) {
        processPurchase();
      }
    });
  }
}

// Inicializar
renderItemList();