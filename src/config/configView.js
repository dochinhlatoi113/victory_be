var express = require('express');
var expressHbs = require('express-handlebars');
const Handlebars = require('handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
var path = require("path");
const { or } = require('sequelize');
const moment = require('moment');
const configView = (app) => {


    app.engine('handlebars', expressHbs(

        {
            defaultLayout: 'main',
            handlebars: allowInsecurePrototypeAccess(Handlebars),
            helpers: {
                inc: function (value, options) {
                    return parseInt(value) + 1;
                },
                xIf: function (arg1, arg2, options) {
                    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
                },
                xIf2: function (arg1, arg2, options) {
                    return (arg1 != arg2) ? options.fn(this) : options.inverse(this);
                },
                xIf3: function (arg1, arg2,arg3,arg4, options) {
                    return (arg1 == arg2 && arg3 == arg4) ? options.fn(this) : options.inverse(this);
                },
                orIf: function (arg1, arg2, arg3, arg4, options) {
                    return (arg1 == arg2 || arg3 == arg4) ? options.fn(this) : options.inverse(this);
                },
                formatDate: function (datetime, format) {
                    var DateFormats = {
                        short: "DD MMMM - YYYY",
                        long: "dddd DD.MM.YYYY"
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
                setChecked: function (arg1, arg2) {
                    if (arg1 == arg2) {
                        return "checked";
                    } else {
                        return "";
                    }
                },
                setSelected: function (arg1, arg2) {
                    if (arg1 == arg2) {
                        return "selected";
                    } else {
                        return "";
                    }
                },
                deleteItem: function(arg1,arg2){
                    let arr = [];
                    let arrUser = [];
                    arr.push(arg1)
                    arrUser.push(arg2)
                    return arr.concat(arrUser)
                
                },
                switch:function(value, options) {
                    this.switch_value = value;
                    this.switch_break = false;
                    return options.fn(this);
                  
                },
                case:function(value, options) {
                    if (value == this.switch_value) {
                        this.switch_break = true;
                        return options.fn(this);
                      }
                },
                default:function(value, options) {
                    if (this.switch_break == false) {
                      return value;
                    }
                 },   
                 arrayIncludes:function (array, element, options) {
                    if (array.indexOf(element) !== -1) {
                      return options.fn(this);
                    }
                    return options.inverse(this);
                  },
                  eq:function(a, b) {
                    return a == b;
                  }
            },
        }));
    app.set('view engine', 'handlebars');
}
module.exports = configView