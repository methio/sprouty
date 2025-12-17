var express = require('express');
var router = express.Router();
const fs = require('fs');


// get all plants
router.get('/', function(req, res, next) {
  // first we get the data
  const plantData = fs.readFileSync('public/databases/plants.json', 'utf8');
  const plants = JSON.parse(plantData);
  // return the data to the request
  console.log(`Plants: `, plants);
  req.plants = plants;
  next();
}, (req, res) => {  
  // then we render the page
  res.render('plants', { plants: req.plants });
});

// try to add a new plant
router.post('/new', function(req, res) {
  // res.send(`request: nouvelle plante`);
  res.render('index', { title: 'Express'});

});

// if it exists, get plant by id
router.get('/:id', function(req, res) {
  const plantId = req.params.id;
  res.render('plant', { plantData: req.plantData, title: `Plant ${plantId}` });
});

// before sending your answer, get the plant infos 
router.param('id', function(req, res, next, id) {
  // get plant data from JSON file and parse to JS object
  const plantData = fs.readFileSync('public/databases/plants.json', 'utf8');
  const plants = JSON.parse(plantData);
  // return the data to the request
  // console.log(`Plant ${id} data: `, plants[id]);
  req.plantData = plants[id];
  next();
});


// update user money



// store the values from the light/water/temp levels

module.exports = router;
