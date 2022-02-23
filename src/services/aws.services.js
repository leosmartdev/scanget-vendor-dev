import AWS from "aws-sdk";
import { postRequest } from "./verb.services";
// import { convertImage } from "./receipt.services";

// Convert Image.
const convertImage = (data, resolve, reject) => {
  return postRequest("receipt/image", null, true, data, null)
    .then(() => {
      resolve();
    })
    .catch(error => {
      const err =
        error.response && error.response.data
          ? error.response.data.message
          : "Something went wrong";
      reject(err);
    });
}

const uploadImage = async (uploadConfigs, image, id, folder) => {
  return new Promise((resolve, reject) => {
    AWS.config.region = `${uploadConfigs.region}`;
    AWS.config.credentials = new AWS.CognitoIdentityCredentials(
      JSON.parse(JSON.stringify(uploadConfigs.cognito))
    );

    // AWS.config.update({
    //   region: `${uploadConfigs.region}`,
    //   credentials: new AWS.CognitoIdentityCredentials(uploadConfigs.cognito)
    // });

    // Create S3 service object

    const s3 = new AWS.S3({ apiVersion: "2006-03-01" });

    let fileData = {
      Key: `${folder}/${id}/sng.${Date.now().toString()}.jpeg`,
      Body: image.replace(/^data:image\/\w+;base64,/, ""),
      Bucket: `${uploadConfigs.s3}`,
      ContentEncoding: "base64",
      ContentType: "image/jpeg"
    };

    // console.log("sss", fileData);
    s3.putObject(fileData, function (err, data) {
      if (err) {
        return reject(err);
      } else {
        return resolve(fileData);
      }
    });
  });
};

const useBuff = data => {
  return new Promise((resolve, reject) => {
    convertImage(data, resolve, reject);
  });
};

export const getImageUrls = async (uploadConfigs, image, id, folder) => {
  const link = await uploadImage(uploadConfigs, image, id, folder);
  await useBuff({
    key: link.Key,
    bucket: link.Bucket,
    rotate: false
  });
  const url = `${uploadConfigs.cdn}/${link.Key}`;
  return url;
};