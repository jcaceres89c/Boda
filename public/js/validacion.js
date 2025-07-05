document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('confirm-form');
  const input = document.getElementById('name-input');
  const error = document.getElementById('error-message');
  const sugerenciasDiv = document.getElementById('sugerencias');

  const formularios = {
    1: { url: 'https://forms.gle/wAZvgTQNhXVamq2DA', entry: 'entry.1079611635' },
    2: { url: 'https://forms.gle/3pCM7HNyEcXcLpex8', entry: 'entry.859038236' },
    3: { url: 'https://forms.gle/Yxbcc9zczJ325TYm6', entry: 'entry.939276153' }
  };

  const normalizar = (str) =>
    str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s]/gi, "")
      .trim();

  let dataCSV = [];

  async function cargarCSV() {
    const response = await fetch('../invitados/invitados.csv');
    const texto = await response.text();
    const lineas = texto.split('\n').map(l => l.trim()).slice(1);

    dataCSV = lineas.map(linea => {
      const [nombre, cantidadStr] = linea.split(';').map(s => s.trim());
      return {
        original: nombre,
        normalizado: normalizar(nombre),
        partes: normalizar(nombre).split(' '),
        cantidad: parseInt(cantidadStr)
      };
    });
  }

  function mostrarSugerencias(opciones) {
    sugerenciasDiv.innerHTML = '';
    error.textContent = 'Selecciona tu nombre:';

    opciones.forEach(op => {
      const btn = document.createElement('button');
      btn.textContent = op.original;
      btn.className = 'block w-full bg-gray-200 hover:bg-gray-300 rounded p-2';
      btn.onclick = (e) => {
        e.preventDefault();
        redirigirAFormulario(op);
      };
      sugerenciasDiv.appendChild(btn);
    });
  }

  function redirigirAFormulario(invitado) {
    const formConfig = formularios[invitado.cantidad];
    if (formConfig) {
      const nombreEncoded = encodeURIComponent(invitado.original);
      const redireccion = `${formConfig.url}?${formConfig.entry}=${nombreEncoded}`;
      window.parent.location.href = redireccion;
    } else {
      error.textContent = `No hay formulario configurado para ${invitado.cantidad} pase(s).`;
    }
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    error.textContent = '';
    sugerenciasDiv.innerHTML = '';

    const nombreIngresado = normalizar(input.value);
    const partesIngresadas = nombreIngresado.split(' ');

    if (!dataCSV.length) await cargarCSV();

    const coincidencias = dataCSV.filter(dato => {
      const partes = dato.partes;
      if (partesIngresadas.length > partes.length) return false;

      // Coincidencia ordenada: cada palabra ingresada debe coincidir con el inicio de la palabra en la misma posición
      return partesIngresadas.every((palabra, idx) =>
        partes[idx]?.startsWith(palabra)
      );
    });

    if (coincidencias.length === 1) {
      redirigirAFormulario(coincidencias[0]);
    } else if (coincidencias.length > 1) {
      mostrarSugerencias(coincidencias);
    } else {
      error.textContent = 'Nombre no encontrado en la lista.';
    }
  });
});
