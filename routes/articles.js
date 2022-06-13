const express = require("express");
const Article = require("../models/article");
const router = express.Router();

router.get("/new", (req, res) => {
  res.render("articles/new", { article: new Article() });
});

router.get("/edit/:id", async (req, res) => {
  const article = await Article.findById(req.params.id);
  res.render("articles/edit", { article });
});

router.get("/:slug", async (req, res) => {
  const article = await Article.findOne({ slug: req.params.slug });
  if (article === null) res.redirect("/");
  res.render("articles/show", { article });
});
router.post(
  "/",
  async (req, res, next) => {
    req.article = new Article();
    next();
  },
  saveArticle("new")
);

router.put(
  "/:id",
  async (req, res, next) => {
    req.article = await Article.findById(req.params.id);
    console.log({ article: req.params });
    next();
  },
  saveArticle("edit")
);

router.delete("/:id", async (req, res) => {
  // let article = await Article.findById(req.params.id);
  await Article.findByIdAndDelete(req.params.id);
  res.redirect("/");
});

function saveArticle(path) {
  return async (req, res) => {
    let article = req.article;
    article.title = req.body.title;
    article.content = req.body.content;
    article.markdown = req.body.markdown;
    //   let article = new Article({
    //   title: req.body.title,
    //   content: req.body.content,
    //   markdown: req.body.markdown,
    // });
    // console.log({ article });
    try {
      await article.save();
      res.redirect(`/articles/${article.slug}`);
    } catch (err) {
      console.warn({ err });
      res.render(`articles/${path}`, { article });
    }
  };
}

module.exports = router;
