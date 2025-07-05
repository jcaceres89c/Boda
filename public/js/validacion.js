document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('confirm-form');
  const input = document.getElementById('name-input');
  const error = document.getElementById('error-message');

  // Configura aquí los formularios y los campos "Nombre" de cada uno
  // Configura aquí los formularios por cantidad de pases:
  const formularios = {
    1: {
      url: 'https://forms.gle/wAZvgTQNhXVamq2DA',
      entry: 'entry.1079611635'  // Reemplaza con el ID real del campo "Nombre" para formulario 1 pase
    },
    2: {
      url: 'https://forms.gle/3pCM7HNyEcXcLpex8',
      entry: 'entry.859038236'  // Reemplaza con el ID real del campo "Nombre" para formulario 2 pases
    },
    3: {
      url: 'https://forms.gle/Yxbcc9zczJ325TYm6',
      entry: 'entry.939276153'  // Reemplaza con el ID real del campo "Nombre" para formulario 3 pases
    }
  };

  // Normaliza tildes, mayúsculas, etc.
  const normalizar = (str) =>
    str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s]/gi, "") // quita signos como '
      .trim();

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    error.textContent = '';

    const nombreIngresado = normalizar(input.value);
    const partesIngresadas = nombreIngresado.split(' ');

    if (partesIngresadas.length < 2) {
      error.textContent = 'Por favor, escribe al menos nombre y apellido.';
      return;
    }

    try {
      const response = await fetch('/invitados/invitados.csv');
      if (!response.ok) throw new Error('No se pudo cargar el archivo CSV');

      const texto = await response.text();
      const lineas = texto.split('\n').map(l => l.trim()).slice(1); // salta cabecera

      let encontrado = false;

      for (const linea of lineas) {
        const [nombreCSV, cantidadStr] = linea.split(';').map(s => s.trim());
        if (!nombreCSV || !cantidadStr) continue;

        const cantidad = parseInt(cantidadStr);
        const partesCSV = normalizar(nombreCSV).split(' ');

        if (
          partesCSV[0] === partesIngresadas[0] &&
          partesCSV[1] === partesIngresadas[1]
        ) {
          encontrado = true;

          const formConfig = formularios[cantidad];
          if (formConfig) {
            const nombreEncoded = encodeURIComponent(nombreCSV);
            const redireccion = `${formConfig.url}?${formConfig.entry}=${nombreEncoded}`;
            window.parent.location.href = redireccion;
            return;
          } else {
            error.textContent = `No hay formulario configurado para ${cantidad} pase(s).`;
            return;
          }
        }
      }

      if (!encontrado) {
        error.textContent = 'Nombre no encontrado en la lista

