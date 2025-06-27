
async function login(event) {
  event.preventDefault();
  
  const emailInput = document.getElementById('user');
  const passwordInput = document.getElementById('password');
  const submitButton = event.target.querySelector('button[type="submit"]');
  
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  
  // Validación básica en frontend
  if (!email || !password) {
    showMessage('Por favor, completa todos los campos', 'error');
    return;
  }
  
  submitButton.disabled = true;
  submitButton.innerHTML = 'Ingresando...';
  
  try {
    const response = await fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      // Guardar información en sessionStorage
      sessionStorage.setItem('token', data.tokens.accessToken);
      sessionStorage.setItem('userName', data.user.nombre);
      sessionStorage.setItem('userEmail', data.user.email);
      
      window.location.href = "../index.html";
      
    } else {
      showMessage(data.message || 'Error en el login', 'error');
    }
    
  } catch (error) {
    showMessage('Ocurrió un error', 'error');
  } finally {
    // Rehabilitar botón
    submitButton.disabled = false;
    submitButton.innerHTML = 'Ingresar';
  }
}

// Función para mostrar mensajes al usuario
function showMessage(message, type = 'info') {
  // Remover mensaje anterior si existe
  const existingMessage = document.querySelector('.login-message');
  if (existingMessage) {
    existingMessage.remove();
  }
  
  // Crear nuevo mensaje
  const messageDiv = document.createElement('div');
  messageDiv.className = `alert login-message ${getAlertClass(type)} alert-dismissible fade show`;
  messageDiv.setAttribute('role', 'alert');
  messageDiv.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;
  
  // Insertar mensaje antes del formulario
  const cardBody = document.querySelector('.card-body');
  const form = cardBody.querySelector('form');
  cardBody.insertBefore(messageDiv, form);
  
  // Auto-remover mensaje después de 5 segundos
  setTimeout(() => {
    if (messageDiv && messageDiv.parentNode) {
      messageDiv.remove();
    }
  }, 5000);
}

// Función auxiliar para obtener la clase CSS del alert según el tipo
function getAlertClass(type) {
  switch (type) {
    case 'success':
      return 'alert-success';
    case 'error':
      return 'alert-danger';
    case 'warning':
      return 'alert-warning';
    default:
      return 'alert-info';
  }
}

// Función para verificar si el usuario ya está logueado
function checkIfLoggedIn() {
  const token = sessionStorage.getItem('accessToken');
  const userName = sessionStorage.getItem('userName');
  
  if (token && userName) {
    // Usuario ya está logueado, redirigir
    window.location.href = "../index.html";
  }
}

// Verificar al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  checkIfLoggedIn();
});