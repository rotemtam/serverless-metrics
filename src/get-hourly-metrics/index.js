'use strict';
const moment = require('moment')
const cloudwatch = require('../lib/aws').cloudwatch

const DEFAULTS = {
  statistics: ['Sum'],
  unit: 'Count',
  hours: 1
}

function forAPIGateway(params) {
  params = params || {};
  params = Object.assign({}, DEFAULTS, params)
  return new Promise(function(resolve, reject) {
    getLastHoursMetrics({
      namespace: 'AWS/ApiGateway',
      hours: params.hours,
      metric: params.metric,
      statistics: params.statistics,
      unit: params.unit,
      dimensions: [
        {Name: "ApiName", Value: params.api_name},
        {Name: "Method", Value: params.method.toUpperCase()},
        {Name: "Resource", Value: params.resource},
        {Name: "Stage", Value: params.stage_name}
      ]
    })
    .then(function(res) {
      resolve({
        resource: params.resource,
        method: params.method,
        hours: params.hours,
        metric: params.metric,
        data: res
      })
    })
    .catch(reject)
  });
}

function forLambda(params) {
  params = params || {};
  params = Object.assign({}, DEFAULTS, params)
  return new Promise(function(resolve, reject) {
    getLastHoursMetrics({
      namespace: 'AWS/Lambda',
      hours: params.hours,
      metric: params.metric,
      statistics: params.statistics,
      unit: params.unit,
      dimensions: [
        {Name: "FunctionName", Value: params.function_name},
      ]
    })
    .then(function(res) {
      resolve({
        function_name: params.function_name,
        method: params.method,
        hours: params.hours,
        metric: params.metric,
        data: res
      })
    })
    .catch(reject)
  });
}


function getLastHoursMetrics(params) {
  params = params || {};

  return cloudwatch.getMetricStatisticsAsync({
   StartTime: moment().utc().subtract(params.hours, 'hour').format(),
   EndTime: moment().utc().format(),
   Namespace: params.namespace,
   MetricName: params.metric,
   Period:60 * 60 * params.hours,
   Statistics: params.statistics,
   Dimensions: params.dimensions,
   Unit: params.unit//'Count'
  })
}

module.exports = {
  forAPIGateway: forAPIGateway,
  forLambda: forLambda
}
