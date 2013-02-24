#service = require '../../lib/aws/spot-price-service.js'

describe "AWS Spot Price service", ->

  describe "querying AWS", ->
    it "does something", ->
      expect("true").toBe "true"

  describe "Spot price result sets", ->
    xit "has a forEach iterator", ->
      resultSet = Object.create service.ResultSet.prototype
      expect(resultSet.forEach instanceof Function).toBeTruthy()

    describe "the iterator", ->
      xit "is called once per item in the result set", ->
        resultSet = new service.ResultSet()
        # add 4 things to resultSet
        iterator = ->
        resultSet.forEach iterator
        expect(iterator.callCount).toEqual 4
