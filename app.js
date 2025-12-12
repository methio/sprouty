const express = require('express');
const path = require('path');
const hbs = require('hbs');
const fs = require('fs');

const indexRouter = require('./routes/index');
const plantsRouter = require('./routes/plants');

// partials registration
const menu = fs.readFileSync('./views/partials/menu.hbs').toString();
hbs.registerPartial('menu', menu);

const app = express();

// view engine setup
// app.engine('hbs', engine({ extname: '.hbs', defaultLayout: 'main', layoutsDir: path.join(__dirname, 'views') }));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));


app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/plants', plantsRouter);

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});

module.exports = app;