const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  title: String,
  status: { type: String, enum: ['Active', 'Pending', 'Closed'], default: 'Active' },
  customerName: String,
  lastUpdatedOn: { type: Date, default: Date.now },
  notes: [
    {
      user: String,
      content: String,
      timestamp: { type: Date, default: Date.now },
    }
  ]
});

module.exports = mongoose.model('Ticket', ticketSchema);
