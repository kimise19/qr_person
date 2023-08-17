const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3000;

// Conectar a la base de datos MongoDB
mongoose.connect('mongodb://127.0.0.1/mi_base_de_datos', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Conexión exitosa a la base de datos');
  })
  .catch(err => {
    console.error('Error al conectar a la base de datos:', err);
  });

// Definir el esquema para la colección "personas"
const PersonaSchema = new mongoose.Schema({
  nombre: String,
  apellido: String,
  edad: Number,
  cedula: String,
  correo_electronico: String,
  enfermedades: [String],
  alergias: [String],
  medicamentos: [String]
});

const Persona = mongoose.model('Persona', PersonaSchema);

// Middleware para manejar datos JSON
app.use(express.json());

// Rutas de la API

// Obtener todas las personas
app.get('/api/personas', async (req, res) => {
  try {
    const personas = await Persona.find();
    res.json(personas);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener personas' });
  }
});

// Obtener una persona por ID
app.get('/api/personas/:id', async (req, res) => {
  try {
    const persona = await Persona.findById(req.params.id);
    if (!persona) {
      return res.status(404).json({ error: 'Persona no encontrada' });
    }
    res.json(persona);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener la persona' });
  }
});

// Crear una nueva persona
app.post('/api/personas', async (req, res) => {
  try {
    const nuevaPersona = new Persona(req.body);
    await nuevaPersona.save();
    res.json(nuevaPersona);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear persona' });
  }
});

// Actualizar una persona por ID
app.put('/api/personas/:id', async (req, res) => {
  try {
    const persona = await Persona.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!persona) {
      return res.status(404).json({ error: 'Persona no encontrada' });
    }
    res.json(persona);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar persona' });
  }
});

// Eliminar una persona por ID
app.delete('/api/personas/:id', async (req, res) => {
  try {
    const persona = await Persona.findByIdAndDelete(req.params.id);
    if (!persona) {
      return res.status(404).json({ error: 'Persona no encontrada' });
    }
    res.json({ message: 'Persona eliminada correctamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar persona' });
  }
});

// Ruta de ejemplo
app.get('/', (req, res) => {
  res.send('API funcionando');
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});