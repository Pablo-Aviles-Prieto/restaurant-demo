const express = require('express');
const resData = require('../util/restaurant-data'); // Recibe un array del module exports
const uuid = require('uuid'); // Returns an object with different methods that we can call to generate an ID (i.e. uuid.v4())

const router = express.Router();

router.get('/restaurants', function (req, res) {
  const order = req.query.order || 'asc'; // req.query returns an object
  let nextOrder = 'asc';

  if (order === 'asc') {
    nextOrder = 'desc';
  }

  const storedRestaurants = resData.getStoredRestaurants();
  storedRestaurants.sort(function (a, b) {
    if (
      (order === 'asc' && a.name > b.name) ||
      (order === 'desc' && a.name < b.name)
    ) {
      return 1;
    } else {
      return -1;
    }
  });

  res.render('restaurants', {
    numberOfRestaurants: storedRestaurants.length,
    restaurants: storedRestaurants,
    nextOrder: nextOrder,
  }); // The 2nd parameter, optional, we can use an object and set as key/properties the variables in that ejs file
});

router.get('/restaurants/:id', function (req, res) {
  const restaurantId = req.params.id;
  const storedRestaurants = resData.getStoredRestaurants();
  for (let i = 0; i < storedRestaurants.length; i++) {
    if (storedRestaurants[i].id === restaurantId) {
      return res.status(200).render('restaurant-detail', {
        restaurantObj: storedRestaurants[i],
      });
    } else if (
      i === storedRestaurants.length - 1 &&
      storedRestaurants[i].id !== restaurantId
    ) {
      return res.status(404).render('error-restaurant');
    }
  }

  // for (const restaurant of storedRestaurants) {
  //   if (restaurant.id === restaurantId) {
  //     return res.render('restaurant-detail', {
  //       restaurantObj: restaurant,
  //     });
  //   }
  // }
});

router.get('/recommend', function (req, res) {
  res.render('recommend');
});

router.post('/recommend', function (req, res) {
  const restaurant = req.body; // Guardamos todo el objeto en dicha const ** Returns an object the req.body
  restaurant.id = uuid.v4(); // We put id even not having that key in the object body ** In JS we can create a key with a value, that didnt exist in the obj

  const storedRestaurants = resData.getStoredRestaurants();
  storedRestaurants.push(restaurant);

  resData.storedRestaurants(storedRestaurants);
  res.redirect('/confirm'); // To avoid reloading the page and submitting the same data again, we redirect to another page
});

router.get('/confirm', function (req, res) {
  res.render('confirm');
});

module.exports = router;
