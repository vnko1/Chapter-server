'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const indexExists = await queryInterface.showIndex('Users', {
      attributes: ['name'],
      where: {
        name: 'fulltext_index',
      },
    });

    if (indexExists) {
      await queryInterface.removeIndex('Users', 'fulltext_index');
    }

    await queryInterface.addIndex('Users', {
      fields: ['firstName', 'nickName', 'lastName', 'status', 'location'],
      type: 'FULLTEXT',
      name: 'fulltext_index',
    });
  },

  async down(queryInterface) {
    try {
      await queryInterface.removeIndex('Users', 'fulltext_index');
    } catch (error) {
      console.error("Index 'fulltext_index' does not exist, skipping removal.");
    }
  },
};
