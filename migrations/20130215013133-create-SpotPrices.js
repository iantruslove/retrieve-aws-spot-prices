var dbm = require('db-migrate');
var async = require('async');
var type = dbm.dataType;

exports.up = function(db, callback) {

  async.series([
    db.createTable.bind(db, 'PriceObjects', {
      id: { type: "int", primaryKey: true, autoIncrement: true },
      timestamp: { type: "text", notNull: true },
      spot_price: { type: "real", notNull: true },
      instance_type: { type: "text", notNull: true },
      product_description: { type: "text", notNull: true },
      availability_zone: { type: "text", notNull: true }
    }),
    db.addIndex.bind(
      db,
      'PriceObjects',
      'index_instance_info',
      ['instance_type', 'product_description', 'availability_zone']
    )
  ], callback);

};

exports.down = function(db, callback) {
  db.dropTable('PriceObjects', callback);
};
