'use strict';
const co = require('co')
const moment = require('moment')
const DescribeGateway = require('../src/describe-gateway')
const GetHourlyMetrics = require('../src/get-hourly-metrics')

const DEFAULTS = {
  hours: 24
}

function getGatewayMetrics(gateway_id, stage_name, hours) {
  hours = hours || DEFAULTS.hours
  return co.wrap(_getGatewayMetrics)(gateway_id, stage_name, hours)
}
function *_getGatewayMetrics(gateway_id, stage_name, hours) {

  let gw = yield DescribeGateway.fromSwagger(gateway_id, stage_name)
  let route_names = Object.keys(gw.routes)
  let proms = {};
  for(let route of route_names) {
    proms[route] = {}
    for (let method of Object.keys(gw.routes[route])) {
      proms[route][method] = getMetricsForResource({
        api_name: gw.title,
        function_name: gw.routes[route][method].lambda,
        method: method,
        resource: route,
        stage_name: stage_name,
        hours: hours
      })
    }
  }

  return {
    data: yield proms,
    time: {
      start : moment().utc().subtract(hours, 'hours').format(),
      end   : moment().utc().format()
    }
  };
}

function _getSum(Datapoints) {
  try {
    return Datapoints[0].Sum
  } catch(err) {
    return 0
  }
}

function getAPIGatewayMetrics(metric, params) {
  params = params || {};
  return new Promise(function(resolve, reject) {
    GetHourlyMetrics.forAPIGateway({
     api_name: params.api_name,
     method: params.method,
     resource: params.resource,
     stage_name: params.stage_name,
     metric: metric,
     hours: params.hours
    })
    .then(function(data) {
      resolve(_getSum(data.data.Datapoints))
    })
    .catch(reject)
  });
}

function getLambdaMetrics(metric, params) {
  return new Promise(function(resolve, reject) {
    GetHourlyMetrics.forLambda({
     function_name: params.function_name,
     metric: metric,
     hours: params.hours
    })
    .then(function(data) {
      resolve(_getSum(data.data.Datapoints))
    })
    .catch(reject)
  });

}

function getLambdaInvocations(params) {
  return getLambdaMetrics('Invocations', params)
}

function getLambdaErrors(params) {
  return getLambdaMetrics('Errors', params)
}

function getLambdaThrottles(params) {
  return getLambdaMetrics('Throttles', params)
}

function get5XXErrorsToday(params) {
  return getAPIGatewayMetrics('5XXError', params)
}

function get4XXErrorsToday(params) {
  return getAPIGatewayMetrics('4XXError', params)
}

function getCallsToday(params) {
  return getAPIGatewayMetrics('Count', params)
}

function getMetricsForResource(params) {
  return {
    'LambdaInvocations': getLambdaInvocations(params),
    'LambdaErrors': getLambdaErrors(params),
    'LambdaThrottles': getLambdaThrottles(params),
    'Count': getCallsToday(params),
    '4XXError': get4XXErrorsToday(params),
    '5xxError': get5XXErrorsToday(params)
  }
}



module.exports = {
  getGatewayMetrics: getGatewayMetrics
}
