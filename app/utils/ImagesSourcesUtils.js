import ImagePicker from 'react-native-image-crop-picker';
import * as ImgurUtils from "../../app/utils/ImgurUtils";
import {extractSelectedImagesInfo} from "./ImgurUtils";
import {languageSelect} from "../res";

export class ImagesSources {
  static VOID_0 = () => void 0;
  static DEFAULT_CROP_WIDTH = 1024;
  static DEFAULT_CROP_HEIGHT = 512;

  constructor() {
    this.imagesQueue = [];
    this.onStateUpdateHandler = ImagesSources.VOID_0;
  }

  copyImagesFrom(images) {
    images.forEach(image => {
      this.imagesQueue.push({
        url: image.url,
        waiting: false,
        error: false,
      });
    });
  }

  removeImageAtIndex(index) {
    try {
      this.imagesQueue.splice(index, 1);
      this.onStateUpdateHandler(this.imagesQueue);
    } catch (e) {
      console.log(`in ImagesSources.removeImageAtIndex(${index}) = ${JSON.stringify(e)}`);
    }
  }

  isUploading() {
    for (let i = 0; i < this.imagesQueue.length; i++) {
      if (this.imagesQueue[i].waiting) {
        return true;
      }
    }
    return false;
  }

  setStateUpdateHandler(newStateUpdateHandler) {
    this.onStateUpdateHandler = newStateUpdateHandler
      ? newStateUpdateHandler
      : ImagesSources.VOID_0;
  }

  async takeImageFromCamera() {
    const selectedImage = [
      await ImagePicker.openCamera({
        compressImageMaxWidth: ImagesSources.DEFAULT_CROP_WIDTH,
        compressImageMaxHeight: ImagesSources.DEFAULT_CROP_HEIGHT,
      })
    ];

    const selectedImagesInfo = extractSelectedImagesInfo(selectedImage);
    this.imagesQueue = this.imagesQueue.concat(selectedImagesInfo);
    this.onStateUpdateHandler(this.imagesQueue);

    return this;
  }

  async pickImagesFromSDCard() {
    const selectedImages = await ImagePicker.openPicker({
      multiple: true,
      maxFiles: 8,
      compressImageMaxWidth: ImagesSources.DEFAULT_CROP_WIDTH,
      compressImageMaxHeight: ImagesSources.DEFAULT_CROP_HEIGHT,
    });

    const selectedImagesInfo = extractSelectedImagesInfo(selectedImages);
    this.imagesQueue = this.imagesQueue.concat(selectedImagesInfo);
    this.onStateUpdateHandler(this.imagesQueue);

    return this;
  }

  async upload() {
    let successCount = 0;
    let imgurResponse = null;

    for (let i = 0; i < this.imagesQueue.length; i++) {
      if (!this.imagesQueue[i].waiting) {
        continue;
      }

      try {
        console.log(`uploading image[${i}] = ${JSON.stringify(this.imagesQueue[i])}`);

        imgurResponse = await ImgurUtils.uploadImage(this.imagesQueue[i]);

        const uploadedImageInfo = ImgurUtils.extractImageInfoFromResponse(imgurResponse);

        if (imgurResponse.status === 200) {
          successCount++;
          this.imagesQueue[i].error = null;
          this.imagesQueue[i].url = uploadedImageInfo.url;
        } else {
          this.imagesQueue[i].error = uploadedImageInfo;
          this.imagesQueue[i].url = "";
        }
      } catch (e) {
        const message = e.message
          ? e.message
          : languageSelect({
            any: `Cannot upload the image at '${this.imagesQueue[i].path}'`,
            vi: `Không thể tải lên ảnh tại '${this.imagesQueue[i].path}'`
          });
        console.log(`in ImagesSources.upload: ${JSON.stringify(e)}`);
        this.imagesQueue[i].error = {message};
        this.imagesQueue[i].url = "";
      } finally {
        this.imagesQueue[i].waiting = false;
        this.onStateUpdateHandler(this.imagesQueue);
      }
    }

    return successCount;
  }
}

