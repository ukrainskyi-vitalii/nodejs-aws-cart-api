import os
from dotenv import load_dotenv

from aws_cdk import (
    Stack,
    aws_lambda as _lambda,
    aws_apigateway as apigateway,
    aws_ec2 as ec2,
    aws_rds as rds, Duration,
)
from constructs import Construct


class CdkNestStack(Stack):

    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        load_dotenv()

        vpc = ec2.Vpc.from_lookup(self, "Vpc", vpc_id=os.getenv("RDS_VPC_GROUP_ID"))

        existing_db_security_group = ec2.SecurityGroup.from_security_group_id(
            self, 'ExistingDBSG', os.getenv("RDS_SECURITY_GROUP_ID")
        )

        lambda_security_group = ec2.SecurityGroup(
            self,
            "LambdaSecurityGroup",
            vpc=vpc,
            description="Allow Lambda to access RDS Proxy",
            allow_all_outbound=True
        )

        # Lambda function for Nest.js
        nest_lambda = _lambda.Function(
            self, 'NestLambda',
            runtime=_lambda.Runtime.NODEJS_20_X,
            handler='main.handler',
            code=_lambda.Code.from_asset('../dist'),  # Ensure dist directory exists
            environment={
                "NODE_ENV": "production",
                "DB_HOST": os.getenv("DB_HOST"),
                "DB_PORT": os.getenv("DB_PORT"),
                "DB_NAME": os.getenv("DB_NAME"),
                "DB_USER": os.getenv("DB_USER"),
                "DB_PASSWORD": os.getenv("DB_PASSWORD")
            },
            memory_size=1024,
            timeout=Duration.seconds(30),
            vpc=vpc,
            security_groups=[lambda_security_group],
            allow_public_subnet=True
        )

        rds_instance = rds.DatabaseInstance.from_database_instance_attributes(
            self, "RDSInstance",
            instance_endpoint_address=os.getenv("DB_HOST"),
            instance_identifier=os.getenv("DB_INSTANCE_IDENTIFIER"),
            port=int(os.getenv("DB_PORT")),
            security_groups=[existing_db_security_group]
        )

        rds_instance.connections.allow_from(lambda_security_group, ec2.Port.tcp(int(os.getenv("DB_PORT"))))

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
