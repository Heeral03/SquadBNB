const mongoose = require('mongoose');

const squadSchema = new mongoose.Schema({
  squadName: { type: String, unique: true, required: true },
  members: [{ type: String }], // just addresses
  submissions: [{
    userAddress: String,
    challenge: String,
    photoBase64: String,
    quote: String,
    verified: Boolean,
    timestamp: Date
  }],
  score: { type: Number, default: 0 }
});

module.exports = mongoose.model('Squad', squadSchema);
