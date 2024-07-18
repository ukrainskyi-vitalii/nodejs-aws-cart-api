from aws_cdk import (
    Stack,
    aws_lambda as _lambda,
    aws_apigateway as apigateway,
    Duration
)
from constructs import Construct


class CdkNestStack(Stack):

    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        # Lambda function for Nest.js
        nest_lambda = _lambda.Function(
            self, 'NestLambda',
            runtime=_lambda.Runtime.NODEJS_20_X,
            handler='main.handler',
            code=_lambda.Code.from_asset('../dist'),  # Ensure dist directory exists
            memory_size=1024,
            timeout=Duration.seconds(30),
            environment={
                "NODE_ENV": "production"
            }
        )

        # API Gateway
        apigateway.LambdaRestApi(
            self, 'NestApi',
            handler=nest_lambda,
            proxy=True,
            default_cors_preflight_options={
                "allow_origins": apigateway.Cors.ALL_ORIGINS,
                "allow_methods": apigateway.Cors.ALL_METHODS,
                "allow_headers": apigateway.Cors.DEFAULT_HEADERS
            }
        )
