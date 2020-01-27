const generateRandomString = () => {
  return (Math.random() + 1).toString(36).substring(6);
};

const userValidator = (value, property, database) => {
  console.log(`CURRENT USERS:`);
  console.log(database);
  console.log(`checking for: ${value} in ${database[property]}`);
  for (let key in users) {
    console.log(`COMPARING KEY ${database[key][property]} to ${value}`);
    if (database[key][property] === value) {
      return database[key];
    }
  }
  return false;
};



const urlsForUser = (id, database) => {
  const filteredUrls = {};
  for (let key in database) {
    if (database[key].userid === id.userId) {
      filteredUrls[key] = database[key];
    }
  }
  return filteredUrls;
};

module.exports = { generateRandomString, userValidator, urlsForUser };