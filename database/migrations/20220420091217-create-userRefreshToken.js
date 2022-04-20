'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('UserRefreshToken', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      refreshToken: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      expiredAt: {
        type: Sequelize.DATE,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      deletedAt: {
        type: Sequelize.DATE,
      },
    });

    await queryInterface.addColumn('UserRefreshToken', 'userId', {
      type: Sequelize.UUID,
      references: {
        model: 'User',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });

    await Promise.all([
      queryInterface.addIndex('UserRefreshToken', ['refreshToken']),
      queryInterface.addIndex('UserRefreshToken', ['userId', 'refreshToken']),
      queryInterface.addIndex('UserRefreshToken', ['deletedAt']),
    ]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('UserRefreshToken');
  },
};
