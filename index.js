require('dotenv').config();
const bodParser = require('body-parser');
const dns = require('node:dns');
const express = require('express');
const cors = require('cors');
const app = express();
const connectDB = require('./db/connect');
const UrlModel = require('./model/urlModel');

app.use(bodParser.urlencoded({ extended: false }));
// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.post('/api/shorturl', function (req, res) {
  const url = req.body.url;

  const urlObject = new URL(url);

  dns.lookup(urlObject.hostname, async (err, address, family) => {
    if (err) {
      return res.json({ error: 'invalid url' });
    }
    let shortUrl = Math.floor(Math.random() * 100000);

    await UrlModel.create({ original_url: url, short_url: shortUrl })
      .then((data) => {
        res.send({
          original_url: data.original_url,
          short_url: data.short_url,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

app.get('/api/shorturl/:shortUrl', async function (req, res) {
  const shortUrl = req.params.shortUrl;

  const result = await UrlModel.findOne({ short_url: shortUrl });
  if (!result) {
    return res.json({ error: 'Invalid url' });
  }

  res.redirect(result.original_url);
});

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);

    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
