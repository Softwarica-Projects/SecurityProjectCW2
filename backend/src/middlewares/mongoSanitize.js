const mongoSanitize = require('express-mongo-sanitize');
module.exports = function () {
  return mongoSanitize({
    replaceWith: '_'
  });
};
