const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  footballDataId: Number,
  name: String,
  shortName: String,
  tla: String,
  crest: String,
  league: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'League'
  },
  founded: Number,
  clubColors: String,
  venue: String,
  website: String,
  email: String,
  phone: String,
  stats: {
    wins: Number,
    draws: Number,
    losses: Number,
    goalsFor: Number,
    goalsAgainst: Number,
    goalDifference: Number
  },
  lastUpdated: Date
}, { timestamps: true });

module.exports = mongoose.model('Team', teamSchema);
