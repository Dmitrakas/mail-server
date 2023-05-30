const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect('mongodb+srv://Dmitry:admin@cluster0.ypdufpr.mongodb.net/node-mail?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

const messageSchema = new mongoose.Schema({
  senderName: String,
  recipientName: String,
  title: String,
  messageBody: String,
});

const Message = mongoose.model('Message', messageSchema);

app.post('/api/messages', (req, res) => {
  const { senderName, recipientName, title, messageBody } = req.body;
  const message = new Message({
    senderName,
    recipientName,
    title,
    messageBody,
  });

  message.save()
    .then(() => {
      res.status(201).json({ message: 'Message saved successfully' });
    })
    .catch((error) => {
      res.status(500).json({ error: 'Error saving message' });
    });
});

app.get('/api/messages/:recipientName', (req, res) => {
  const recipientName = req.params.recipientName;

  Message.find({ recipientName })
    .then((messages) => {
      res.json(messages);
    })
    .catch((error) => {
      res.status(500).json({ error: 'Error retrieving messages' });
    });
});

app.get('/api/recipient-names', (req, res) => {
  Message.find().distinct('recipientName')
    .then((recipientNames) => {
      res.json(recipientNames);
    })
    .catch((error) => {
      res.status(500).json({ error: 'Error retrieving recipient names' });
    });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
