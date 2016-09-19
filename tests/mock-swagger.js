module.exports = {
  "swagger" : "2.0",
  "info" : {
    "version" : "2016-09-15T23:29:12Z",
    "title" : "API Gateway Title"
  },
  "host" : "mock.gateway.com",
  "basePath" : "/api",
  "schemes" : [ "https" ],
  "paths" : {
    "/account" : {
      "post" : {
        "consumes" : [ "application/json" ],
        "produces" : [ "application/json" ],
        "responses" : {
          "200" : {
            "description" : "200 response",
            "schema" : {
              "$ref" : "#/definitions/Empty"
            }
          },
          "400" : {
            "description" : "400 response"
          },
          "404" : {
            "description" : "404 response"
          }
        },
        "security" : [ {
          "api_key" : [ ]
        } ],
        "x-amazon-apigateway-integration" : {
          "credentials" : "arn:aws:iam::<account_id>:role/APIGatewayLambdaInvokeRole",
          "responses" : {
            "default" : {
              "statusCode" : "200"
            },
            "(.*)(Error|Exception)(.*)" : {
              "statusCode" : "400"
            },
            "(.*)(Not found)(.*)" : {
              "statusCode" : "404"
            }
          },
          "requestTemplates" : {
            "application/json" : "{\n   \"method\": \"$context.httpMethod\",\n   \"body\" : $input.json('$'),\n   \"headers\": {\n     #foreach($param in $input.params().header.keySet())\n     \"$param\": \"$util.escapeJavaScript($input.params().header.get($param))\" #if($foreach.hasNext),#end\n \n     #end\n   },\n   \"queryParams\": {\n     #foreach($param in $input.params().querystring.keySet())\n     \"$param\": \"$util.escapeJavaScript($input.params().querystring.get($param))\" #if($foreach.hasNext),#end\n \n     #end\n   },\n   \"pathParams\": {\n     #foreach($param in $input.params().path.keySet())\n     \"$param\": \"$util.escapeJavaScript($input.params().path.get($param))\" #if($foreach.hasNext),#end\n \n     #end\n   }\n}"
          },
          "uri" : "arn:aws:apigateway:us-east-1:lambda:path/2015-03-31/functions/arn:aws:lambda:us-east-1:<account>:function:project_postAccount/invocations",
          "passthroughBehavior" : "when_no_match",
          "httpMethod" : "POST",
          "type" : "aws"
        }
      }
    },
    "/account/{accountName}" : {
      "get" : {
        "consumes" : [ "application/json" ],
        "produces" : [ "application/json" ],
        "parameters" : [ {
          "name" : "accountName",
          "in" : "path",
          "required" : true,
          "type" : "string"
        } ],
        "responses" : {
          "200" : {
            "description" : "200 response",
            "schema" : {
              "$ref" : "#/definitions/Empty"
            }
          },
          "400" : {
            "description" : "400 response"
          },
          "404" : {
            "description" : "404 response"
          }
        },
        "security" : [ {
          "api_key" : [ ]
        } ],
        "x-amazon-apigateway-integration" : {
          "credentials" : "arn:aws:iam::<account>:role/APIGatewayLambdaInvokeRole",
          "responses" : {
            "default" : {
              "statusCode" : "200"
            },
            "(.*)(Error|Exception)(.*)" : {
              "statusCode" : "400"
            },
            "(.*)(Not found)(.*)" : {
              "statusCode" : "404"
            }
          },
          "requestTemplates" : {
            "application/json" : "{\n   \"method\": \"$context.httpMethod\",\n   \"body\" : $input.json('$'),\n   \"headers\": {\n     #foreach($param in $input.params().header.keySet())\n     \"$param\": \"$util.escapeJavaScript($input.params().header.get($param))\" #if($foreach.hasNext),#end\n \n     #end\n   },\n   \"queryParams\": {\n     #foreach($param in $input.params().querystring.keySet())\n     \"$param\": \"$util.escapeJavaScript($input.params().querystring.get($param))\" #if($foreach.hasNext),#end\n \n     #end\n   },\n   \"pathParams\": {\n     #foreach($param in $input.params().path.keySet())\n     \"$param\": \"$util.escapeJavaScript($input.params().path.get($param))\" #if($foreach.hasNext),#end\n \n     #end\n   }\n}"
          },
          "uri" : "arn:aws:apigateway:us-east-1:lambda:path/2015-03-31/functions/arn:aws:lambda:us-east-1:<account>:function:project_getAccount/invocations",
          "passthroughBehavior" : "when_no_match",
          "httpMethod" : "POST",
          "cacheNamespace" : "g5h6as",
          "cacheKeyParameters" : [ "method.request.path.accountName" ],
          "type" : "aws"
        }
      },
      "put" : {
        "consumes" : [ "application/json" ],
        "produces" : [ "application/json" ],
        "parameters" : [ {
          "name" : "accountName",
          "in" : "path",
          "required" : true,
          "type" : "string"
        } ],
        "responses" : {
          "200" : {
            "description" : "200 response",
            "schema" : {
              "$ref" : "#/definitions/Empty"
            }
          },
          "400" : {
            "description" : "400 response"
          },
          "404" : {
            "description" : "404 response"
          }
        },
        "security" : [ {
          "api_key" : [ ]
        } ],
        "x-amazon-apigateway-integration" : {
          "credentials" : "arn:aws:iam::<account>:role/APIGatewayLambdaInvokeRole",
          "responses" : {
            "default" : {
              "statusCode" : "200"
            },
            "(.*)(Error|Exception)(.*)" : {
              "statusCode" : "400"
            },
            "(.*)(Not found)(.*)" : {
              "statusCode" : "404"
            }
          },
          "requestTemplates" : {
            "application/json" : "{\n   \"method\": \"$context.httpMethod\",\n   \"body\" : $input.json('$'),\n   \"headers\": {\n     #foreach($param in $input.params().header.keySet())\n     \"$param\": \"$util.escapeJavaScript($input.params().header.get($param))\" #if($foreach.hasNext),#end\n \n     #end\n   },\n   \"queryParams\": {\n     #foreach($param in $input.params().querystring.keySet())\n     \"$param\": \"$util.escapeJavaScript($input.params().querystring.get($param))\" #if($foreach.hasNext),#end\n \n     #end\n   },\n   \"pathParams\": {\n     #foreach($param in $input.params().path.keySet())\n     \"$param\": \"$util.escapeJavaScript($input.params().path.get($param))\" #if($foreach.hasNext),#end\n \n     #end\n   }\n}"
          },
          "uri" : "arn:aws:apigateway:us-east-1:lambda:path/2015-03-31/functions/arn:aws:lambda:us-east-1:<account>:function:project_putAccount/invocations",
          "passthroughBehavior" : "when_no_match",
          "httpMethod" : "POST",
          "cacheNamespace" : "g5h6as",
          "cacheKeyParameters" : [ "method.request.path.accountName" ],
          "type" : "aws"
        }
      }
    },
  },
  "securityDefinitions" : {
    "api_key" : {
      "type" : "apiKey",
      "name" : "x-api-key",
      "in" : "header"
    }
  },
  "definitions" : {
    "Empty" : {
      "type" : "object"
    }
  }
}
