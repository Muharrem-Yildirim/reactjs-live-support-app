const glob = require("glob"),
  fs = require("fs"),
  path = require("path"),
  userModel = require("../models/userModel");


const getChatHistories = async (req, res) => {
  if (!fs.existsSync(__dirname + '/../../chat-histories')) {
    fs.mkdirSync(__dirname + '/../../chat-histories');
  }

  await glob(__dirname + '/../../chat-histories/*.html', {}, async (err, files) => {

    let newArr = [];

    Promise.all(await files.map(file => {

      file = path.basename(file);

      newArr.push(file);
    }
    )).then(() => {

      return res.json(newArr);
    });
  });

}

const getUsers = async (req, res) => {
  return res.json(await userModel.find().select('username _id created_at'));
}


const deleteUser = async (req, res) => {
  return res.json(await userModel.deleteOne({ _id: req.params?.id }));
}


module.exports = {
  getChatHistories,
  getUsers,
  deleteUser
};
