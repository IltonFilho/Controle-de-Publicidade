require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const apiUsuarios = require('./routes/usuarios');
const apiCampanhas = require('./routes/campanhas');
const apiMidias = require('./routes/midias');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/api/usuarios', apiUsuarios);
app.use('/api/campanhas', apiCampanhas);
app.use('/api/midias', apiMidias);

// Serve static frontend
app.use('/', express.static('public'));

const port = process.env.PORT || 3000;
app.listen(port, ()=> console.log('Server running on port', port));
