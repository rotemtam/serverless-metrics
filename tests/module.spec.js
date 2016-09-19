'use strict';

const DescribeGateway = require('../src/describe-gateway')
const GetHourlyMetrics = require('../src/get-hourly-metrics')
const ServerlessMetrics = require('../src')
const AWS = require('../src/lib/aws')
const expect = require('chai').expect
const sinon = require('sinon')
const MockSwagger = require('./mock-swagger')

require('co-mocha')
require('sinon-as-promised')

describe('Get API Gateway Metrics', function() {
  const HOURS = 5;
  let res, swagger = MockSwagger;
  before(function() {
    sinon.stub(AWS.apigateway, 'getExportAsync').resolves({
      body: JSON.stringify(MockSwagger)
    })
    sinon.stub(AWS.cloudwatch, 'getMetricStatisticsAsync').resolves({
        Datapoints: [
          {Sum: 100}
        ]
    })
    sinon.spy(GetHourlyMetrics, 'forAPIGateway')
    sinon.spy(GetHourlyMetrics, 'forLambda')
  })

  before(function *() {
    res = yield ServerlessMetrics.getGatewayMetrics('gateway_id', 'stage_name', HOURS)
  })

  after(function() {
    GetHourlyMetrics.forAPIGateway.restore()
    GetHourlyMetrics.forLambda.restore()
  })

  it('should metrics for each path', function() {
    let paths = Object.keys(MockSwagger.paths).sort()
    expect(paths).to.eql(Object.keys(res.data).sort())
  })

  it('should always get the same amount of hours', function() {
    let calls = GetHourlyMetrics.forAPIGateway.args;
    for(let call of calls) {
      expect(call[0].hours).to.eql(HOURS)
    }
  })

  it('should return calls, errors, invocation, lambda errors and throttles', function() {

    for(let path of Object.keys(res.data)) {
      for(let method of Object.keys(res.data[path])) {
        let metrics = Object.keys(res.data[path][method]).sort()
        expect(metrics).to.eql([
          "4XXError",
          "5xxError",
          "Count",
          "LambdaErrors",
          "LambdaInvocations",
          "LambdaThrottles",
        ])
      }
    }

  })

  after(function() {
    AWS.apigateway.getExportAsync.restore()
    AWS.cloudwatch.getMetricStatisticsAsync.restore()
  })


})
