const cors = require('cors');
const fs = require('fs');
const path = require('path');

const datos = []; // Test creado para recibir datos del POST del thunder client

const express = require('express');
const uuid = require('uuid'); // Returns an object with different methods that we can call to generate an ID (i.e. uuid.v4())

const resData = require('./util/restaurant-data'); // Recibe un array del module exports
const defaultRoutes = require('./routes/default');
const app = express();

app.set('views', path.join(__dirname, 'views')); // Both this and next set is using reserved words as parameters, so views its not because the folder name that holds the html files. 2nd parameter is the path that contains the template files ** The views in the .join after dirname is the path, not a reserver key word.
app.set('view engine', 'ejs'); // We set 2 options, the 1st option tell express that we wnat to use a special engine (so-called template engine) to process the view files (the htmls we serve) and the 2nd is the extension we use

app.use(express.urlencoded({ extended: false }));
app.use(express.static('public')); // Helps serving the static content of the folder pointed

app.use(cors());
app.use(express.json());

app.use('/', defaultRoutes); // Every incoming request that start with '/' should be handled by defaultRoutes and in case the request doesn't match any route in that file will keep looking in the other app.js routes

app.get('/restaurants', function (req, res) {
  const storedRestaurants = resData.getStoredRestaurants();
  res.render('restaurants', {
    numberOfRestaurants: storedRestaurants.length,
    restaurants: storedRestaurants,
  }); // The 2nd parameter, optional, we can use an object and set as key/properties the variables in that ejs file
});

app.get('/restaurants/:id', function (req, res) {
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

app.get('/recommend', function (req, res) {
  res.render('recommend');
});

app.post('/recommend', function (req, res) {
  const restaurant = req.body; // Guardamos todo el objeto en dicha const ** Returns an object the req.body
  restaurant.id = uuid.v4(); // We put id even not having that key in the object body ** In JS we can create a key with a value, that didnt exist in the obj

  const storedRestaurants = resData.getStoredRestaurants();
  storedRestaurants.push(restaurant);

  resData.storedRestaurants(storedRestaurants);
  res.redirect('/confirm'); // To avoid reloading the page and submitting the same data again, we redirect to another page
});

app.get('/confirm', function (req, res) {
  res.render('confirm');
});

// Test creado para enseñar los datos del array del POST de thunder client
app.get('/manolo', function (req, res) {
  res.status(200).json(datos);
});

// Test creado para thunder client post
app.post('/manolo', function (req, res) {
  const reqBody = req.body;
  console.log(reqBody);
  datos.push(req.body);
  res.send(reqBody);
});

// We put this middleware here to let the other middleware and routes handle the requests first, and if dont get a match, this middleware enroutes
app.use(function (req, res) {
  res.status(404).render('404');
});

// This middleware only executes if an error ocurred on the server. It needs 4 params (the funct) so express detects it as a middleware function for error handling.
app.use(function (error, req, res, next) {
  res.status(500).render('500');
}); // Next allows us to have multiple middlewares that will work together, so we can use next() to move on to the next middleware.

app.listen(3000);
