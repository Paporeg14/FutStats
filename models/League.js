const mongoose = require('mongoose');

const leagueSchema = new mongoose.Schema({
  footballDataId: String,
  name: String,
  code: String,
  country: String,
  emblem: String,
  currentSeason: Object,
  lastUpdated: Date
}, { timestamps: true });

module.exports = mongoose.model('League', leagueSchema);
