const { urlDatabase, userList }  = require('./databases');
const { urlsForUser } = require('./helpers')
const router = require('express').Router();

router.get("/", (req, res) => {
  let templateVars = {
    urls: urlsForUser(req.session, urlDatabase),
    loggedIn: req.session.userId
  };
  res.render("urls_index", templateVars);
});

router.get("/new", (req, res) => {
  let templateVars = {
    loggedIn: req.session.userId
  };
  if (req.session.userId) {
    res.render("urls_new", templateVars);
  } else {
    res.redirect("/login");
  }
});

router.get("/:shortURL", (req, res) => {
  let templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL,
    loggedIn: req.session.userId
  };
  res.render("urls_show", templateVars);
});

router.post("/new", (req, res) => {
  console.log(req.body);
  let shortURL = generateRandomString();
  urlDatabase[shortURL] = { longURL: req.body.longURL, userid: req.session.userId };
  res.redirect("/");

});

router.post("/:shortURL/edit", (req, res) => {
  if (urlsForUser(req.session, urlDatabase)[req.params.shortURL]) {
    console.log(`updating ${req.params.shortURL} to ${req.body}`);
    urlDatabase[req.params.shortURL] = req.body.newURL;
    res.redirect('/');
  } else {
    res.send("you cannot edit this URL!");
    res.redirect('/');
  }

});

router.post("/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/");
});

module.exports = router;