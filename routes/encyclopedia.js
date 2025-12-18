var express = require('express');
var router = express.Router();
const fs = require('fs');

// spis treści
router.get('/', function(req, res) {
  const encyclopediaData = fs.readFileSync('public/databases/data-plantopedia.json','utf8');
  const encyclopedia = JSON.parse(encyclopediaData);

  return res.render('encyclopedia', { encyclopedia: encyclopedia });
});

// kwiatek
router.get('/plants/:plant', function(req, res) {
  const encyclopediaData = fs.readFileSync('public/databases/data-plantopedia.json','utf8');
  const encyclopedia = JSON.parse(encyclopediaData);

  const plant = encyclopedia.plants.find(
    p => p.plant === req.params.plant
  );

  return res.render('encyclopedia', { plant: plant });
});

// choroba
router.get('/diseases/:disease', function(req, res) {
  const encyclopediaData = fs.readFileSync('public/databases/data-plantopedia.json','utf8');
  const encyclopedia = JSON.parse(encyclopediaData);

  const disease = encyclopedia.diseases.find(
    d => d.encyclopedia_id === req.params.disease
  );

  return res.render('encyclopedia', { disease: disease });
});

module.exports = router;
