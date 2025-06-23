const express = require('express');
const path = require('path');
const fs = require('fs');
const csvParser = require('csv-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para JSON
app.use(express.json());

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint para validar nombre
app.post('/validar-nombre', (req, res) => {
  const { nombre } = req.body;
  const filePath = path.join(__dirname, 'public/invitados/invitados.csv');
  const nombres = [];

  fs.createReadStream(filePath)
    .pipe(csvParser())
    .on('data', (row) => {
      nombres.push(row.nombre.trim().toLowerCase());
    })
    .on('end', () => {
      const encontrado = nombres.includes(nombre.trim().toLowerCase());
      res.json({ valido: encontrado });
    })
    .on('error', (err) => {
      res.status(500).json({ error: 'No se pudo leer el archivo CSV' });
    });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
