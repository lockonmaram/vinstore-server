const Storage = require('@google-cloud/storage')
const config = require('../../config');

const CLOUD_BUCKET = config.get('GCLOUD_BUCKET').BUCKET_NAME;

const storage = Storage({
  projectId: config.get('GCLOUD_BUCKET').PROJECT_ID,
  keyFilename: config.get('KEYFILE_PATH')
})
const bucket = storage.bucket(CLOUD_BUCKET)

const getPublicUrl = (filename) => {
  return `https://storage.googleapis.com/${CLOUD_BUCKET}/${filename}`
}

const sendUploadToGCS = (req, res, next) => {
  if (!req.file) {
    return next()
  }

  const gcsname = Date.now() + req.file.originalname
  const file = bucket.file(gcsname)

  const stream = file.createWriteStream({
    metadata: {
      contentType: req.file.mimetype
    }
  })

  stream.on('error', (err) => {
    req.file.cloudStorageError = err
    next(err)
  })

  stream.on('finish', () => {
    req.file.cloudStorageObject = gcsname
    file.makePublic().then(() => {
      req.file.cloudStoragePublicUrl = getPublicUrl(gcsname)
      next()
    })
  })

  stream.end(req.file.buffer)
}

const Multer = require('multer'),
      multer = Multer({
        storage: Multer.MemoryStorage,
        // dest: '../images'
      })

module.exports = {
  getPublicUrl,
  sendUploadToGCS,
  multer
}
