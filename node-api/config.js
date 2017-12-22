'use strict'

let mysql = require('mysql');

module.exports = {
  name: 'gov-entities-api',
  hostname : 'http://localhost',
  version: '0.0.1',
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 8080,
  db: {
    connection  : mysql.createConnection({
      host        : 'localhost',
      user        : 'root',
      password    : '123',
      database    : 'gov_entities',
      dateStrings : true,
      typeCast    : function (field, next) {
            if (field.type == 'JSON') {
              return (JSON.parse(field.string())); 
            }
            return next();
      }
    })
  }
}