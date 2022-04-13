'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('User', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      confirmedToken: {
        type: Sequelize.STRING,
      },
      expiredConfiremdToken: {
        type: Sequelize.DATE,
      },
      isActived: {
        type: Sequelize.ENUM('Actived', 'Pending'),
        defaultValue: 'Pending',
      },
      role: {
        type: Sequelize.ENUM('Admin', 'User'),
        defaultValue: 'User',
      },
      resetPasswordToken: {
        type: Sequelize.STRING,
      },
      expiredPasswordToken: {
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
  },

  async down(queryInterface) {
    await queryInterface.dropTable('User');
  },
};
