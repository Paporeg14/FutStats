const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  footballDataId: Number,
  name: String,
  firstName: String,
  lastName: String,
  dateOfBirth: Date,
  nationality: String,
  section: String,
  position: String,
  shirtNumber: Number,
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  },
  stats: {
    goals: { type: Number, default: 0 },
    assists: { type: Number, default: 0 },
    yellowCards: { type: Number, default: 0 },
    redCards: { type: Number, default: 0 },
    shotsOnTarget: { type: Number, default: 0 },
    passes: { type: Number, default: 0 },
    passAccuracy: { type: Number, default: 0 },
    tackles: { type: Number, default: 0 },
    interceptions: { type: Number, default: 0 },
    fouls: { type: Number, default: 0 },
    minutesPlayed: { type: Number, default: 0 },
    appearances: { type: Number, default: 0 }
  },
  seasonStats: [{
    season: Number,
    league: String,
    stats: Object
  }],
  lastUpdated: Date
}, { timestamps: true });

module.exports = mongoose.model('Player', playerSchema);
