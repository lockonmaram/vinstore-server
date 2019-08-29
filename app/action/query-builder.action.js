/* global Helpers */

const _ = require('lodash');

const commonQuery = (condition, page, limit, fields, join) => {
  _.forEach(fields, field => _.camelCase(field));
  const attributes = _.isEmpty(fields) ? _.noop() : fields;
  const where = _.isEmpty(condition) ? _.noop() : condition;
  const include = _.isEmpty(join) ? _.noop() : join;
  const pagination = Helpers.paging(page, limit);
  return {
    attributes,
    where,
    include,
    limit: pagination.limit,
    skip: pagination.offset,
    raw: true,
  };
};

module.exports = {
  commonQuery,
};
