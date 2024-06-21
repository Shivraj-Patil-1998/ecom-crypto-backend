const fs = require('fs');
const path = require('path');
module.exports = {
  // local: {
  //   username: "postgres",
  //   password: "Avb@1221",
  //   database: "exchange",
  //   host: "localhost",
  //   dialect: "postgres",
  //   port: 5432,
  // },
  development: {
    username: 'postgres',
    password: 'Spatil@1998',
    database: 'exchange',
    host: 'localhost',
    dialect: 'postgres',
    timezone: 'utc',
    port: 5432,
    ssl: true,
    pool: {
      max: 100,
      min: 0,
      acquire: 60000,
      idle: 20000,
    },
  },
};
