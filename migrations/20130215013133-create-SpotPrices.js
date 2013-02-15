var dbm = require('db-migrate');
var async = require('async');
var type = dbm.dataType;

exports.up = function(db, callback) {

  async.series([
    db.createTable.bind(db, 'SpotPrices', {
      id: { type: "int", primaryKey: true, autoIncrement: true },
      timestamp: { type: "text", notNull: true },
      price: { type: "real", notNull: true },
      instanceType: { type: "text", notNull: true },
      productDescription: { type: "text", notNull: true },
      availabilityZone: { type: "text", notNull: true }
    }),
    db.addIndex.bind(
      db,
      'SpotPrices',
      'index_instance_info',
      ['instanceType', 'productDescription', 'availabilityZone']
    )
  ], callback);

};

exports.down = function(db, callback) {
  db.dropTable('SpotPrices', callback);
};
