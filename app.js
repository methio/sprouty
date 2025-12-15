const express = require('express');
const path = require('path');
const hbs = require('hbs');
const fs = require('fs');

// hbs helper to convert object to JSON string
hbs.registerHelper('json', function(context) {
  return JSON.stringify(context);
});

const indexRouter = require('./routes/index');
const plantsRouter = require('./routes/plants');
const shopRouter = require('./routes/shop');


// partials registration
const menu = fs.readFileSync('./views/partials/menu.hbs').toString();
const ressources = fs.readFileSync('./views/partials/ressources.hbs').toString();

hbs.registerPartial('menu', menu);
hbs.registerPartial('ressources', ressources);

const app = express();

// view engine setup
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));


app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/plants', plantsRouter);
app.use('/shop', shopRouter);

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});

module.exports = app;