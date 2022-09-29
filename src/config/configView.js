var express = require('express');
var expressHbs  = require('express-handlebars');
const Handlebars = require('handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
var path = require("path")

const configView = (app) => {
    app.engine('handlebars', expressHbs(
        {defaultLayout: 'main',
         handlebars: allowInsecurePrototypeAccess(Handlebars),
         helpers: {
            inc: function (value, options) {
                return parseInt(value) + 1;
            }
        },
        }));
    app.set('view engine', 'handlebars'); 
    
}
module.exports = configView