const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const credentials = require('./middleware/credentials');
const bodyParser = require('body-parser');
const authToken = require('./middleware/authenticateToken');
const cookieParser = require('cookie-parser');
const PORT = 5000;

const app = express();

app.use(credentials);
app.use(cors());

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(cookieParser());

// Connect to MongoDB
mongoose.connect('mongodb://mongo:27017/feedback-app', { useNewUrlParser: true })
  .then(() => console.log("MongoDB successfully connected"))
  .catch(err => console.log(err));

// Routes
app.use('/', require('./routes/users'));

app.use(authToken);
app.use('/feedback', require('./routes/feedback'));
app.use('/objectives', require('./routes/objective'));

app.listen(PORT, () => console.log(`Server up and running on port ${PORT}`));
