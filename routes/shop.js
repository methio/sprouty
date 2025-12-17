var express = require('express');
var router = express.Router();
const fs = require('fs');


// get all shop items
router.get('/', function(req, res, next) {
  // first we get the data
  const shopData = fs.readFileSync('public/databases/data-shop.json', 'utf8');
  const shop = JSON.parse(shopData);

  const userData = fs.readFileSync('public/databases/user.json', 'utf8');
  const user = JSON.parse(userData); 
  // then we render the page
  res.render('shop', { shop: shop.shop, user: user });
});


// buy an item
router.post('/:id', function(req, res) {
    console.log("ici", parseInt(req.params.id));

    const shopData = fs.readFileSync('public/databases/data-shop.json', 'utf8');
    const shop = JSON.parse(shopData);

    const userData = fs.readFileSync('public/databases/user.json', 'utf8');
    const user = JSON.parse(userData); 

    const itemIndex = shop.shop.findIndex(item => item.id === parseInt(req.params.id));
    const itemBought = shop.shop[itemIndex];

    if (user.money<itemBought.price){
      return res.redirect('/shop');
    }
    
    user.money -= itemBought.price;
    user.inventory.push(itemBought);
    console.log("newUser", user);

    shop.shop.splice(itemIndex, 1);

    // save updated user and shop data
    fs.writeFileSync('public/databases/user.json', JSON.stringify(user), 'utf8');
    fs.writeFileSync('public/databases/data-shop.json', JSON.stringify(shop), 'utf8');

    // // update shop data
    // shop[parseInt(req.params.id)].stock -= 1;
    // fs.writeFileSync('public/databases/shop.json', JSON.stringify(shop), 'utf8');
    
    // then we render the page
    res.redirect('/shop');
});

module.exports = router;