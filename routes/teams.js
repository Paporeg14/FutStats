const express = require('express');
const router = express.Router();
const footballDataService = require('../services/footballDataService');

router.get('/', async (req, res) => {
  try {
    const { league } = req.query;
    
    if (!league) {
      return res.status(400).json({ success: false, error: 'League code required' });
    }

    const teams = await footballDataService.getTeamsByLeague(league);
    res.json({ success: true, data: teams });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/:teamId', async (req, res) => {
  try {
    const { teamId } = req.params;
    const teamData = await footballDataService.getTeamStatistics(teamId);
    
    res.json({ success: true, data: teamData });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/:teamId/stats', async (req, res) => {
  try {
    const { teamId } = req.params;
    const teamData = await footballDataService.getTeamStatistics(teamId);
    
    if (teamData && teamData.squad) {
      res.json({ success: true, data: teamData });
    } else {
      res.status(404).json({ success: false, error: 'Team not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
