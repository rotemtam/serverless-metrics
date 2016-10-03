## Serverless Metrics (WIP)

### Get KPIs for API Gateway + Lambda

__Why__ - AWS API Gateway + Lambda is a great stack for developing serverless
apps.  Currently, trying to get a good overview of whats going on with your
service is very difficult.

This project's goal is to let you easily get key metrics about your serverless
service, for each resource + method of your gateway:

* Calls to API Gateway
* Errors returned by API Gateway
* Lambda Invocations
* Lambda Errors
* Lambda Throttles

### Installation

```js
npm i --save serverless-metrics
```

Usage

```js
const ServerlessMetrics = require('serverless-metrics')
const HOURS_TO_GET = 5 // default 24
ServerlessMetrics.getGatewayMetrics('gateway_id', 'stage_name', HOURS_TO_GET)
  .then(function(data) {
    console.log(data)
  })
  .catch(console.error)
/* Returns
{
  "data": {
  "/path": {
    "get": {
      "4XXError": 0,
      "5xxError": 0,
      "Count": 0,
      "LambdaErrors": 0,
      "LambdaInvocations": 0,
      "LambdaThrottles": 0,
    }
  },
  "/other_path": {
    "post": {
      "4XXError": 0,
      "5xxError": 0,
      "Count": 0,
      "LambdaErrors": 0,
      "LambdaInvocations": 0,
      "LambdaThrottles": 0,
    }
  }  
  },
  "time": {
    "start": "2016-09-19T03:43:35Z",
    "end": "2016-09-19T08:43:35Z"
  }
}

}
*/

```

### License

MIT
