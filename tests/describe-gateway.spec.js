'use strict';

const DescribeGateway = require('../src/describe-gateway')
const AWS = require('../src/lib/aws')
const expect = require('chai').expect
const sinon = require('sinon')
const MockSwagger = require('./mock-swagger')

require('co-mocha')
require('sinon-as-promised')



describe('DescribeGateway', () => {

  describe('Extract Lambda from ARN', () => {
    it('should extract the function name from the arn string', function() {
      let arn = MockSwagger.paths['/account']['post']['x-amazon-apigateway-integration']['uri']
      expect(DescribeGateway.extractLambdaFromARN(arn)).to.equal('project_postAccount')
    })
  });

  describe('from swagger', function() {
    let res;
    before(function() {
      sinon.stub(AWS.apigateway, 'getExportAsync').resolves({
        body: JSON.stringify(MockSwagger)
      })
    })
    before(function *() {
      res = yield DescribeGateway.fromSwagger('rest_api_id', 'stage_name')
    })

    after(function() {
      AWS.apigateway.getExportAsync.restore()
    })

    it('should return a representaion of the api', function() {
      expect(res).to.eql({
        title: 'API Gateway Title',
        basePath: 'mock.gateway.com/api',
        routes: {
          "/account":{
            post:
              {lambda:"project_postAccount"
            }
          },
          "/account/{accountName}":{
            get: {
              lambda: "project_getAccount"
            },
            put:{
              lambda:"project_putAccount"
            }
          }
        }
      })

    })
  })

});
