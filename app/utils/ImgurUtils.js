import {post} from "../utils/fetchUtils";

export async function uploadImage(image) {
  const formdata = new FormData();
  formdata.append("image", {uri: image.path, type: 'multipart/form-data'});
  return await post(
    'https://api.imgur.com/3/image',
    {
      "authorization": "Client-ID c366d7a41c6660d",
    },
    formdata
  );
}

export function extractImageInfoFromResponse(response) {
  if (response.status !== 200) {
    throw {message: "Failed to upload image"};
  }

  const data = response.data;

  // date, type and size have not been necessary so far
  return {
    url: toHttps(data.link),
    // datetime: data.datetime,
    // type: data.type,
    width: data.width,
    height: data.height,
    // size: data.size,
  };
}

export function getThumbUrl(url) {
  if (!url.startsWith('https')) {
    url = toHttps(url);
  }
  const lastDotIndex = url.lastIndexOf('.');
  return url.substr(0, lastDotIndex) + 's' + url.substr(lastDotIndex);
}

export function toHttps(url) {
  if (url.startsWith('https')) {
    return url;
  }
  const lastDotIndex = url.indexOf(':');
  return url.substr(0, lastDotIndex) + 's' + url.substr(lastDotIndex);
}