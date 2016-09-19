const AWS = require('aws-sdk')

const Promise = require('bluebird')
// API Gateway
const _apigateway = new AWS.APIGateway()
const apigateway = Promise.promisifyAll(_apigateway)

// Cloudwatch
const _cloudwatch = new AWS.CloudWatch()
const cloudwatch = Promise.promisifyAll(_cloudwatch)


module.exports = {
  apigateway: apigateway,
  cloudwatch: cloudwatch
}
