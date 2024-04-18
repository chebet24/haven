const Conversation = require("../models/conversation");
const express = require("express");
const router = express.Router();

// create a new conversation
router.post("/create", async (req, res) => {
  try {
    const { groupTitle, userId, sellerId } = req.body;

    // Check if a conversation with the same groupTitle exists
    let conversation = await Conversation.findOne({ groupTitle });

    if (conversation) {
      // Conversation already exists, return the existing conversation
      res.status(200).json({
        success: true,
        conversation,
      });
    } else {
      // Conversation doesn't exist, create a new one
      conversation = await Conversation.create({
        members: [userId, sellerId],
        groupTitle: groupTitle,
      });

      res.status(201).json({
        success: true,
        conversation,
      });
    }
  } catch (error) {
    console.error("Error creating conversation:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});


// get seller conversations
router.get("/get-all-conversation-seller/:id", async (req, res) => {
  try {
    const conversations = await Conversation.find({
      members: {
        $in: [req.params.id],
      },
    }).sort({ updatedAt: -1, createdAt: -1 });

    res.status(201).json({
      success: true,
      conversations,
    });
  } catch (error) {
    console.error("Error fetching seller conversations:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// get user conversations
router.get("/get-all-conversation-user/:id", async (req, res) => {
  try {
    const conversations = await Conversation.find({
      members: {
        $in: [req.params.id],
      },
    }).sort({ updatedAt: -1, createdAt: -1 });

    res.status(201).json({
      success: true,
      conversations,
    });
  } catch (error) {
    console.error("Error fetching user conversations:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// update the last message
router.put("/update-last-message/:id", async (req, res) => {
  try {
    const { lastMessage, lastMessageId } = req.body;

    const conversation = await Conversation.findByIdAndUpdate(req.params.id, {
      lastMessage,
      lastMessageId,
    });

    res.status(201).json({
      success: true,
      conversation,
    });
  } catch (error) {
    console.error("Error updating last message:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

module.exports = router;
