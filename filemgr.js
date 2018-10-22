const {MongoClient} = require('mongodb');
const fs = MongoClient;

//const database = 'mongodb://localhost:27017';
const database = 'mongodb://project:project389@ds137763.mlab.com:37763/389com';

const saveData = (newData) => {
  return new Promise((resolve, reject) => {
    MongoClient.connect(database, {useNewUrlParser: true}, (err, client) => {
      if (err) {
        reject('Unable to connect to MongoDB');
      }
      console.log('Connected to MongoDB');
      const db = client.db('389com');

      db.collection('WeatherCollection').insertOne(newData, (err, result) => {
        if (err) {
          reject('Unable to insert');
        }
        resolve(result);
      })

      client.close();
    });
  });
};

const getAllData = () => {
  return new Promise((resolve, reject) => {
    MongoClient.connect(database, {useNewUrlParser: true}, (err, client) => {
      if (err) {
        reject('Unable to connect to MongoDB');
      }
      console.log('Connected to MongoDB');
      const db = client.db('389com');

      db.collection('WeatherCollection').find().toArray().then( (docs) => {
        resolve(docs);
      }, (err) => {
        reject('Unable to fetch docs');
      });

      client.close();
    });
  });
};

const deleteAll = () => {
  return new Promise((resolve, reject) => {
    MongoClient.connect(database, {useNewUrlParser: true}, (err, client) => {
      if (err) {
        reject('Unable to connect to MongoDB');
      }
      console.log('Connected to MongoDB');
      const db = client.db('389com');

      db.collection('WeatherCollection').remove({}).then( (result) => {
        resolve(result);
      }, (err) => {
        reject('Unable to delete');
      });

      client.close();
    });
  });
};


module.exports = {
  saveData,
  getAllData,
  deleteAll,
}
