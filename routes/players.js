const express = require('express');
const router = express.Router();
const footballDataService = require('../services/footballDataService');

router.get('/', async (req, res) => {
  try {
    const { team } = req.query;
    
    if (!team) {
      return res.status(400).json({ success: false, error: 'Team ID required' });
    }

    const teamData = await footballDataService.getTeamStatistics(team);
    
    if (teamData && teamData.squad) {
      res.json({ success: true, data: teamData.squad });
    } else {
      res.status(404).json({ success: false, error: 'Team not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/:playerId', async (req, res) => {
  try {
    const { playerId } = req.params;
    const { team } = req.query;
    
    if (!team) {
      return res.status(400).json({ success: false, error: 'Team ID required' });
    }

    const teamData = await footballDataService.getTeamStatistics(team);
    const player = teamData.squad?.find(p => p.id == playerId);
    
    if (player) {
      res.json({ success: true, data: player });
    } else {
      res.status(404).json({ success: false, error: 'Player not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
