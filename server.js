const express = require("express");
const articleRouter = require("./routes/articles");
const mongoose = require("mongoose");
const Article = require("./models/article");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const app = express();

mongoose.connect("mongodb://localhost/blog", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride("_method"));

app.use("/articles", articleRouter);

app.get("/", async (req, res) => {
  const articles = await Article.find().sort({ date: "desc" });
  res.render("articles/index", { articles });
});

app.listen(5000);
