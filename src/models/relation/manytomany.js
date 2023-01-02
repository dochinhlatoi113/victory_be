const { Op } = require("sequelize");
const db= require("../index")

const customer_programs = sequelize.define('customer_programs');
const customers = sequelize.define('customers');
const programs = sequelize.define('programs');
customers.belongsToMany(programs, {
    through: "customer_programs", onDelete: 'cascade', onUpdate: 'CASCADE',
});
programs.belongsToMany(customers, {
    through: "customer_programs", onDelete: 'cascade', onUpdate: 'CASCADE',
});

module.exports = db