const express = require("express");
const router = express.Router();
const Event = require("../models/events");
// const authMiddleware = require("../middleware/auth"); // Assuming you have an authentication middleware

// Create a new event
router.post("/createevent",  async (req, res) => {
  try {
    const eventData = req.body;

    const newEvent = await Event.create(eventData);
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all events
router.get("/all", async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// shop events 
router.get("/shop/:shopId", async (req, res) => {
  try {
    const shopId = req.params.shopId;
    console.log('Received shopId:', shopId);

    // Find all products with the specified shop ID
    const events = await Event.find({ shopId: shopId });
    console.log('Found events:', events);

    if (!events || events.length === 0) {
      return res.status(404).json({ message: "No events found for the given shop ID" });
    }

    res.json(events);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});



// Get a specific event by ID
router.get("/:eventId", async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a specific event by ID
router.put("/:eventId",  async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.eventId,
      req.body,
      { new: true }
    );
    if (!updatedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a specific event by ID
router.delete("/:eventId",  async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.eventId);
    if (!deletedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
