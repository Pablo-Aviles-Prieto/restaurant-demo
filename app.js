const cors = require('cors');
const path = require('path');

const jsonData = require('./data/restaurants.json');

const datos = []; // Test creado para recibir datos del POST del thunder client

const express = require('express');

const defaultRoutes = require('./routes/default');
const restaurantRoutes = require('./routes/restaurants');

const app = express();

app.set('views', path.join(__dirname, 'views')); // Both this and next set is using reserved words as parameters, so views its not because the folder name that holds the html files. 2nd parameter is the path that contains the template files ** The views in the .join after dirname is the path, not a reserver key word.
app.set('view engine', 'ejs'); // We set 2 options, the 1st option tell express that we wnat to use a special engine (so-called template engine) to process the view files (the htmls we serve) and the 2nd is the extension we use

app.use(express.urlencoded({ extended: false }));
app.use(express.static('public')); // Helps serving the static content of the folder pointed

app.use(cors());
app.use(express.json());

app.use('/', defaultRoutes); // Every incoming request that start with '/' should be handled by defaultRoutes and in case the request doesn't match any route in that file will keep looking in the other app.js routes
app.use('/', restaurantRoutes);

// Test creado para enseñar los datos del array del POST de thunder client
app.get('/manolo', function (req, res) {
  res.status(200).json(jsonData);
});

// Test creado para POST en html-forms
app.post('/formdata', function (req, res) {
  console.log(req.body);
  res.status(200).json(req.body);
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
