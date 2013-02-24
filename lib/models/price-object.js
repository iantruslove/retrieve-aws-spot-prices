var persist = require('persist');
var type = persist.type;

module.exports = persist.define("PriceObject", {
  instanceType: type.STRING,
  productDescription: type.STRING,
  spotPrice: type.REAL,
  timestamp: type.DATETIME,
  availabilityZone: type.STRING
});

