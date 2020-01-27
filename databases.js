//THESE DEFAULT VALUES ARE FOR TESTING ONLY
const bcrypt = require('bcrypt');

const urlDatabase = {
  "b2xVn2": { longURL: "http://lighthouselabs.ca", userId: "lonley" },
  "9sm5xk": { longURL: "http://google.com", userId: "lonlon" }
};

const userList = {
  lonley: {
    id: "lonley",
    email: "forever@alone.me",
    hashedPassword: bcrypt.hashSync("iwantahug", 10)
  }
};

module.exports = { urlDatabase, userList };