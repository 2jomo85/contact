// index.js

var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var app = express();

// DB Setting
mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);

// process.env : node.js 에서 기본으로 제공하는 환경변수를 가지고오 는 객체
mongoose.connect(process.env.MONGO_DB);
var db = mongoose.connection;

db.once("open", function () {
  console.log("DB connected");
});

db.on("error", function (err) {
  console.log("DB ERROR : ", err);
});

// Other settings
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
// json 형식으로 데이터를 받는다고 설정.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// DB schema
var contactSchema = mongoose.Schema({
  name: { type: String, require: true, unique: true },
  email: { type: String },
  phone: { type: String },
});
var Contact = mongoose.model("contact", contactSchema);

// Routes
// Home
app.get("/", function (req, res) {
  res.redirect("/contacts");
});
// Contacts - Index
app.get("/contacts", function (req, res) {
  Contact.find({}, function (err, contacts) {
    if (err) return res.json(err);
    res.render("contacts/index", { contacts: contacts });
  });
});

// Contacts - New
app.get("/contacts/new", function (req, res) {
  res.render("contacts/new");
});

// Contacts - Create
app.post("/contacts", function (req, res) {
  Contact.create(req.body, function (err, contact) {
    if (err) return res.json(err);
    res.redirect("/contacts");
  });
});

// Contacts - show
app.get("/contacts/:id", function (req, res) {
  Contact.findOne({ _id: req.params.id }, function (err, contact) {
    if (err) return res.json(err);
    res.render("contacts/show", { contact: contact });
  });
});

//Contacts - edit
app.get("/contacts/:id/edit", function (req, res) {
  Contact.findOne({ _id: req.params.id }, function (err, contact) {
    if (err) return res.json(err);
    res.render("contacts/edit", { contact: contact });
  });
});

// Contacts - update
app.put("/contacts/:id", function (req, res) {
  Contact.findOneAndUpdate({ _id: req.params.id }, req.body, function (err, contact) {
    if (err) return res.json(err);
    res.redirect("/contacts/" + req.params.id);
  });
});

// Contacts - destroy
app.delete("/contacts/:id", function (req, res) {
  Contact.deleteOne({ _id: req.params.id }, function (err) {
    if (err) return res.json(err);
    res.redirect("/contacts");
  });
});

// Port setting
var port = 3000;
app.listen(port, function () {
  console.log("server on! http://localhost:" + port);
});
