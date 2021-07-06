const mongoose = require("mongoose"),
  bcrypt = require("bcrypt");

const schema = mongoose.Schema({
  username: { type: String, unique: true, required: true },
  hash_password: { type: String, required: true },
  roles: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Role',
    },
  ],
  created: {
    type: Date,
    default: Date.now,
  },

});

schema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.hash_password);
};

// bcrypt.hashSync(req.body.password, 10);
console.log(bcrypt.hashSync("123", 10));

module.exports = mongoose.model("User", schema);
