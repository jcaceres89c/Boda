// modal.js

// Espera a que todo el contenido del DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {

  // Referencia al botón que abre el modal
  const btnConfirmar  = document.querySelector('.boton-confirmar');

  // Referencia al contenedor del modal (overlay oscuro)
  const modal         = document.getElementById('modalValidacion');

  // Referencia al iframe dentro del modal donde se cargará la validación
  const iframe        = document.getElementById('modalIframe');   // ← apuntamos al iframe

  // Referencia al botón de cerrar (la “X”)
  const btnCerrar     = document.getElementById('cerrarModal');

  // Evento al hacer clic en el botón "Confirmar"
  btnConfirmar.addEventListener('click', (e) => {
    e.preventDefault(); // Evita comportamiento por defecto si es un enlace o botón de formulario

    modal.classList.remove('hidden'); // Muestra el modal quitando la clase que lo oculta
    iframe.src = '../validacion_invitado.html'; // Carga la página de validación en el iframe
  });

  // Evento al hacer clic en la “X” para cerrar el modal
  btnCerrar.addEventListener('click', () => {
    modal.classList.add('hidden'); // Oculta el modal agregando la clase "hidden"
    iframe.src = '';               // Limpia el iframe para evitar que siga cargando en segundo plano
  });

  // Evento para cerrar el modal si se hace clic fuera de la tarjeta (contenido interno)
  modal.addEventListener('click', (e) => {
    if (e.target === modal) btnCerrar.click(); // Si se hace clic en el fondo oscuro, se cierra el modal
  });

});
