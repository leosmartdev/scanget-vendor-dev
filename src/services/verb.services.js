import _ from "lodash";
import axios from "axios";
import moment from "moment";
import { refreshToken } from "./user.services";
import apiData from "../utils/api";
const api = apiData.url;
// const api = `https://api-stage.cloud.scannget.com`; 
// const api = `http://192.168.250.124:3000`;
const buildUrl = (endpointUrl, params) => {
  const firstEndpointUrlChar = endpointUrl.charAt(0);
  const addSlash = firstEndpointUrlChar === "/" ? "" : "/";
  let url = api + addSlash + endpointUrl;
  url = !url.endsWith("/") ? url : url;
  url = params ? url + "?" + createParams(params) : url;
  return url;
};
const createParams = listOfParams => {
  let array = [];
  _.forEach(listOfParams, (paramValue, paramKey) => {
    array.push(
      encodeURIComponent(paramKey) + "=" + encodeURIComponent(paramValue)
    );
  });
  return array.join("&");
};
// const fetchToken = async () => {
//   const IdToken = await localStorage.getItem("IdToken")
//   return IdToken;
// };
const refreshTokenCaller = async dispatch => {
  const token = await localStorage.getItem("RefreshToken");
  return new Promise((resolve, reject) => {
    refreshToken({ refreshToken: token }, dispatch, resolve, reject);
  });
};

const calcDifference = async () => {
  const lastRefreshTokenTime = await localStorage.getItem("lastRefreshTokenTime");
  const lastTime = moment(new Date(lastRefreshTokenTime));
  const currentTime = moment(Date.now());
  return currentTime.diff(lastTime, "seconds");
};

export const getRequest = async (url, params, hasHeaders, dispatch) => {
  let token = await localStorage.getItem("IdToken");
  if (!url.includes("refresh")) {
    const diff = await calcDifference();
    if (diff > 3200) {
      await refreshTokenCaller(dispatch).then(async () => {
        token = await localStorage.getItem("IdToken");
        return axios.get(
          `${buildUrl(url, params)}`,
          hasHeaders
            ? {
              headers: {
                Authorization: token,
                "Content-Type": "application/json"
              }
            }
            : null
        );
      });
    } else {
      return axios.get(
        `${buildUrl(url, params)}`,
        hasHeaders
          ? {
            headers: {
              Authorization: token,
              "Content-Type": "application/json"
            }
          }
          : null
      );
    }
  }
  return axios.get(
    `${buildUrl(url, params)}`,
    hasHeaders
      ? {
        headers: {
          Authorization: token,
          "Content-Type": "application/json"
        }
      }
      : null
  );
};

export const postRequest = async (
  url,
  params = null,
  hasHeaders,
  data,
  dispatch
) => {
  let token = await localStorage.getItem("IdToken");
  if (!url.includes("refresh")) {
    const diff = await calcDifference();
    if (diff > 3200 && hasHeaders) {
      await refreshTokenCaller(dispatch).then(async () => {
        token = await localStorage.getItem("IdToken");
        return axios.post(
          `${buildUrl(url, params)}`,
          { ...data },
          hasHeaders
            ? {
              headers: {
                Authorization: token,
                "Content-Type": "application/json"
              }
            }
            : null
        );
      });
    } else {
      return axios.post(
        `${buildUrl(url, params)}`,
        { ...data },
        hasHeaders
          ? {
            headers: {
              Authorization: token,
              "Content-Type": "application/json"
            }
          }
          : null
      );
    }
  }
  return axios.post(
    `${buildUrl(url, params)}`,
    { ...data },
    hasHeaders
      ? {
        headers: {
          Authorization: token,
          "Content-Type": "application/json"
        }
      }
      : null
  );
};
export const putRequest = async (
  url,
  params = null,
  hasHeaders,
  data,
  dispatch
) => {
  let token = await localStorage.getItem("IdToken");
  if (!url.includes("refresh")) {
    const diff = calcDifference();
    if (diff > 3200) {
      refreshTokenCaller(dispatch).then(async () => {
        token = await localStorage.getItem("IdToken");
        return axios.put(
          `${buildUrl(url, params)}`,
          hasHeaders
            ? {
              headers: {
                Authorization: token,
                "Content-Type": "application/json"
              }
            }
            : null
        );
      });
    } else {
      return axios.put(
        `${buildUrl(url, params)}`,
        { ...data },
        hasHeaders
          ? {
            headers: {
              Authorization: token,
              "Content-Type": "application/json"
            }
          }
          : null
      );
    }
  }
  return axios.put(
    `${buildUrl(url, params)}`,
    { ...data },
    hasHeaders
      ? {
        headers: {
          Authorization: token,
          "Content-Type": "application/json"
        }
      }
      : null
  );
};

export const deleteRequest = async (url, params = null, hasHeaders, data) => {
  const token = await localStorage.getItem("IdToken");
  return axios.delete(
    `${buildUrl(url, params)}`,
    hasHeaders
      ? {
        headers: {
          Authorization: token,
          "Content-Type": "application/json"
        },
        data: { ...data }
      }
      : { data: { ...data } }
  );
};