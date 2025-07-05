document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('confirm-form');
  const input = document.getElementById('name-input');
  const error = document.getElementById('error-message');

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

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    error.textContent = '';

    const nombreIngresado = input.value.trim().toLowerCase();

    if (!nombreIngresado) {
      error.textContent = 'Por favor, ingresa tu nombre.';
      return;
    }

    try {
      const response = await fetch('../invitados/invitados.csv');
      if (!response.ok) throw new Error('No se pudo cargar el archivo CSV');

      const texto = await response.text();
        console.log('Contenido del CSV:', texto); 
      const lineas = texto.split('\n').map(linea => linea.trim());

      let encontrado = false;

      for (const linea of lineas) {
        const [nombre, cantidadStr] = linea.split(',').map(s => s.trim());
        const cantidad = parseInt(cantidadStr);
        const nombreCSV = nombre.toLowerCase();

        if (nombreCSV === nombreIngresado) {
          encontrado = true;

          const formConfig = formularios[cantidad];
          if (formConfig) {
            const nombreEncoded = encodeURIComponent(nombre);
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
        error.textContent = 'Nombre no encontrado en la lista.';
      }

    } catch (err) {
      console.error(err);
      error.textContent = 'Ocurrió un error al validar.';
    }
  });
});
