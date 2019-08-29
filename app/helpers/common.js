/* global CustomStatusCode */
const isNil = require('lodash/isNil');
const isObject = require('lodash/isObject');
const result = require('lodash/result');
const camelCase = require('lodash/camelCase');
const isNumber = require('lodash/isNumber');
const toNumber = require('lodash/toNumber');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

exports.error = (res, err, httpCodeStatus, errorCode) => {
  const resultPrint = {};
  resultPrint.status = result(err, 'status') || result(err, 'statusCode') || 400;
  resultPrint.errors = {};

  if (isNil(httpCodeStatus) && isObject(err) && isNil(errorCode)) {
    resultPrint.errors.message = result(err, 'message') || result(err, 'msg') || 'Bad Request';

    const isStatusCodeDuplicate = result(err, 'status') || result(err, 'statusCode');
    const isMessageDuplicate = result(err, 'message') || result(err, 'msg');
    resultPrint.errors.stackTrace = err;
    if (isStatusCodeDuplicate) {
      delete resultPrint.errors.stackTrace.statusCode;
    }
    if (isMessageDuplicate) {
      delete resultPrint.errors.stackTrace.message;
    }
  } else {
    const message = 'The server encountered an unexpected condition which prevented it from fulfilling the request.';
    resultPrint.status = httpCodeStatus || resultPrint.status;
    resultPrint.errors.message = err || message;
    resultPrint.errorCode = errorCode || CustomStatusCode.undefinedError.code;
  }
  return res.status(resultPrint.status).json(resultPrint);
};

exports.response = (res, obj, status, extra) => {
  const resultPrint = {};
  resultPrint.status = status || 200;

  if (isObject(obj)) {
    resultPrint.data = obj;
  } else {
    resultPrint.message = obj;
  }
  if (isObject(extra)) {
    Object.assign(resultPrint, extra);
  }

  return res.status(resultPrint.status).json(resultPrint);
};

exports.loadFile = (dirname, basename) => {
  const load = {};

  fs.readdirSync(dirname)
    /* eslint-disable-next-line */
    .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
    .forEach((file) => {
      const pathFile = path.join(dirname, file);
      const filename = camelCase(path.basename(file, '.js'));

      /* eslint-disable-next-line */
      load[filename] = require(pathFile);
    });
  return load;
};

exports.paging = (page = 1, limit = 10) => {
  if (page === 0) {
    // eslint-disable-next-line no-param-reassign
    page = 1;
  }

  const getPage = isNumber(page) ? page : toNumber(page);
  const getLimit = isNumber(limit) ? limit : toNumber(limit);

  return {
    page,
    limit,
    offset: Math.abs(((getPage - 1) * getLimit)),
  };
};

exports.hashString = (string) => {
  const salt = crypto.randomBytes(16).toString('hex'); 
  const hash = crypto.pbkdf2Sync(string, salt, 
    1000, 64, `sha512`).toString(`hex`); 
  
  return {
    salt,
    hash
  };
}; 

exports.verifyString = (string, salt, hashedString) => { 
  const hash = crypto.pbkdf2Sync(string,  
  salt, 1000, 64, `sha512`).toString(`hex`); 
  
  return hash === hashedString; 
};

exports.verifyJWT = (token, secretKey) => {
  const jwtDecoded = jwt.verify(token, secretKey);

  return jwtDecoded;
};

exports.sendMail = ( transportAcc, mailOptions ) => {
  const transporter = nodeMailer.createTransport(transportAcc)
  
  transporter.sendMail(mailOptions, (error,info) => {
    if (error){
      return error;
    };

    return info;
  });

};

module.exports = exports;
