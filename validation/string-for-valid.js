const isEmpty = require("./is-empty");
const stringForValid = item => (!isEmpty(item) ? item : "");

module.exports = stringForValid;
