const express = require('express');
const router = express.Router();
const footballDataService = require('../services/footballDataService');

router.get('/live', async (req, res) => {
  try {
    const { league } = req.query;
    
    if (!league) {
      return res.status(400).json({ success: false, error: 'League code required' });
    }

    const matches = await footballDataService.getMatches(league);
    res.json({ success: true, data: matches });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/finished', async (req, res) => {
  try {
    const { league, days = 30 } = req.query;
    
    if (!league) {
      return res.status(400).json({ success: false, error: 'League code required' });
    }

    const matches = await footballDataService.getFinishedMatches(league, parseInt(days));
    res.json({ success: true, data: matches });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const { league } = req.query;
    
    if (!league) {
      return res.status(400).json({ success: false, error: 'League code required' });
    }

    const allMatches = await footballDataService.getMatches(league);
    res.json({ success: true, data: allMatches });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/:matchId', async (req, res) => {
  try {
    const { matchId } = req.params;
    const matchData = await footballDataService.getMatchDetails(matchId);
    
    res.json({ success: true, data: matchData });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
