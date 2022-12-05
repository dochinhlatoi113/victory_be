const { Sequelize } = require('sequelize');

// Option 1: Passing a connection URI


// Option 3: Passing parameters separately (other dialects)
const sequelize = new Sequelize('victory', 'root', '', {
  host: 'localhost',
  dialect:'mysql'
});