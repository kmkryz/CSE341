const Validator = require('validatorjs');

const validate = (body, rules, customMessages, callback) => {
  const validation = new Validator(body, rules, customMessages);
  validation.passes(() => callback(true, null));
  validation.fails(() => callback(false, validation.errors));
  
};

module.exports = validate;
