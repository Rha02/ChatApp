const express = require('express');
const router = express.Router();

const Message = require('./models/Message');

/* GET latest messages */
router.get('/messages', function(req, res) {
  res.json(Message.fetch(30));
});

router.post('/messages', function(req, res) {
  // TODO: ADD Validation Logic
  
  const message = new Message(req.body.username, req.body.text);
  message.save();

  res.status(200).send();
});

module.exports = router;
