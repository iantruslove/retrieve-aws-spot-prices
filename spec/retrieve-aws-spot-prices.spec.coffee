retrieve_aws_spot_prices = require '../lib/retrieve-aws-spot-prices.js'

describe "the basics", ->
  it "should be awesome", ->
    expect(retrieve_aws_spot_prices.awesome()).toBe "awesome!"
