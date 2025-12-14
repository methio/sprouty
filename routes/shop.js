var express = require('express');
var router = express.Router();
const fs = require('fs');


// get all shop items
router.get('/', function(req, res, next) {
  // first we get the data
  const shopData = fs.readFileSync('public/databases/shop.json', 'utf8');
  const shop = JSON.parse(shopData);
  // return the data to the request
  req.shop = shop;
  next();
}, (req, res) => {  
  // then we render the page
  res.render('shop', { shop: req.shop });
});


// buy an item
router.post('/:id', function(req, res) {
    console.log("ici", parseInt(req.params.id));

    // update user data    
    const userData = fs.readFileSync('public/databases/user.json', 'utf8');
    const user = JSON.parse(userData);
    console.log("user before", user);


    const shopData = fs.readFileSync('public/databases/shop.json', 'utf8');
    let shop = JSON.parse(shopData);

    const itemBought = shop[parseInt(req.params.id)];
    user.money -= parseInt(itemBought.price);
    user.inventory.push(itemBought);
    console.log("newUser", user);
    // save updated user data
    fs.writeFileSync('public/databases/user.json', JSON.stringify(user), 'utf8');

    // update shop data
    shop[parseInt(req.params.id)].stock -= 1;
    fs.writeFileSync('public/databases/shop.json', JSON.stringify(shop), 'utf8');
    
    // then we render the page
    res.render('shop', { shop: shop });
});



module.exports = router;