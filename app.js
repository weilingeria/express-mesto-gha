const express = require('express');
const mongoose = require('mongoose');

// Запуск на 3000 порту
const { PORT = 3000 } = process.env;

const app = express();

// Подключение к серверу MongoDB
mongoose.connect('mongodb://localhost:27017/mestodb');

app.use((req, res, next) => {
  req.user = {
    _id: '633c900f73c4712dfb593921',
  };

  next();
});

module.exports.createCard = (req, res) => {
  console.log(req.user._id);
};

app.listen(PORT);
