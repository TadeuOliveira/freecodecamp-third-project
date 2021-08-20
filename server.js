require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dns = require('dns');
const app = express();
const bodyParser = require("body-parser");
const { mongoose, ShortUrl } = require('./initializeDocuments.js');
const http = require('http');

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

app.get('/api/shorturl/:shorturl', function(req, res) {
  ShortUrl.find({ short_url: req.params.shorturl }, function(err, data){
    if(err){
      res.json({error: "No short URL found for the given input"})
      return;
    }
    res.writeHead(301, { "Location": data[0].original_url})
    res.end();
  });

});

app.post('/api/shorturl', function(req, res){
  const domain = (new URL(req.body.url)).hostname;
  dns.lookup(domain,null,(err) => {
    if(err){
      res.json({error: 'invalid url'});
      return;
    }
    let surl = new ShortUrl({
      original_url: req.body.url
    });
    surl.save(function(err, data){
      if(err){
        console.error(err)
      }
      console.log('new shorturl document saved!', data);
      res.json(
        {
          original_url: data.original_url,
          short_url: data.short_url
        }
      );
    });
  });
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
