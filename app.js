const express = require('express');
const path = require('path');

const indexRouter = require('./routes/index');
const plantsRouter = require('./routes/plants');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/plants', plantsRouter);

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});

module.exports = app;