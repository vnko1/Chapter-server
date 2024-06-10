'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.addIndex('Users', {
      fields: [
        'firstName',
        'nickName',
        'lastName',
        'status',
        'location',
        'email',
      ],
      type: 'FULLTEXT',
      name: 'fulltext_index',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex('Users', 'fulltext_index');
  },
};
