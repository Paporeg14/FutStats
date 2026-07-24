const express = require('express');
const router = express.Router();
const footballDataService = require('../services/footballDataService');

router.get('/standings/:league', async (req, res) => {
  try {
    const { league } = req.params;
    const standings = await footballDataService.getStandings(league);
    
    res.json({ success: true, data: standings });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/league/:league', async (req, res) => {
  try {
    const { league } = req.params;
    const leagueData = await footballDataService.fetchFootballData(`/competitions/${league}`);
    
    res.json({ success: true, data: leagueData });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/scorers/:league', async (req, res) => {
  try {
    const { league } = req.params;
    const scorers = await footballDataService.fetchFootballData(`/competitions/${league}/scorers`);
    
    res.json({ success: true, data: scorers });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
