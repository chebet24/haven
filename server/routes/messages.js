const Messages = require("../models/messages");

const express = require("express");

const cloudinary = require("cloudinary");
const router = express.Router();

// create new message
router.post(
  "/create",async (req, res, next) => {
    try {
      const messageData = req.body;

      if (req.body.images) {
        const myCloud = await cloudinary.v2.uploader.upload(req.body.images, {
          folder: "messages",
        });
        messageData.images = {
          public_id: myCloud.public_id,
          url: myCloud.url,
        };
      }

      messageData.conversationId = req.body.conversationId;
      messageData.sender = req.body.sender;
      messageData.text = req.body.text;

      const message = new Messages({
        conversationId: messageData.conversationId,
        text: messageData.text,
        sender: messageData.sender,
        images: messageData.images ? messageData.images : undefined,
      });

      await message.save();

      res.status(201).json({
        success: true,
        message,
      });
    } catch (error) {
        res.status(500).json({ error: error.message});
    }
  })
;

// get all messages with conversation id
router.get(
  "/get-all-messages/:id", async (req, res, next) => {
    try {
      const messages = await Messages.find({
        conversationId: req.params.id,
      });

      res.status(201).json({
        success: true,
        messages,
      });
    } catch (error) {
      res.status(500).json({ error: error.message});
    }
  })
;
router.put('/seen/:messageId', async (req, res) => {
  try {
    const { messageId } = req.params;

    // Update the message in the database to mark it as seen
    await Message.findByIdAndUpdate(messageId, { seen: true });

    // Respond with a success message
    res.status(200).json({ success: true, message: 'Message marked as seen' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error marking message as seen' });
  }
});

module.exports = router;
