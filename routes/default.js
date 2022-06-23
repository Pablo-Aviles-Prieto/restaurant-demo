const express = require('express');

const router = express.Router(); // In the express object, there is a router function inside that we can execute

router.get('/', function (req, res) {
  // const htmlFilePath = path.join(__dirname, 'views', 'index.html');
  // res.sendFile(htmlFilePath);
  res.render('index'); // Render the so-called template (Parse a template file, with help of a template engine (like ejs) and convert it to html to send back to the browser)
});

router.get('/about', function (req, res) {
  res.render('about');
});

module.exports = router;
