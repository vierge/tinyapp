const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const PORT = 8080;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());

const urlDatabase = {
  "b2xVn2": { longURL: "http://lighthouselabs.ca", userid: "lonley" },
  "9sm5xk": { longURL: "http://google.com", userid: "lonley" }
}

const users = {
  lonley: {
    id: "lonley",
    email: "forever@alone.me",
    password: "iwantahug"
  };
};

const generateRandomString = () => {
  return (Math.random() + 1).toString(36).substring(6);
}

const validator = (value, property) => {
  console.log(`CURRENT USERS:`);
  console.log(users);
  console.log(`checking for: ${value} in users.${property}`);
  for (let key in users) {
    console.log(`COMPARING KEY ${users[key][property]} to ${value}`);
    if (users[key][property] === value) {
      return users[key];
    };
  }
  return false;
}

app.get("/urls", (req, res) => {
  let templateVars = { 
    urls: urlDatabase
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { 
    shortURL: req.params.shortURL, 
    longURL: urlDatabase[req.params.shortURL] 
  };
  res.render("urls_show", templateVars);
});

app.post("/urls/new", (req, res) => {
  console.log(req.body);
  let shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls/${shortURL}`);

});

app.get("/register", (req, res) => {
  res.render("urls_register");
}); 

app.get("/login", (req, res) => {
  res.render("urls_login");
});

app.get("/u/:shortURL", (req, res) => {
  res.redirect(`${urlDatabase[req.params.shortURL]}`);
})

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

app.post("/urls/:shortURL/edit", (req, res) => {
  console.log(`updating ${req.params.shortURL} to ${req.body}`)
  urlDatabase[req.params.shortURL] = req.body.newURL;
  res.redirect('/urls');
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  console.log("FIRING LOGIN VALIDATOR");
  if (validator(email, "email") && validator(password, "password")) {
    let key = validator(email, "email");
    res.cookie("user_id", key.id);
    console.log("cookie created! user logged in!");
    res.redirect("/urls");
  } else {
    console.log("INVALID LOGIN");
    res.status(403);
    res.send("403 error. Invalid Login");
  };
});

app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  console.log("COOKIE EATEN");
  res.redirect("/urls");
});

app.post("/register", (req, res) => {
  const { email, password } = req.body;
  console.log("FIRING EMAIL VALIDATOR");
  if ( email && password && !validator(email, "email")) {
    const newID = generateRandomString();
    users[newID] = {
      id: newID,
      email: email,
      password: password
      };
    res.cookie("user_id", true);
    console.log(users);
    res.redirect("/urls");
  } else {
    res.status(400);
    res.send("400 Error. That user already exists!");
  }
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.listen(PORT, () => {
  console.log(`example app listening on ${PORT}!`);
});