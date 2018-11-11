import ImagePicker from 'react-native-image-crop-picker';
import * as ImgurUtils from "../../app/utils/ImgurUtils";

export class ImageSources {
  static VOID_FUNC = () => null;
  static DEFAULT_CROP_WIDTH = 1024;
  static DEFAULT_CROP_HEIGHT = 512;

  constructor() {
    this._chosenImages = [];
    this._beforeChoosingImagesCallback = ImageSources.VOID_FUNC;
    this._beforeUploadingCallback = ImageSources.VOID_FUNC;
    this._uploadingCallback = ImageSources.VOID_FUNC;
    this._afterUploadingCallback = ImageSources.VOID_FUNC;
    this._inUploadingCallback = ImageSources.VOID_FUNC;
    this._onProblemOccurred = ImageSources.VOID_FUNC;
  }

  beforeChoosingImages(func) {
    this._beforeChoosingImagesCallback = func ? func : ImageSources.VOID_FUNC;
    return this;
  }

  beforeUploading(func) {
    this._beforeUploadingCallback = func ? func : ImageSources.VOID_FUNC;
    return this;
  }

  uploading(func) {
    this._uploadingCallback = func ? func : ImageSources.VOID_FUNC;
    return this;
  }

  afterUploading(func) {
    this._afterUploadingCallback = func ? func : ImageSources.VOID_FUNC;
    return this;
  }
  
  inUploading(func) {
    this._inUploadingCallback = func ? func : ImageSources.VOID_FUNC;
    return this;    
  }

  onProblemOccurred(func) {
    this._onProblemOccurred = func ? func : ImageSources.VOID_FUNC;
    return this;
  }

  async pickImagesFromCamera() {
    this._beforeChoosingImagesCallback();

    this._chosenImages = [
      await ImagePicker.openCamera({
        compressImageMaxWidth: ImageSources.DEFAULT_CROP_WIDTH,
        compressImageMaxHeight: ImageSources.DEFAULT_CROP_HEIGHT,
      })
    ];

    return this;
  }

  async pickImagesFromSDCard() {
    this._beforeChoosingImagesCallback();

    this._chosenImages = await ImagePicker.openPicker({
      multiple: true,
      compressImageMaxWidth: ImageSources.DEFAULT_CROP_WIDTH,
      compressImageMaxHeight: ImageSources.DEFAULT_CROP_HEIGHT,
    });

    return this;
  }

  async startUploading() {
    this._beforeUploadingCallback();

    let nSuccess = 0;
    let uploadedImages = [];
    let response = null;

    for (let i = 0; i < this._chosenImages.length; i++) {
      this._uploadingCallback(nSuccess, this._chosenImages.length);

      try {
        response = await ImgurUtils.uploadImage(this._chosenImages[i]);
        if (response.status === 200) {
          nSuccess++;
          const uploadedImage = ImgurUtils.extractImageInfoFromResponse(response);
          this._inUploadingCallback(uploadedImage);
          uploadedImages.push(uploadedImage);
        } else {
          console.log(response);
          this._onProblemOccurred(i, response);
        }
      } catch (e) {
        this._onProblemOccurred(i, e);
      }

    }

    this._afterUploadingCallback(uploadedImages, nSuccess, uploadedImages.length);

    return uploadedImages;
  }
}

