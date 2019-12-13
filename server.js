require("dotenv").config();
require("./config/mongo");
require("./config/passport");
const express = require("express");
const server = express();
const session = require("express-session");
const cors = require("cors");
const passport = require("passport");

server.use(express.urlencoded({ extended: true }));
server.use(express.json());

server.use(
  session({
    cookie: { secure: false, maxAge: 4 * 60 * 60 * 1000 },
    resave: true,
    saveUninitialized: true,
    secret: "hey"
  })
);
const corOptions = {
  origin: process.env.FRONT_URL,
  credentials: true,
  optionsSuccessStatus: 200
};

server.use(cors(corOptions));

server.use(passport.initialize());
server.use(passport.session());

const main = require("./routes/main");
server.use(main);
const auth = require("./routes/auth");
server.use(auth);
const taskManagement = require("./routes/taskManagement");
server.use(taskManagement);

server.listen(process.env.PORT, () => {
  console.log("listening on port" + process.env.PORT);
});
