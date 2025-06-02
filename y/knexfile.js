require('dotenv').config({ path: './.env.local' });

const config = {
  development: {
    client: 'pg',
    connection: process.env.DATABASE_URL, 
    migrations: {
      directory: './database/migrations',
    },
    seeds: {
      directory: './database/seeds',
    },
  }
};


module.exports = config;