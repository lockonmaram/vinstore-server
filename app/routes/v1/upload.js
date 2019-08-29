/* global Helpers */
const { imageUpload } = require('../../middlewares');

const uploadImageToGBucket = async (req, res) => {
  try {
    const result = {
      message: 'Your file is successfully uploaded',
      link: req.file.cloudStoragePublicUrl
    };

    return Helpers.response(res, result);
  } catch (error) {
    return Helpers.error(res, error);
  }
};

module.exports = (router) => {
  router.post('/',
    imageUpload.multer.single('image'),
    imageUpload.sendUploadToGCS,
    uploadImageToGBucket
  );
};
