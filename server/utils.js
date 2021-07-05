class Utils {
  static isEmptyOrSpaces(str) {
    return str === null || str.match(/^ *$/) !== null;
  }
}

module.exports = Utils;
