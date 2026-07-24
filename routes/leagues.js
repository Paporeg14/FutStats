const express = require('express');
const router = express.Router();
const footballDataService = require('../services/footballDataService');

router.get('/', async (req, res) => {
  try {
    const leagues = [
      { name: 'Premier League', code: 'PL', country: 'England' },
      { name: 'La Liga', code: 'PD', country: 'Spain' },
      { name: 'Serie A', code: 'SA', country: 'Italy' },
      { name: 'Bundesliga', code: 'BL1', country: 'Germany' },
      { name: 'Ligue 1', code: 'FL1', country: 'France' },
      { name: 'UEFA Champions League', code: 'CL', country: 'Europe' },
      { name: 'Liga MX', code: 'MX', country: 'Mexico' },
      { name: 'MLS', code: 'USA', country: 'United States' },
      { name: 'Saudi Professional League', code: 'SA', country: 'Saudi Arabia' }
    ];
    
    res.json({ success: true, data: leagues });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const leagueData = await footballDataService.fetchFootballData(`/competitions/${code}`);
    
    res.json({ success: true, data: leagueData });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
