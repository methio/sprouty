var express = require('express');
var router = express.Router();
const fs = require('fs');


// get all plants
router.get('/', function(req, res, next) {
  // first we get the data
  const plantData = fs.readFileSync('public/databases/data-plants.json', 'utf8');
  const plants = JSON.parse(plantData);

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
  //stores the index of the shelf - where the plant should be added
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
});

// if it exists, get plant by id
router.get('/:id', function(req, res) {
  const plantId = req.params.id;

  res.render('plant', {
    plant: req.plantData,
    shelf: req.shelfName,
    user: req.userData,
    // sets plant title using plant name of family
    title: `Plant ${req.plantData.name || req.plantData.plant_family}`
  });
});

// Update plant levels from sensor data
router.post('/:id/update-levels', function(req, res) {
  try {
    const plantId = req.params.id;
    const { water_level, light_level, temp_level, reward_given } = req.body;
    
    // Read the plant data
    const plantData = fs.readFileSync('public/databases/data-plants.json', 'utf8');
    const plants = JSON.parse(plantData);
    
    // Find and update the plant
    let updated = false;
    for (let shelf of plants.shelves) {
      for (let plant of shelf.plants) {
        if (plant.plant_id == plantId) {
          // stores previous water level for comparison
          const prevWaterLevel = Number(plant.water_level);
          // updates the plant status
          plant.water_level = water_level;
          plant.light_level = light_level;
          plant.temp_level = temp_level;

          if (typeof reward_given === 'boolean'){
            plant.reward_given = reward_given;
          }

          if (prevWaterLevel >3 && water_level <=3) {
            plant.reward_given = false;
          }


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


// update user money after watering the plant
router.post('/user/reward-watering', function(req, res) {
  try {
    const userData = fs.readFileSync('public/databases/user.json', 'utf8');
    const user = JSON.parse(userData);

    user.money = Number(user.money) + 10;

    fs.writeFileSync(
      'public/databases/user.json',
      JSON.stringify(user, null, 2)
    );

    res.json({ money: user.money });
  } catch (error) {
    console.error('Error rewarding user:', error);
    res.status(500).send('Server error');
  }
});


// equip item from inventory to plant
router.post('/:id/equip', function(req, res) {
  try {
    const plantId = req.params.id;
    const { inventoryIndex } = req.body;

    const plantData = fs.readFileSync('public/databases/data-plants.json', 'utf8');
    const plants = JSON.parse(plantData);

    const userData = fs.readFileSync('public/databases/user.json', 'utf8');
    const user = JSON.parse(userData);

    // gets the item and stops if it does not exist
    const item = user.inventory[inventoryIndex];
    if (!item) {
      return res.status(400).send('Item not found');
    }

    // find plant
    let targetPlant = null; //placeholder for the plant
    for (let shelf of plants.shelves) {
      for (let plant of shelf.plants) {
        if (plant.plant_id == plantId) {
          targetPlant = plant;
          break;
        }
      }
      if (targetPlant) break;
    }

    if (!targetPlant) {
      return res.status(404).send('Plant not found');
    }

    // swap - returns old pot to the inventory
    if (targetPlant.pot && typeof targetPlant.pot === 'object') {
      user.inventory.push(targetPlant.pot);
    }

    // equip new pot
    targetPlant.pot = item;

    // remove from inventory
    user.inventory.splice(inventoryIndex, 1);

    fs.writeFileSync(
      'public/databases/data-plants.json',
      JSON.stringify(plants, null, 2)
    );

    fs.writeFileSync(
      'public/databases/user.json',
      JSON.stringify(user, null, 2)
    );

    res.sendStatus(200);
  } catch (error) {
    console.error('Equip error:', error);
    res.status(500).send('Server error');
  }
});





module.exports = router;
