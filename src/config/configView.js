var express = require('express');
var expressHbs  = require('express-handlebars');
const Handlebars = require('handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
var path = require("path");
const { or } = require('sequelize');

const configView = (app) => {
 
  
    app.engine('handlebars', expressHbs(
        
        {defaultLayout: 'main',
         handlebars: allowInsecurePrototypeAccess(Handlebars),
         helpers: {
            inc: function (value, options) {
                return parseInt(value) + 1;
            },
            xIf:function (arg1, arg2, options) {
                return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
              },
            orIf:function (arg1, arg2 , arg3 , arg4 , options) {
                return (arg1 == arg2 || arg3 == arg4 ) ? options.fn(this) : options.inverse(this);
            }, 
         },
        }));
    app.set('view engine', 'handlebars'); 
}
module.exports = configView