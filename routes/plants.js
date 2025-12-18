var express = require('express');
var router = express.Router();
const fs = require('fs');
const { title } = require('process');


// get all plants
router.get('/', function(req, res, next) {
  // first we get the data
  const plantData = fs.readFileSync('public/databases/data-plants.json', 'utf8');
  const plants = JSON.parse(plantData);
  // return the data to the request
  // console.log("--------------------------")
  // console.table(plants.shelves);
  req.plants = plants;
  next();
}, (req, res) => {  
  // then we render the page
  res.render('plants', { plants: req.plants });
});

// try to add a new plant
router.post('/add', function(req, res) {
  const plantData = fs.readFileSync('public/databases/data-plants.json', 'utf8');
  const plants = JSON.parse(plantData);
  let targetedShelfID;
  plants.shelves.forEach((shelf, index) => {
    if(shelf.shelf === req.body.shelve){
      targetedShelfID = index;
    }
  });
  plants.shelves[targetedShelfID].plants.push(req.body);
  fs.writeFileSync('public/databases/data-plants.json', JSON.stringify(plants, null, 2));
  // we reload in the front
  res.sendStatus(200);
});


// before sending your answer, get the plant infos 
router.param('id', function(req, res, next, id) {
  // get plant data from JSON file and parse to JS object
  const plantData = fs.readFileSync('public/databases/data-plants.json', 'utf8');
  const plants = JSON.parse(plantData);

  //Get user data
  const userData = fs.readFileSync('public/databases/user.json', 'utf8');
  const user =JSON.parse(userData);

  //Loop through shelves to find the plant
  let foundPlant = null;
  let foundShelf =null;

  for (let shelf of plants.shelves){
    for(let plant of shelf.plants){
      if (plant.plant_id == id){
        foundPlant = plant;
        foundShelf = shelf.shelf;
        break;
      }
    }
    if(foundPlant)break;
  }

  req.plantData = foundPlant;
  req.shelfName = foundShelf;
  req.userData = user;
  next();
  // return the data to the request
  // console.log(`Plant ${id} data: `, plants[id]);
});

// if it exists, get plant by id
router.get('/:id', function(req, res) {
  const plantId = req.params.id;

  res.render('plant', {
    plant: req.plantData,
    shelf: req.shelfName,
    user: req.userData,
    title: `Plant ${req.plantData.name || req.plantData.plant_family}`
  });
});

// Update plant levels from sensor data
router.post('/:id/update-levels', function(req, res) {
  try {
    const plantId = req.params.id;
    const { water_level, light_level, temp_level } = req.body;
    
    // Read the plant data
    const plantData = fs.readFileSync('public/databases/data-plants.json', 'utf8');
    const plants = JSON.parse(plantData);
    
    // Find and update the plant
    let updated = false;
    for (let shelf of plants.shelves) {
      for (let plant of shelf.plants) {
        if (plant.plant_id == plantId) {
          plant.water_level = water_level;
          plant.light_level = light_level;
          plant.temp_level = temp_level;
          updated = true;
          break;
        }
      }
      if (updated) break;
    }
    
    if (updated) {
      // Write back to file
      fs.writeFileSync('public/databases/data-plants.json', JSON.stringify(plants, null, 2));
      res.sendStatus(200);
    } else {
      res.status(404).send('Plant not found');
    }
  } catch (error) {
    console.error('Error updating plant levels:', error);
    res.status(500).send('Server error');
  }
});

// update user money




module.exports = router;
