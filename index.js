const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const taskRouter = require('./router');

const app = express();
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/taskManager')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));


app.use('/', taskRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
