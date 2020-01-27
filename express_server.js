const express = require('express');
const bcrypt = require('bcrypt');
const app = express();
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const urls = require('./urlsRouter');
const PORT = 8080;

const { urlDatabase, userList } = require('./databases');
const { generateRandomString, userValidator } = require('./helpers');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
  session: "session",
  keys: ["key1", "key2"]
}));

// this is up high so as to override all other site functionality. a request to a valid shortURL should always proceed
app.get("/u/:shortURL", (req, res) => {
  console.log(urlDatabase[req.params.shortURL]);
  // urlDatabase[req.params.shortURL].views = 1 ? views++ : 1;
  if (urlDatabase[req.params.shortURL] === undefined) {
    res.status(400);
    res.send("invalid link! did you remember to append 'http://' ???")
  } else {
  res.redirect(`${urlDatabase[req.params.shortURL].longURL}`); // KNOWN BUG: without "http://" longURL renders as undefined and BREAKKSKSKSKSKKD
  }
});

// VALIDATION MIDDLEWARE: CHECKS IF USER IS LOGGED IN. should fire on EVERY PAGE LOAD

app.use(express.static('public'));

app.use((req, res, next) => {
  console.log(req.path);
  if (!req.session.userId && req.path !== '/login' && req.path !== '/register') {
    res.redirect("/login");
  } else {
    next();
  }
});


// ROUTER 

app.use('/urls', urls);

// BASE, LOGIN, AND REGISTRATION FUNCTIONALITY

app.get("/", (req, res) => {
  res.redirect("/urls");
})

app.get("/login", (req, res) => {
  let templateVars = {
    loggedIn: req.session.userId
  };
  res.render("urls_login", templateVars);
});


//POST

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  console.log("FIRING LOGIN userValidator");
  if (userValidator(email, "email", userList)) {
    const key = userValidator(email, "email", userList);
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
  res.redirect("/");
});

app.post("/register", (req, res) => {
  const { email, password } = req.body;
  console.log("FIRING EMAIL userValidator");
  if (email && password && !userValidator(email, "email", userList)) {
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
