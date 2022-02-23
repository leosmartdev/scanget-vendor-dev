module.exports = {
  "release-test": {
    variables: [
      { key: "AWS_S3_APP", value: `client-test.scannget.com` },
      { key: "AWS_CF_ID", value: `E3AGZO5Z6PB3M1` },
      { key: "SENTRY_ENVIRONMENT", value: `test` },
    ]
  },
  "release-stage": {
    variables: [
      { key: "AWS_S3_APP", value: `client-stage.scannget.com` },
      { key: "AWS_CF_ID", value: `E3BHOEMC2ZAWLL` },
      { key: "SENTRY_ENVIRONMENT", value: `stage` },
    ]
  },
  "release-prod": {
    variables: [
      { key: "AWS_S3_APP", value: `client.scannget.com` },
      { key: "AWS_CF_ID", value: `E32HS6LON8YOB4` },
      { key: "SENTRY_ENVIRONMENT", value: `prod` },
    ]
  },
  "release-prod-hotfix": {
    variables: [
      { key: "AWS_S3_APP", value: `client.scannget.com` },
      { key: "AWS_CF_ID", value: `E32HS6LON8YOB4` },
      { key: "SENTRY_ENVIRONMENT", value: `prod` },
    ]
  }

}