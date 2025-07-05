// modal.js
document.addEventListener('DOMContentLoaded', () => {
  const btnConfirmar  = document.querySelector('.boton-confirmar');
  const modal         = document.getElementById('modalValidacion');
  const iframe        = document.getElementById('modalIframe');   // <— cambió
  const btnCerrar     = document.getElementById('cerrarModal');

  // Abrir el modal y cargar la página
  btnConfirmar.addEventListener('click', (e) => {
    e.preventDefault();
    modal.classList.remove('hidden');
    iframe.src = '../validacion_invitado.html';                      // <— cambió
  });

  // Cerrar el modal (botón X)
  btnCerrar.addEventListener('click', () => {
    modal.classList.add('hidden');
    iframe.src = '';                                              // limpia para la próxima vez
  });

  // Cerrar haciendo clic fuera de la tarjeta
  modal.addEventListener('click', (e) => {
    if (e.target === modal) btnCerrar.click();
  });
});
