const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
require('dotenv').config();

const app = express();

app.use(helmet());
app.use(compression());
app.use(morgan('combined'));

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend running ✅', timestamp: new Date(), apiKey: process.env.FOOTBALL_DATA_API_KEY ? 'Configurada ✅' : 'NO configurada ❌' });
});

const leaguesRoutes = require('./routes/leagues');
const teamsRoutes = require('./routes/teams');
const playersRoutes = require('./routes/players');
const matchesRoutes = require('./routes/matches');
const statisticsRoutes = require('./routes/statistics');

app.use('/api/leagues', leaguesRoutes);
app.use('/api/teams', teamsRoutes);
app.use('/api/players', playersRoutes);
app.use('/api/matches', matchesRoutes);
app.use('/api/statistics', statisticsRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error en servidor', message: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`
✅ BACKEND CORRIENDO EN PUERTO ${PORT}`);
  console.log(`📊 Ambiente: ${process.env.NODE_ENV}`);
  console.log(`🔑 API Key: ${process.env.FOOTBALL_DATA_API_KEY ? 'CONFIGURADA ✅' : 'NO CONFIGURADA ❌'}`);
  console.log(`\n📍 Accede a: http://localhost:${PORT}/api/health\n`);
});

module.exports = app;
