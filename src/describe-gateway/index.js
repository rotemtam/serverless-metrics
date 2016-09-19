'use strict';
const apigateway = require('../lib/aws').apigateway

function extractLambdaFromARN(arn) {
  let re = /arn:aws:apigateway:.*?:lambda:path\/.*?\/functions\/arn:aws:lambda:.*?:.*?:function:(.*?)\/invocations/
  return arn.match(re)[1]
}

function fromSwagger(rest_api_id, stage_name) {
  return new Promise(function(resolve, reject) {
    apigateway.getExportAsync({
      exportType: 'swagger',
      restApiId: rest_api_id,
      stageName: 'prod',
      parameters: {"extensions":"integrations"}
    })
    .then(function(data) {
      data = JSON.parse(data.body)
      let paths = Object.keys(data.paths)
      let integrations = {}
      for (let path of paths) {
        integrations[path] = {}

        for (let method of Object.keys(data.paths[path])) {
          let arn = data.paths[path][method]['x-amazon-apigateway-integration']['uri']
          let fn_name = extractLambdaFromARN(arn)
          integrations[path][method] = {lambda: fn_name}
        }
      }
      resolve({
        title: data.info.title,
        basePath: `${data.host}${data.basePath}`,
        routes: integrations
      })
    })
    .catch(reject)
  });
}

module.exports = {
  fromSwagger: fromSwagger,
  extractLambdaFromARN: extractLambdaFromARN
}
