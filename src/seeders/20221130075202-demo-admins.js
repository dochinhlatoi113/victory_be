'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
     return queryInterface.bulkInsert('admins', [
      {
        firstName: 'admin1',
        lastName: 'admin1',
        email: 'admin1@example.com',
        password: '123456',
        userName:'admin1',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        firstName: 'admin2',
        lastName: 'admin2',
        email: 'admin1@example.com',
        password: '123456',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        firstName: 'admin3',
        lastName: 'admin3',
        email: 'admin1@example.com',
        password: '123456',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        firstName: 'admin4',
        lastName: 'admin4',
        email: 'admin1@example.com',
        password: '123456',
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
     return queryInterface.bulkDelete('admins', null, {});
  }
};
