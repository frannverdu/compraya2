async function register(event) {
  event.preventDefault();
  
  // Obtener los valores del formulario
  const name = document.getElementById('name').value.trim();
  const userDate = document.getElementById('userDate').value;
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const repeatPassword = document.getElementById('repeatPassword').value;
  
  // Validaciones básicas
  if (!name || !email || !password || !repeatPassword) {
    showMessage('Por favor, completa todos los campos obligatorios', 'error');
    return;
  }
  
  // Validar que las contraseñas coincidan
  if (password !== repeatPassword) {
    showMessage('Las contraseñas no coinciden', 'error');
    return;
  }
  
  // Validar longitud mínima de contraseña
  if (password.length < 6) {
    showMessage('La contraseña debe tener al menos 6 caracteres', 'error');
    return;
  }
  
  // Separar nombre y apellido (asumo que están separados por espacio)
  const nameParts = name.split(' ');
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(' ') || firstName; // Si no hay apellido, usar el nombre
  
  // Preparar los datos para enviar
  const userData = {
    name: firstName,
    lastName: lastName,
    email: email,
    password: password
  };
  
  try {
    // Deshabilitar el botón de envío
    const submitBtn = event.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Registrando...';
    
    // Hacer la petición al endpoint
    const response = await fetch('http://localhost:3000/users/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    });
    
    const result = await response.json();
    
    if (response.ok) {
      // Registro exitoso
      showMessage('¡Usuario registrado exitosamente!', 'success');
      
      // Limpiar el formulario
      document.getElementById('name').value = '';
      document.getElementById('userDate').value = '';
      document.getElementById('email').value = '';
      document.getElementById('password').value = '';
      document.getElementById('repeatPassword').value = '';
      
      // Redirigir al login después de 2 segundos
      setTimeout(() => {
        window.location.href = './login.html';
      }, 2000);
      
    } else {
      // Error en el registro
      showMessage(result.message || 'Error al registrar usuario', 'error');
    }
    
  } catch (error) {
    showMessage('Error de conexión. Intenta nuevamente.', 'error');
  } finally {
    // Rehabilitar el botón
    const submitBtn = event.target.querySelector('button[type="submit"]');
    submitBtn.disabled = false;
    submitBtn.textContent = 'Registrarse';
  }
}

function showMessage(message, type) {
  // Remover mensaje anterior si existe
  const existingMessage = document.querySelector('.alert-message');
  if (existingMessage) {
    existingMessage.remove();
  }
  
  // Crear nuevo mensaje
  const messageDiv = document.createElement('div');
  messageDiv.className = `alert alert-${type === 'success' ? 'success' : 'danger'} alert-message`;
  messageDiv.textContent = message;
  
  // Insertar el mensaje antes del formulario
  const form = document.querySelector('form');
  form.parentNode.insertBefore(messageDiv, form);
  
  // Remover el mensaje después de 5 segundos
  setTimeout(() => {
    if (messageDiv.parentNode) {
      messageDiv.remove();
    }
  }, 5000);
}