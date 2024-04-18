// Import necessary modules
const mongoose = require('mongoose');

// Define the schema for the Group model
const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }]
});

// Create the Group model
const Group = mongoose.model('Group', groupSchema);

module.exports = Group;
