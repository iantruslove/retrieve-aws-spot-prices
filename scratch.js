"use strict";
var persist = require("persist");
var type = persist.type;

// define some model objects
var Phone = persist.define("Phone", {
  "number": type.STRING
});

//Person = persist.define("Person", {
  //"name": type.STRING
//}).hasMany(this.Phone);

persist.connect({
  driver: 'sqlite3',
  filename: 'test.db',
  trace: true
}, function (err, connection) {
  //Person.using(connection).all(function(err, people) { });
  var p = new Phone({number: "555-123-1235"});
  p.save(connection, function () {});

});
