'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');

const weatherData = require('./data/weather.json');

class Forecast {
    constructor(obj) {
        this.date = obj.datetime;
        this.description = 'low of ' + obj.low_temp +  ', high of ' + obj.high_temp + ' with ' + obj.weather.description.toLowerCase();

    }
}

const PORT = process.env.PORT;

const app = express();
app.use(cors());

app.get('/weather', (request, response) => {
  let {lat, lon, searchQuery} = request.query;

  if (!lat || !lon || !searchQuery) {
    throw new Error('Please send lat lon and search query as a query string');
  }

  let city = weatherData.find(city => {
    return city.city_name.toLowerCase() === searchQuery.toLowerCase();
  });

  if (city) {
    let forcastArray = city.data.map(forecast => new Forecast(forecast));
    response.send(forcastArray);
  } else {
    response.status(404).send('City not found');
  }

  response.send('working on it');
});

app.use('*', (error, request, response, next) => {
    response.status(500).send(error);
});

app.use('*', (request, response) => {
    response.status(404).send('Route not found');
})

app.listen(PORT, () => {
    console.log('Server is running on port :' + PORT);
});