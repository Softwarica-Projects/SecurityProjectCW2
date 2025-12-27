const {xss} = require('express-xss-sanitizer');
module.exports = function () {
  return xss({
    body: true,
    query: true,
    params: true
  });
};
