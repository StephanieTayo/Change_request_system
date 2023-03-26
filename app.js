const express = require('express');
const routes = require("./routes/routes")
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const cookieParser = require("cookie-parser");
var ejs = require("ejs");
const flash = require('express-flash')
var session = require('express-session');

app.use(express.static('public'))
app.listen(3000, () => {
    console.log('Your Server is running on 3000');
})
app.set("view engine", "html");
app.engine("html", ejs.renderFile);

mongoose
  .connect("mongodb+srv://joelngalamulume90:qsdfghjk@cluster0.ikvclo8.mongodb.net/wap?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(flash());
app.use(session({ cookie: { maxAge: 60000 }, 
  secret: 'secret',
  resave: false, 
  saveUninitialized: false}));
app.use(cookieParser());



app.use("/",routes);