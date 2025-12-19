#!/usr/bin/env bash
set -euo pipefail

# build frontend and deploy static assets to S3, then invalidate CloudFront

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

AWS_REGION="${AWS_REGION:-eu-west-1}"
: "${DISTRIBUTION_ID:?DISTRIBUTION_ID is required (set in environment or .env)}"

if [[ -z "${BUCKET_NAME:-}" ]]; then
  : "${APP_NAME:?APP_NAME is required when BUCKET_NAME is not set}"
  APP_SLUG="$(echo "${APP_NAME}" | tr '[:upper:]' '[:lower:]' | tr -cs 'a-z0-9-' '-')"
  BUCKET_NAME="${APP_SLUG}-web"
fi

export AWS_REGION

FRONTEND_DIR="${SCRIPT_DIR}/../frontend"
DIST_DIR="${FRONTEND_DIR}/dist"

need_bin() {
  command -v "$1" >/dev/null 2>&1 || { echo "Missing required binary: $1" >&2; exit 1; }
}

need_bin aws
need_bin npm

echo "Building frontend..."
cd "${FRONTEND_DIR}"
npm ci
npm run build

echo "Syncing assets to s3://${BUCKET_NAME} ..."
# Upload hashed assets with long cache
aws s3 sync "${DIST_DIR}/" "s3://${BUCKET_NAME}/" \
  --exclude "index.html" \
  --cache-control "public,max-age=31536000,immutable" \
  --delete

# Upload index.html with no-cache
aws s3 cp "${DIST_DIR}/index.html" "s3://${BUCKET_NAME}/index.html" \
  --cache-control "no-cache, no-store, must-revalidate" \
  --content-type "text/html"

echo "Creating CloudFront invalidation..."
INVALIDATION_ID="$(aws cloudfront create-invalidation \
  --distribution-id "${DISTRIBUTION_ID}" \
  --paths "/" "/index.html" "/assets/*" \
  --query 'Invalidation.Id' --output text)"

echo "Invalidation submitted: ${INVALIDATION_ID}"
echo "Deploy complete."
