const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const auth = require('./middlewares/auth');
const { createUser, login } = require('./controllers/users');

// Запуск на 3000 порту
const { PORT = 3000 } = process.env;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));

function error404(req, res) {
  return res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
}

app.use(express.static(path.join(__dirname, 'public')));

// Подключение к серверу MongoDB
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth, '/users', require('./routes/users'));
app.use(auth, '/cards', require('./routes/cards'));

app.use(auth, '*', error404);

app.listen(PORT);
