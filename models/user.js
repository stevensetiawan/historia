'use strict';
const bcrypt = require('../helpers/bcrypt');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: 'Must be filled with email'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Password must be filled'
        },
        len: [5, 20],
        isAlphanumeric: {
          msg: 'Password must be contain between alphabet and number'
        }
      }
    },
  }, {
    sequelize,
    tableName: 'Users',
    underscored: true,
    hooks: {
      beforeCreate: (user, options) => {
        user.password = bcrypt.hasher(user.password)
      }
    }
  });
  User.associate = function(models) {
    // associations can be defined here
  };

  Object.defineProperty(User.prototype, 'entity', {
    get() {
      return {
        id: this.id,
        email: this.email,
      }
    }
  });

  return User;
};