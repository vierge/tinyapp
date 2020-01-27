const { urlDatabase, userList }  = require('./databases');
const { urlsForUser, generateRandomString } = require('./helpers')
const router = require('express').Router();

router.get("/", (req, res) => {
  let templateVars = {
    urls: urlsForUser(req.session, urlDatabase),
    loggedIn: req.session.userId
  };
  res.render("urls_index", templateVars);
});

router.post("/new", (req, res) => {
  console.log(req.body);
  let shortURL = generateRandomString();
  urlDatabase[shortURL] = { longURL: req.body.longURL, userId: req.session.userId, views: 0 };
  console.log(urlDatabase);
  res.redirect("./");

});

router.post("/:shortURL/edit", (req, res) => {
  if (urlsForUser(req.session, urlDatabase)[req.params.shortURL]) {
    console.log(`updating ${req.params.shortURL} to`);
    // console.log(req.body);
    console.log(urlDatabase[req.params.shortURL]);
    urlDatabase[req.params.shortURL].longURL = req.body.newURL;
    console.log(urlDatabase[req.params.shortURL]);
    res.redirect("../");
  } else {
    res.send("you cannot edit this URL!");
    res.redirect("./");
  }

});

router.post("/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("../");
});

module.exports = router;