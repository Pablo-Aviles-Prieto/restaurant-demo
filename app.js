const cors = require('cors');
const fs = require('fs');
const path = require('path');

const datos = []; // Test creado para recibir datos del POST del thunder client

const express = require('express');
const app = express();

app.set('views', path.join(__dirname, 'views')); // Both this and next set is using reserved words as parameters, so views its not because the folder name that holds the html files. 2nd parameter is the path that contains the template files ** The views in the .join after dirname is the path, not a reserver key word.
app.set('view engine', 'ejs'); // We set 2 options, the 1st option tell express that we wnat to use a special engine (so-called template engine) to process the view files (the htmls we serve) and the 2nd is the extension we use

app.use(express.urlencoded({ extended: false }));
app.use(express.static('public')); // Helps serving the static content of the folder pointed

app.use(cors());
app.use(express.json());

app.get('/', function (req, res) {
  // const htmlFilePath = path.join(__dirname, 'views', 'index.html');
  // res.sendFile(htmlFilePath);
  res.render('index'); // Render the so-called template (Parse a template file, with help of a template engine (like ejs) and convert it to html to send back to the browser)
});

app.get('/restaurants', function (req, res) {
  const filePath = path.join(__dirname, 'data', 'restaurants.json'); // Indicamos el path del archivo donde almacenara los objs
  const fileData = fs.readFileSync(filePath); // Reads the file content thx to fs (file system).
  const storedRestaurants = JSON.parse(fileData); // Transform raw data/text into a JS array/obj
  // console.log(storedRestaurants);
  res.render('restaurants', {
    numberOfRestaurants: storedRestaurants.length,
    restaurants: storedRestaurants,
  }); // The 2nd parameter, optional, we can use an object and set as key/properties the variables in that ejs file
});

app.get('/recommend', function (req, res) {
  res.render('recommend');
});

app.post('/recommend', function (req, res) {
  const restaurant = req.body; // Guardamos todo el 'objeto' en dicha const
  const filePath = path.join(__dirname, 'data', 'restaurants.json'); // Indicamos el path del archivo donde almacenara los objs
  const fileData = fs.readFileSync(filePath); // Reads the file content thx to fs (file system).
  const storedRestaurants = JSON.parse(fileData); // Transform raw data/text into a JS array/obj

  storedRestaurants.push(restaurant);

  fs.writeFileSync(filePath, JSON.stringify(storedRestaurants)); // Stores the data with a stringify (to transform in text) in the path indicated

  res.redirect('/confirm'); // To avoid reloading the page and submitting the same data again, we redirect to another page
});

app.get('/confirm', function (req, res) {
  res.render('confirm');
});

app.get('/about', function (req, res) {
  res.render('about');
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

app.listen(3000);
