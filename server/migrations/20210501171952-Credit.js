'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return Promise.all([
      queryInterface.addColumn(
        'Credits',
        'notifyCheck',
        {
          type: Sequelize.STRING
        }
      ),
      queryInterface.addColumn(
        'Credits',
        'linkToTicket',
        {
          type: Sequelize.STRING
        }
      ),
      queryInterface.addColumn(
        'Credits',
        'autoRenewal',
        {
          type: Sequelize.STRING
        }
      ),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
     return Promise.all([
      queryInterface.removeColumn('Credits', 'notifyCheck'),
      queryInterface.removeColumn('Credits', 'linkToTicket'),
      queryInterface.removeColumn('Credits', 'autoRenewal')
    ]);
  }
};
