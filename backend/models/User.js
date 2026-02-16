const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userAddress: { type: String, unique: true, required: true },
  squadName: { type: String, required: true },
  badges: [{ challenge: String, id: String }],
  totalScore: { type: Number, default: 0 }
});

module.exports = mongoose.model('User', userSchema);
