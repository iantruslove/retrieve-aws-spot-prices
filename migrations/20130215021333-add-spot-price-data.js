var dbm = require('db-migrate');
var async = require('async');
var type = dbm.dataType;

/*
<instanceType>m1.small</instanceType>
<productDescription>Linux/UNIX</productDescription>
<spotPrice>0.287</spotPrice>
<timestamp>2009-12-04T20:56:05.000Z</timestamp>
<availabilityZone>us-east-1a</availabilityZone>
*/

var initialPriceData = [
  [ '2009-12-04T10:56:05.000Z', '0.2', 'm1.small', 'Linux/UNIX', 'us-east-1a' ],
  [ '2009-12-04T11:56:05.000Z', '0.3', 'm1.small', 'Linux/UNIX', 'us-east-1a' ],
  [ '2009-12-04T12:56:05.000Z', '0.48', 'm1.small', 'Linux/UNIX', 'us-east-1a' ],
  [ '2009-12-04T13:56:05.000Z', '0.58', 'm1.small', 'Linux/UNIX', 'us-east-1a' ],
  [ '2009-12-04T14:56:05.000Z', '0.47', 'm1.small', 'Linux/UNIX', 'us-east-1a' ],
  [ '2009-12-04T15:56:05.000Z', '0.37', 'm1.small', 'Linux/UNIX', 'us-east-1a' ],
  [ '2009-12-04T16:56:05.000Z', '0.27', 'm1.small', 'Linux/UNIX', 'us-east-1a' ]
];

exports.up = function(db, callback) {
  var iterator = function (priceData, callback) {
    db.insert('SpotPrices',
        ['timestamp', 'price', 'instanceType', 'productDescription', 'availabilityZone'],
        priceData,
        callback);
  };

  async.eachSeries(initialPriceData, iterator, callback);
};

exports.down = function(db, callback) {
  db.runSql('DELETE FROM SpotPrices', callback);
};
