// validacion_invitado.js

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('confirm-form');
  const input = document.getElementById('name-input');
  const error = document.getElementById('error-message');
  const sugerenciasDiv = document.getElementById('sugerencias');

  // Diccionario con los formularios de Google y sus respectivos campos de entrada
  const formularios = {
    1: { url: 'https://docs.google.com/forms/d/e/1FAIpQLSdNM8J9WxjLZHbiyffD-gQ1fuIAnA7ah4iffXjbokj7T7J2aQ/viewform', entry: 'entry.1079611635' },
    2: { url: 'https://docs.google.com/forms/d/e/1FAIpQLSfXtEUJYCyN333m2a5xIoozquJKKh69a-JpE_8PC8tlnprIBg/viewform', entry: 'entry.859038236' },
    3: { url: 'https://docs.google.com/forms/d/e/1FAIpQLSfEwyfvrCK9fc0B7jdBSAGDlKnw6sJwQ8NKhLJbboTBVpphLw/viewform', entry: 'entry.939276153' }
  };

  // Función para normalizar texto (quitar tildes, convertir a minúsculas, etc.)
  const normalizar = (str) =>
    str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s]/gi, "")
      .trim();

  let dataCSV = [];

  // Cargar y procesar el archivo CSV
  async function cargarCSV() {
    const response = await fetch('../invitados/invitados.csv');
    const texto = await response.text();
    const lineas = texto.split('\n').map(l => l.trim()).slice(1); // Ignora encabezado

    dataCSV = lineas.map(linea => {
      const [nombre, paterno, materno, cantidadStr] = linea.split(';').map(s => s.trim());
      const nombreCompleto = [nombre, paterno, materno].filter(Boolean).join(' ');
      return {
        original: nombreCompleto,
        normalizado: normalizar(nombreCompleto),
        partes: normalizar(nombreCompleto).split(' '),
        cantidad: parseInt(cantidadStr)
      };
    });
  }

  // Mostrar lista de sugerencias si hay múltiples coincidencias
  function mostrarSugerencias(opciones) {
    sugerenciasDiv.innerHTML = '';
    error.textContent = 'Selecciona tu nombre:';

    opciones.forEach(op => {
      const btn = document.createElement('button');
      btn.textContent = op.original;
      btn.className = 'block w-full bg-gray-100 border hover:bg-yellow-100 text-left px-4 py-2 rounded';
      btn.onclick = (e) => {
        e.preventDefault();
        redirigirAFormulario(op);
      };
      sugerenciasDiv.appendChild(btn);
    });
  }

  // Redirigir al formulario con el nombre codificado
  function redirigirAFormulario(invitado) {
    const formConfig = formularios[invitado.cantidad];
    if (!formConfig) {
      error.textContent = `No hay formulario para ${invitado.cantidad} pase(s).`;
      return;
    }

    const nombreEncoded = encodeURIComponent(invitado.original);
    const url = `${formConfig.url}?${formConfig.entry}=${nombreEncoded}`;
    window.open(url, '_blank'); // abrir en nueva pestaña
  }

  // Manejador del envío del formulario
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    error.textContent = '';
    sugerenciasDiv.innerHTML = '';

    const nombreIngresado = normalizar(input.value);
    const partesIngresadas = nombreIngresado.split(' ');

    if (!dataCSV.length) await cargarCSV();

    const coincidencias = dataCSV.filter(dato =>
      partesIngresadas.every(palabra =>
        dato.partes.some(p => p.startsWith(palabra))
      )
    );

    if (coincidencias.length === 1) {
      redirigirAFormulario(coincidencias[0]);
    } else if (coincidencias.length > 1) {
      mostrarSugerencias(coincidencias);
    } else {
      error.textContent = 'Nombre no encontrado en la lista.';
    }
  });
});
