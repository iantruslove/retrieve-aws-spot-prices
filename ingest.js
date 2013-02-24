// ingest.js - command line interface to retrieve and ingest spot price data from AWS

// options:
// - --startTime <time>, -s <time> - 
// - --endTime <time>, -e <time> - 
// - --instanceType <type>, -t <type> - 
// - --availabilityZone <zone>, -z <zone> - 
var async = require('async');
var persist = require('persist');
persist.env = 'dev';

var awsQueryOptions, accessKeyId, secretAccessKey, testingMode = false;

var type = persist.type;
var PriceObject = persist.define("PriceObject", {
  instanceType: type.STRING,
  productDescription: type.STRING,
  spotPrice: type.REAL,
  timestamp: type.DATETIME,
  availabilityZone: type.STRING
});


function parseArgs(args) {
  var options = {};

  while(args.length) {
    var arg = args.shift();

    switch(arg)
    {
      case '--testing':
        testingMode = true;
        break;
      case '--startTime':
      case '-s':
        options.StartTime = args.shift();
        break;
      case '--endTime':
      case '-e':
        options.EndTime = args.shift();
        break;
      case '--instanceType':
      case '-t':
        options.InstanceType = args.shift();
        break;
      case '--availabilityZone':
      case '-z':
        options.AvailabilityZone = args.shift();
        break;
      case '--accessKeyId':
      case '-i':
        accessKeyId = args.shift();
        break;
      case '--secretAccessKey':
      case '-k':
        secretAccessKey = args.shift();
        break;
      default:
        console.error("Unknown option: " + arg);
        process.exit(1);
        break;
    }
  }

  return options;
}


awsQueryOptions = parseArgs(process.argv.slice(2));

var handleSpotPrices = function(awsResponse, dataStoreQueue, callback) {
  var priceObjects = awsResponse.spotPriceHistorySet.item,
      priceObjectsIngested = 0;

  console.log("Got " + priceObjects.length + " prices back");

  priceObjects.forEach(function(priceObject) {

    dataStoreQueue.addSpotPriceToQueue(priceObject, function(err, result) {
      if (err) {
        callback(err, result);
      }
      console.log("Completed ingest of " + JSON.stringify(priceObject));
      priceObjectsIngested++;
      if (priceObjectsIngested === priceObjects.length) {
        callback();
      }
    });
  });
};

var dataStoreQueue = (function () {
  var persist = require("persist");
  var DataStoreQueue;

  DataStoreQueue = function () {
    var queueAction = function(priceObjectData, callback) {
      // use this.connection to write to the database using persist
      var conn = this.connection;

      // ensure the datum doesn't already exist
      console.log("Checking database for " + JSON.stringify(priceObjectData) + "...");

      var searchCriteria = {
        instanceType: priceObjectData.instanceType,
        productDescription: priceObjectData.productDescription,
        timestamp: priceObjectData.timestamp,
        availabilityZone: priceObjectData.availabilityZone
      };

      PriceObject.where(searchCriteria).count(conn, function(err, count) {
        if (err) {
          callback(err);
          return;
        }

        if (count > 0) {
          console.log("This one already exists: " + JSON.stringify(priceObjectData));
          callback();
          return;
        }

        // insert the datum
        var model = new PriceObject(priceObjectData);
        model.save(conn, callback);
      });

    };

    this.q = async.queue(queueAction.bind(this), 0); // start queue with no workers

    this.q.drain = function () {
      console.log("All data processed");
    }

    var connect_callback = function (err, connection) {
      if (err) {
        // oh dear
        console.error("Unable to create database connection");
        process.exit(1);
      } else {
        console.log("DB connection successfully initialized");
        this.connection = connection;
        this.q.concurrency = 1;  // enable the queue to start processing
      }
    };

    persist.connect(connect_callback.bind(this));
  };

  DataStoreQueue.prototype.addSpotPriceToQueue = function(priceObject, callback) {
    this.q.push(priceObject, callback);
  };

  return new DataStoreQueue();
}());


var getBunchOfPrices = function(ec2, options, dataStoreQueue, nextToken) {
  options.NextToken = nextToken;   // undefined is just fine here too

  // call something of the EC2 query API
  ec2.request('DescribeSpotPriceHistory', options, function (error, response) {
    if (error) {
      console.error(JSON.stringify(error, null, 2));
      process.exit(2);
    } else {

      if (response.nextToken && response.nextToken.length > 20) {
        handleSpotPrices(response, dataStoreQueue, function(err, result) {
          if (err) {
            console.error(err);
            process.exit(1);
          } else {
            console.log("One batch done ok!");
          }

        });
        getBunchOfPrices(ec2, options, dataStoreQueue, response.nextToken);
      } else {
        handleSpotPrices(response, dataStoreQueue, function(err, result) {
          if (err) {
            console.error(err);
            process.exit(1);
          } else {
            console.log("All batches done ok!");
            process.exit(0);
          }
        });
      }
    }
  });
};

if (testingMode) {
  var fakeResponse = {
    spotPriceHistorySet: {
      item: [
        { spotPrice: 0.23, instanceType: "m1.large", timestamp: "2013-01-01T12:23:34.000Z", productDescription: "Linux", availabilityZone: "us-east-9a" },
        { spotPrice: 0.27, instanceType: "m1.large", timestamp: "2013-01-01T13:23:34.000Z", productDescription: "Linux", availabilityZone: "us-east-9a" },
        { spotPrice: 0.39, instanceType: "m1.large", timestamp: "2013-01-01T14:23:34.000Z", productDescription: "Linux", availabilityZone: "us-east-9a" },
        { spotPrice: 0.50, instanceType: "m1.large", timestamp: "2013-01-01T15:23:34.000Z", productDescription: "Linux", availabilityZone: "us-east-9a" }
      ]
    },
    nextToken: {} // if there isn't a next, it's an empty object
  };

  handleSpotPrices(fakeResponse, dataStoreQueue, function (err, result) {
    if (err) {
      console.error(err);
      process.exit(1);
    } else {
      console.log("ok!");
      process.exit(0);
    }
  });
} else {
  var ec2 = require('aws2js').load('ec2', accessKeyId, secretAccessKey);
  getBunchOfPrices(ec2, awsQueryOptions, dataStoreQueue);
}

//EOF
