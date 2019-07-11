const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(__dirname + '/dist/wordsearch-generator'));

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname + '/dist/wordsearch-generator/index.html'));
});

app.listen(process.env.PORT || 3000, function(){ console.log('server started... listening in PORT'); })