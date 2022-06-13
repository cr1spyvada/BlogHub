const mongoose = require("mongoose");
const { default: slugify } = require("slugify");
const { marked } = require("marked");
const createDomPurifier = require("dompurify");
const { JSDOM } = require("jsdom");
const dompurify = createDomPurifier(new JSDOM().window);

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  markdown: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: new Date(),
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  sanitizedHtml: {
    type: String,
    required: true,
  },
});
articleSchema.pre("validate", function (next) {
  if (this.title !== undefined) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }

  if (this.markdown) {
    this.sanitizedHtml = dompurify.sanitize(marked(this.markdown));
  }
  next();
});
module.exports = mongoose.model("Article", articleSchema);
