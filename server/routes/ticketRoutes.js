const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');
const requireLogin = require('../middleware/requireLogin');

// Create Ticket
router.post('/create', async (req, res) => {
  const { title, username } = req.body;
  console.log(username);
  const ticket = new Ticket({ title, customerName: username });
  await ticket.save();
  res.status(201).json({ticket, message:"Ticket Created Successfully"});
});

//user ticket
router.get('/user-tickets',requireLogin, async (req, res) => {
  try {
    // Fetch tickets created by the logged-in user
    const tickets = await Ticket.find({ customerName: req.user.name });
    if (!tickets) {
      return res.status(404).json({ error: 'No tickets found' });
    }
    res.json({data: tickets});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

//add note
router.post('/add-note', requireLogin, async (req, res) => {
  const { content, noteId } = req.body;
  if (!content) {
    return res.status(422).json({ message: "Please add content" });
  }

  try {
    const ticket = await Ticket.findById(noteId);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    ticket.notes.push({
      user: req.user.name,
      content
    });
    ticket.lastUpdatedOn = Date.now()
    await ticket.save();
    res.status(201).json({ message: "Successfully added note", ticket });
  } catch (error) {
    console.error('Error adding note:', error);
    res.status(500).json({ message: "Internal server error" });
  }
});


// Get All Tickets
router.get('/all-tickets',requireLogin, async (req, res) => {
  const tickets = await Ticket.find();
  res.json({data: tickets});
});

//update status
router.post('/update-ticket-status', async (req, res) => {
  const { ticketId, status } = req.body;

  if (!ticketId || !status) {
    return res.status(400).json({ message: 'Invalid data provided' });
  }

  try {
    const updatedTicket = await Ticket.findByIdAndUpdate(
      ticketId,
      { status },
      { new: true }
    );

    if (!updatedTicket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    res.json({ message: 'Ticket status updated successfully', data: updatedTicket });
  } catch (error) {
    console.error('Error updating ticket status:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

//delete note 
router.delete('/delete-ticket',requireLogin,async (req, res) => {
    const {ticketId} = req.body;
    const ticket = await Ticket.findByIdAndDelete({_id: ticketId});
    res.status(201).json({message:"Successfully deleted ticket"});
})
module.exports = router;
