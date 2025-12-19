## Deployment Overview

This project deploys the static React build to a private S3 bucket fronted by CloudFront. Everything is driven by shell scripts.

### IAMs
Need an IAM user for CLI deploys with programmatic access (access key). For future ref, used below process:
```
export USER_NAME=deploy
export POLICY_NAME=deploy-bot-minimal
export BUCKET_NAME=deploy-bot-policy-bucket

cp ./deployment/deploy-policy.json /tmp/deploy-policy.json
sed -i "s/BUCKET_PLACEHOLDER/${BUCKET_NAME}/g" /tmp/deploy-policy.json

aws iam create-user --user-name "${USER_NAME}"
aws iam create-policy \
  --policy-name "${POLICY_NAME}" \
  --policy-document file:///tmp/deploy-policy.json

aws iam attach-user-policy \
  --user-name "${USER_NAME}" \
  --policy-arn "arn:aws:iam::$(aws sts get-caller-identity --query Account --output text):policy/${POLICY_NAME}"
```

Save the access and secret keys here, you can't see the access key again.
Configure a named profile (can obv make name whatever):
```
export AWS_PROFILE=deploy
export AWS_REGION=eu-west-1
aws configure --profile $AWS_PROFILE
AWS Access Key ID [None]: <from console>
AWS Secret Access Key [None]: <from console>
Default region name [None]: eu-west-1
Default output format [None]: json
```


### Environment configuration
Copy `.env.example` to `.env` and adjust values. At minimum set:
- `APP_NAME` (used in resource naming, must be globally unique for S3)
- `BUCKET_NAME` (optional override; defaults from `APP_NAME`)
- `AWS_PROFILE` and `AWS_REGION` (match your profile and `eu-west-1`)

### Scripts
- `setup.sh`: one-time infra. Creates S3 bucket (private, block-public-access), CloudFront OAC, bucket policy for OAC, CloudFront distribution with SPA error handling (403/404 -> `/index.html`)
- `deploy.sh`: builds `frontend/`, syncs `dist/` to S3 with sensible cache headers, then triggers a CloudFront invalidation for the app paths.
