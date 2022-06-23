const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'data', 'restaurants.json'); // Indicamos el path del archivo donde almacenara los objs ** dirname indica el directorio donde está el archivo, no el root total, en este caso util

function getStoredREstaurants() {
  const fileData = fs.readFileSync(filePath); // Reads the file content thx to fs (file system).
  const storedRestaurants = JSON.parse(fileData); // Transform raw data/text into a JS array/obj
  return storedRestaurants;
}

function storedRestaurants(storableRestaurant) {
  fs.writeFileSync(filePath, JSON.stringify(storableRestaurant)); // Stores the data with a stringify (to transform in text) in the path indicated
}

module.exports = {
  getStoredRestaurants: getStoredREstaurants, // El value es el equivalente al nombre de la función
  storedRestaurants: storedRestaurants,
};
