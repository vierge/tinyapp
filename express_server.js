const express = require('express');
const bcrypt = require('bcrypt');
const app = express();
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const urls = require('./urlsRouter');
const PORT = 8080;

const { generateRandomString, userValidator } = require('./helpers');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
  session: "session",
  keys: ["key1", "key2"]
}));
app.use('/urls', urls);

// VALIDATION MIDDLEWARE: CHECKS IF USER IS LOGGED IN. should fire on EVERY PAGE LOAD



app.use('/', (req, res, next) => {
  console.log(req.path);
  if (!req.session.userId && req.path !== '/login') {
    res.redirect("/login");
  } else {
    next();
  }
});


// BASE, LOGIN, AND REGISTRATION FUNCTIONALITY


app.get("/login", (req, res) => {
  let templateVars = {
    loggedIn: req.session.userId
  };
  res.render("urls_login", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  urlDatabase[req.params.shortURL].views++;
  res.redirect(`${urlDatabase[req.params.shortURL].longURL}`);
});


//POST

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  console.log("FIRING LOGIN userValidator");
  if (userValidator(email, "email")) {
    const key = userValidator(email, "email");
    if (bcrypt.compareSync(password, key.hashedPassword)) {
      req.session.userId = key.id;
      console.log("cookie created! user logged in!");
      return res.redirect("/urls");
    }
  }
  console.log("INVALID LOGIN");
  res.status(403);
  res.send("403 error. Invalid Login");
});

app.get("/logout", (req, res) => {
  req.session = null;
  console.log("COOKIE EATEN");
  res.redirect("/urls");
});

app.post("/register", (req, res) => {
  const { email, password } = req.body;
  console.log("FIRING EMAIL userValidator");
  if (email && password && !userValidator(email, "email")) {
    const newID = generateRandomString();
    userList[newID] = {
      id: newID,
      email: email,
      hashedPassword: bcrypt.hashSync(password, 10)
    };
    req.session.userId = newID;
    console.log(userList); //debug
    res.redirect("/urls");
  } else {
    res.status(400);
    res.send("400 Error. That user already exists!");
  }
});

//DEBUG

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});


//DEV NOTE: THIS NEEDS TO BE AT THE BOTTOM

app.listen(PORT, () => {
  console.log(`example app listening on ${PORT}!`);
});
