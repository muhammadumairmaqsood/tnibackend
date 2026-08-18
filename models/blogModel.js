import mongoose from "mongoose";
const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      trim: true,
    },

    featuredImage: {
      url: String,
      public_id: String,
    },

    category: {
      type: String,
      required: true,
    },

    author: {
      type: String,
    },

    tags: {
      type: [String],
      default: [],
    },

    content: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },

    seoTitle: {
      type: String,
    },

    seoDescription: {
      type: String,
    },

    seoKeywords: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);
const Blog = mongoose.model("Blog", blogSchema);
export default Blog;
