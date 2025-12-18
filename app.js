const express = require('express');
const path = require('path');
const hbs = require('hbs');
const fs = require('fs');

// hbs helper to convert object to JSON string
hbs.registerHelper('json', function(context) {
  return JSON.stringify(context);
});

hbs.registerHelper('gte', function(a, b) {
    return a >= b;
});

// Helper for less than or equal comparison
hbs.registerHelper('lte', function(a, b) {
    return Number(a) <= Number(b);
});

// Helper for OR logic
hbs.registerHelper('or', function() {
    return Array.prototype.slice.call(arguments, 0, -1).some(Boolean);
});

// Helper for equality comparison
hbs.registerHelper('eq', function(a, b) {
    return a === b;
});

const indexRouter = require('./routes/index');
const plantsRouter = require('./routes/plants');
const shopRouter = require('./routes/shop');
const ladySproutRouter = require('./routes/ladySprout');
const encyclopediaRouter = require('./routes/encyclopedia');




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
app.use('/ladySprout', ladySproutRouter);
app.use('/encyclopedia', encyclopediaRouter);

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});

module.exports = app;