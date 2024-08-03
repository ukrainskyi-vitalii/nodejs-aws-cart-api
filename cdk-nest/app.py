#!/usr/bin/env python3
import os

import aws_cdk as cdk

from cdk_nest.cdk_nest_stack import CdkNestStack


app = cdk.App()
env = cdk.Environment(account=os.getenv('CDK_DEFAULT_ACCOUNT'), region=os.getenv('CDK_DEFAULT_REGION'))
CdkNestStack(app, "CdkNestStack", env=env)

app.synth()
