'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    class Book extends Sequelize.Model {}
    
    Book.init({
        id: {
            type: Sequelize.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
            },
        title: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false,
            validate: {
              notEmpty: {
                msg: "Please enter a title",
              }
            }
          },
        author: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false,
            validate: {
              notEmpty: {
                msg: "Please enter an author",
              }
            }
          },
        genre: {
            type: Sequelize.DataTypes.STRING,
            validate: {
              notEmpty: {
                msg: "Please enter a genre",
              }
            }
        },
        year: {
            type: Sequelize.DataTypes.NUMBER,
            allowNull: false,
            validate: {
              notEmpty: {
                msg: "Please enter a year",
              }
            }
       }
    },      
     {sequelize});
    
        return Book;
      };
    