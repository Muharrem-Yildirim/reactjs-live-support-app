const bcrypt = require("bcrypt"), path = require('path'), fs = require('fs');

class Utils {
  static isEmptyOrSpaces(str) {
    return str === null || str.match(/^ *$/) !== null;
  }

  static hashPassword(password) {
    return bcrypt.hashSync(password, 10);
  }

  static makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() *
        charactersLength));
    }
    return result;
  }
}

module.exports = Utils;
