const _ = require('lodash');

const formatPhoneNumber = (phoneNumber) => {
  let result = phoneNumber;
  if (_.startsWith(phoneNumber, '08')) {
    result = _.replace(phoneNumber, '0', '62');
  }
  return result;
};


module.exports = {
  formatPhoneNumber,
};
