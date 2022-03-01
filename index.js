const express = require("express");
const app = express();
const bp = require("body-parser");
const mongoose = require("mongoose");
const short = require("short-uuid");
const ShortUniqueId = require("short-unique-id");
require('dotenv').config()
const url =
  "mongodb+srv://urlshortner:"+process.env.DB_PASSWORD+"@urlshortner.feten.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

mongoose.connect(
  url,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (err) {
      return console.log(err);
    } else {
      console.log("mongo db connected...");
    }
  }
);

const urlSchema = new mongoose.Schema({
  url: String,
  shorturl: String,
});

const Url = mongoose.model("Url", urlSchema);

app.use(bp.urlencoded({ extended: false }));

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index", { shorturl: null });
});
app.post("/shorturl", (req, res) => {
  const uid = new ShortUniqueId();
  const uuid = uid(6);
  
  const newurl = new Url({ url: req.body.url, shorturl: uuid });
  newurl.save((err, doc) => {
    if (err) {
      console.log(err);
    } else {
      res.render("index", {
        shorturl: "http://" + req.headers.host + "/" + doc.shorturl,
      });
    }
  });
});
app.get("/:shorturl", (req, res) => {
  Url.findOne({ shorturl: req.params.shorturl }, (err, data) => {
    if (data) return res.redirect(data.url);

    res.render("index", { shorturl: "Url not found!!!" });
  });
});

app.listen(8080, (err) => {
  if (!err) return console.log("Server started");
});
