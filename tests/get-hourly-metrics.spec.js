'use strict';

const GetMetrics = require('../src/get-hourly-metrics')
const AWS = require('../src/lib/aws')
const expect = require('chai').expect
const sinon = require('sinon')

require('co-mocha')
require('sinon-as-promised')

describe('Get Hourly Metrics', () => {

  let clock;
  before(function() {
    clock = sinon.useFakeTimers()
  })

  after(function() {
    clock.restore()
  })

  describe('For API Gateway', () => {
    let res;
    before(function() {
      sinon.stub(AWS.cloudwatch, 'getMetricStatisticsAsync').resolves({})
    })

    before(function *() {
      let params = {
        api_name: 'testGateway',
        method: 'get',
        resource: '/accounts',
        stage_name: 'prod',
        metric: '4XXError'
      };
      res = yield GetMetrics.forAPIGateway(params)
    })

    it('should get metric statistics from cloud watch', function() {
      let args = AWS.cloudwatch.getMetricStatisticsAsync.getCall(0).args[0]

      expect(args).to.eql({
         "StartTime":"1969-12-31T23:00:00Z",
         "EndTime":"1970-01-01T00:00:00Z",
         "Namespace":"AWS/ApiGateway",
         "MetricName":"4XXError",
         "Period":3600,
         "Statistics":[
            "Sum"
         ],
         "Dimensions":[
            {
               "Name":"ApiName",
               "Value":"testGateway"
            },
            {
               "Name":"Method",
               "Value":"GET"
            },
            {
               "Name":"Resource",
               "Value":"/accounts"
            },
            {
               "Name":"Stage",
               "Value":"prod"
            }
         ],
         "Unit":"Count"
      })
    })

    after(function() {
      AWS.cloudwatch.getMetricStatisticsAsync.restore()
    })
  });

  describe('For Lambda', function(){

    let res;
    before(function() {
      sinon.stub(AWS.cloudwatch, 'getMetricStatisticsAsync').resolves({})
    })

    before(function *() {
      let params = {
        function_name: 'funcName',
        metric: 'Invocations'
      };
      res = yield GetMetrics.forLambda(params)
    })

    it('should get metric statistics from cloud watch', function() {
      let args = AWS.cloudwatch.getMetricStatisticsAsync.getCall(0).args[0]

      expect(args).to.eql({
         "StartTime":"1969-12-31T23:00:00Z",
         "EndTime":"1970-01-01T00:00:00Z",
         "Namespace":"AWS/Lambda",
         "MetricName":"Invocations",
         "Period":3600,
         "Statistics":[
            "Sum"
         ],
         "Dimensions":[
            {
               "Name":"FunctionName",
               "Value":"funcName"
            }
         ],
         "Unit":"Count"
      })
    })

    after(function() {
      AWS.cloudwatch.getMetricStatisticsAsync.restore()
    })
  });

});
