aws_spot_price_history = require '../lib/aws-spot-price-history.js'

describe "the basics", ->
  it "should be awesome", ->
    expect(aws_spot_price_history.awesome()).toBe("awesome")
