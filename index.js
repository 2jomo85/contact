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

// Routes
app.use("/", require("./routes/home"));
app.use("/contacts", require("./routes/contacts"));

// Port setting
var port = 3000;
app.listen(port, function () {
  console.log("server on! http://localhost:" + port);
});
