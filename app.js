const express = require('express');
const server = express();
const hbs = require('hbs');
const axios = require('axios');
const bodyParser = require('body-parser');
const filemgr = require('./filemgr');
const yargs = require('yargs');

const port = process.env.PORT || 3000;

server.use(bodyParser.urlencoded( {extended: true} ));

server.set('view engine','hbs');
hbs.registerPartials(__dirname + '/views/partials');

var weatherdata;

hbs.registerHelper('list', (items, options) => {
  items = weatherdatas;
  var out = "<tr><th>Address</th><th>Summary</th><th>Temp</th></tr>"
  const length = items.length;
  for(var i=0; i<length; i++) {
    out = out + options.fn(items[i]);
  }

  return out;
});

server.get('/', (req,res) => {
  res.render('main.hbs');
});

server.get('/main', (req,res) => {
  res.render('main.hbs');
});

server.get('/result', (req,res) => {
  res.render('result.hbs');
});

server.get('/form',(req, res) => {
  res.render('form.hbs');
});

server.get('/historical', (req,res) => {
  filemgr.getAllData().then((result) => {
    weatherdata = result;
    res.render('historical.hbs');
  }).catch((errorMessage) => {
    console.log(errorMessage);
  });
});

server.post('/delete', (req, res) => {
  filemgr.deleteAll().then((result) => {
    weatherdata = result;
    res.render('historical.hbs');
  }).catch((errorMessage) => {
    console.log(errorMessage);
  });
});

server.post('/form', (req,res) => {
  res.render('form.hbs');
});

server.post('/getweather', (req,res) => {
  const addr = req.body.address;

  const locationReq = `https://maps.googleapis.com/maps/api/geocode/json?address=${addr}&key=AIzaSyBkUVxs91pzUSiMU2DpGs7tO5tjUaZ_Z_k`;

  axios.get(locationReq).then((response) => {
    console.log(response.data.results[0].formatted_address);
    const lat = response.data.results[0].geometry.location.lat;
    const lng = response.data.results[0].geometry.location.lng;
    const weatherReq = `https://api.darksky.net/forecast/336fa9f0ab64e4b0f638841ff3feb4cc/${lat},${lng}`;
    return axios.get(weatherReq);
  }).then((response) => {
    console.log(response.data.currently.summary);
    const temp = (response.data.currently.temperature - 32) * 0.5556;
    const temperature = temp.toFixed(2);
    const tempStr = `${temperature} C`;
    const weatherresult = {
      address: addr,
      summary: response.data.currently.summary,
      temperature: tempStr,
    };

    filemgr.saveData(weatherresult).then((result) => {
      res.render('result.hbs', weatherresult);
    }).catch((errorMessage) => {
      console.log(errorMessage);
    });


  })
  .catch((error) => {
    console.log(error.code);
  });
});

server.listen(port, () => {
  console.log(`server listening on port ${port}`);
});
