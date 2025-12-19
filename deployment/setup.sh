#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

AWS_REGION="${AWS_REGION:-eu-west-1}"
: "${APP_NAME:?APP_NAME is required (set in environment or .env)}"
APP_SLUG="$(echo "${APP_NAME}" | tr '[:upper:]' '[:lower:]' | tr -cs 'a-z0-9-' '-')"
BUCKET_NAME="${BUCKET_NAME:-${APP_SLUG}-web}"
OAC_NAME="${APP_SLUG}-oac"
COMMENT="${APP_NAME}-spa"

export AWS_REGION

echo "Using AWS region: ${AWS_REGION}"
echo "Using bucket: ${BUCKET_NAME}"
echo "Using OAC name: ${OAC_NAME}"

need_bin() {
  command -v "$1" >/dev/null 2>&1 || { echo "Missing required binary: $1" >&2; exit 1; }
}

need_bin aws
need_bin jq

ACCOUNT_ID="$(aws sts get-caller-identity --query Account --output text)"
echo "Caller account: ${ACCOUNT_ID}"

ensure_bucket() {
  if aws s3api head-bucket --bucket "${BUCKET_NAME}" 2>/dev/null; then
    echo "Bucket exists: ${BUCKET_NAME}"
  else
    echo "Creating bucket: ${BUCKET_NAME}"
    aws s3api create-bucket --bucket "${BUCKET_NAME}" --create-bucket-configuration LocationConstraint="${AWS_REGION}"
    aws s3api put-bucket-encryption \
      --bucket "${BUCKET_NAME}" \
      --server-side-encryption-configuration '{"Rules":[{"ApplyServerSideEncryptionByDefault":{"SSEAlgorithm":"AES256"}}]}'
    aws s3api put-public-access-block \
      --bucket "${BUCKET_NAME}" \
      --public-access-block-configuration "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"
    echo "Bucket created and locked down."
  fi
}

ensure_oac() {
  local existing_oac
  existing_oac="$(aws cloudfront list-origin-access-controls --query "OriginAccessControlList.Items[?Name=='${OAC_NAME}'] | [0]" --output json)"
  if [[ "${existing_oac}" != "null" ]]; then
    OAC_ID="$(echo "${existing_oac}" | jq -r '.Id')"
    echo "Reusing OAC: ${OAC_ID}"
  else
    echo "Creating OAC: ${OAC_NAME}"
    OAC_ID="$(aws cloudfront create-origin-access-control \
      --origin-access-control-config "{
        \"Name\": \"${OAC_NAME}\",
        \"Description\": \"${APP_NAME} OAC\",
        \"SigningProtocol\": \"sigv4\",
        \"SigningBehavior\": \"always\",
        \"OriginAccessControlOriginType\": \"s3\"
      }" \
      --query 'OriginAccessControl.Id' --output text)"
    echo "Created OAC: ${OAC_ID}"
  fi
}

ensure_distribution() {
  local existing_dist tmp_cf_config caller_ref origin_id
  existing_dist="$(aws cloudfront list-distributions --query "DistributionList.Items[?Comment=='${COMMENT}'] | [0]" --output json)"
  if [[ "${existing_dist}" != "null" ]]; then
    DIST_ID="$(echo "${existing_dist}" | jq -r '.Id')"
    DOMAIN_NAME="$(echo "${existing_dist}" | jq -r '.DomainName')"
    echo "Reusing distribution: ${DIST_ID} (${DOMAIN_NAME})"
    return
  fi

  echo "Creating CloudFront distribution..."
  origin_id="s3-${BUCKET_NAME}"
  caller_ref="${APP_SLUG}-$(date +%s)"
  tmp_cf_config="$(mktemp)"

  sed \
    -e "s|__CALLER_REFERENCE__|${caller_ref}|g" \
    -e "s|__COMMENT__|${COMMENT}|g" \
    -e "s|__ORIGIN_ID__|${origin_id}|g" \
    -e "s|__BUCKET_NAME__|${BUCKET_NAME}|g" \
    -e "s|__AWS_REGION__|${AWS_REGION}|g" \
    -e "s|__OAC_ID__|${OAC_ID}|g" \
    "${SCRIPT_DIR}/cloudfront-distribution.template.json" > "${tmp_cf_config}"

  DIST_JSON="$(aws cloudfront create-distribution --distribution-config file://"${tmp_cf_config}")"
  rm -f "${tmp_cf_config}"

  DIST_ID="$(echo "${DIST_JSON}" | jq -r '.Distribution.Id')"
  DOMAIN_NAME="$(echo "${DIST_JSON}" | jq -r '.Distribution.DomainName')"
  echo "Distribution created: ${DIST_ID} (${DOMAIN_NAME})"
}

apply_bucket_policy() {
  local tmp_policy
  tmp_policy="$(mktemp)"
  sed \
    -e "s|__BUCKET_NAME__|${BUCKET_NAME}|g" \
    -e "s|__ACCOUNT_ID__|${ACCOUNT_ID}|g" \
    -e "s|__DIST_ID__|${DIST_ID}|g" \
    "${SCRIPT_DIR}/bucket-policy.template.json" > "${tmp_policy}"

  echo "Applying bucket policy for distribution ${DIST_ID}..."
  aws s3api put-bucket-policy --bucket "${BUCKET_NAME}" --policy file://"${tmp_policy}"
  rm -f "${tmp_policy}"
}

main() {
  ensure_bucket
  ensure_oac
  ensure_distribution
  apply_bucket_policy

  echo ""
  echo "Outputs:"
  echo "Bucket: ${BUCKET_NAME}"
  echo "Distribution ID: ${DIST_ID}"
  echo "CloudFront Domain: https://${DOMAIN_NAME}"
}

main "$@"
