// Import necessary modules
const express = require('express');
const router = express.Router();
const Group = require('../models/group');

// Route to create a new group
router.post('/create', async (req, res) => {
  try {
    // Extract group data from request body
    const { name, members } = req.body;

    // Create a new group
    const group = new Group({
      name,
      members
    });

    // Save the group to the database
    await group.save();

    // Send success response
    res.status(201).json({ message: 'Group created successfully', group });
  } catch (error) {
    // Handle errors
    console.error('Error creating group:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route to get all groups
router.get('/all', async (req, res) => {
  try {
    // Retrieve all groups from the database
    const groups = await Group.find();

    // Send success response with the list of groups
    res.status(200).json({ groups });
  } catch (error) {
    // Handle errors
    console.error('Error fetching groups:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
