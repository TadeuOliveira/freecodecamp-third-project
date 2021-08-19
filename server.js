require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dns = require('dns');
const app = express();
const bodyParser = require("body-parser");
const { mongoose, ShortUrl } = require('./initializeDocuments.js');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));
app.use(bodyParser.urlencoded({ extended: "false" }));
app.use(bodyParser.json());

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.get("/is-mongoose-ok", function (req, res) {
  if (mongoose) {
    res.json({ isMongooseOk: !!mongoose.connection.readyState });
  } else {
    res.json({ isMongooseOk: false });
  }
});

app.get('/api/shorturl/:dns', function(req, res) {
});

app.post('/api/shorturl', function(req, res){
  dns.lookup(req.body.url,null,(err) => {
    if(err){
      res.json({error: 'invalid url', value: req.body.url});
      return;
    }
    res.json({status: 'ok!', value: req.body.url});
  });
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
