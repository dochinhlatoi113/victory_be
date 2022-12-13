var express = require('express');
var expressHbs  = require('express-handlebars');
const Handlebars = require('handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
var path = require("path");
const { or } = require('sequelize');
const moment = require('moment');
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
            formatDate :function(datetime, format){
                var DateFormats = {
                    short: "DD MMMM - YYYY",
                    long: "dddd DD.MM.YYYY HH:mm"
             };
             if (moment) {
                // can use other formats like 'lll' too
                format = DateFormats[format] || format;
                return moment(datetime).format(format);
              }
              else {
                return datetime;
              }
            },
            setChecked:function(arg1,arg2){
                if ( arg1 == arg2 ) {
                    return "checked";
                 } else {
                    return "";
                 }
            }
         },
        }));
    app.set('view engine', 'handlebars'); 
}
module.exports = configView