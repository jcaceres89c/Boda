document.getElementById('confirm-form')?.addEventListener('submit', async function (e) {
  e.preventDefault();

  const input = document.getElementById('name-input');
  const error = document.getElementById('error-message');
  const name = input.value.trim();

  if (!name) {
    error.textContent = 'Por favor, escribe tu nombre.';
    return;
  }

  try {
    const response = await fetch('/validar-nombre', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ nombre: name })
    });

    const result = await response.json();

    if (result.valido) {
      window.location.href = `/invitados/savetheday.html?nombre=${encodeURIComponent(name)}`;
    } else {
      error.textContent = 'Nombre no encontrado. Intenta con el nombre tal como aparece en la invitación.';
    }
  } catch (err) {
    console.error(err);
    error.textContent = 'Error al validar el nombre. Intenta nuevamente más tarde.';
  }
});
