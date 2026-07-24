const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  footballDataId: Number,
  league: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'League'
  },
  homeTeam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  },
  awayTeam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  },
  utcDate: Date,
  status: {
    type: String,
    enum: ['SCHEDULED', 'LIVE', 'IN_PLAY', 'PAUSED', 'FINISHED', 'SUSPENDED', 'CANCELLED', 'POSTPONED'],
    default: 'SCHEDULED'
  },
  score: {
    fullTime: {
      home: Number,
      away: Number
    },
    halfTime: {
      home: Number,
      away: Number
    },
    extraTime: {
      home: Number,
      away: Number
    },
    penalties: {
      home: Number,
      away: Number
    }
  },
  goals: [{
    player: String,
    team: String,
    minute: Number,
    type: String
  }],
  cards: [{
    player: String,
    team: String,
    minute: Number,
    type: String
  }],
  season: Number,
  round: String,
  venue: String,
  referees: [String],
  lastUpdated: Date
}, { timestamps: true });

module.exports = mongoose.model('Match', matchSchema);
