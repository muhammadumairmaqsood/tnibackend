import Blog from "../models/blogModel.js";
import cloudinary, { fileUpload } from "../config/uploadCloudinary.js";
const convertToArray = (value) => {
  if (!value) {
    return [];
  }

  // Agar already array hai
  if (Array.isArray(value)) {
    return value
      .flatMap((item) => String(item).split(","))
      .map((item) => item.trim())
      .filter(Boolean);
  }

  // Agar comma-separated string hai
  return String(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

export const createBlog = async (req, res) => {
  try {
    const {
      title,
      slug,
      category,
      author,
      tags,
      content,
      status,
      seoTitle,
      seoDescription,
      seoKeywords,
    } = req.body;

    console.log("FILES:", req.files);

    // -----------------------------
    // Upload featured image
    // -----------------------------

    const image = await fileUpload(req.files);

    if (!image) {
      return res.status(400).json({
        message: "Image upload failed",
      });
    }

    // -----------------------------
    // Convert tags to array
    // -----------------------------

    const tagsArray = convertToArray(tags);

    // -----------------------------
    // Convert SEO keywords to array
    // -----------------------------

    const seoKeywordsArray = convertToArray(seoKeywords);

    // -----------------------------
    // Create Blog
    // -----------------------------

    const blog = await Blog.create({
      title,
      slug,
      featuredImage: {
        url: image.url,
        public_id: image.public_id,
      },
      category,
      author,
      tags: tagsArray,
      content,
      status,
      seoTitle,
      seoDescription,
      seoKeywords: seoKeywordsArray,
    });

    return res.status(201).json({
      message: "Blog created successfully",
      blog,
    });
  } catch (error) {
    console.log("Create Blog Error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

// Get All Blogs Post

export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Blogs fetched successfully",
      blogs,
    });
  } catch (error) {
    console.log("Get All Blogs Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
// Blog Published
export const publishBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findByIdAndUpdate(
      id,
      {
        status: "published",
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Blog published successfully",
      blog,
    });
  } catch (error) {
    console.log("Publish Blog Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Get Published Blogs
export const getPublishedBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({
      status: "published",
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      blogs,
    });
  } catch (error) {
    console.log("Get Published Blogs Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
// Get Blogs by ID
export const getBlogBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const blog = await Blog.findOne({
      slug,
      status: "published",
    });

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    return res.status(200).json({
      success: true,
      blog,
    });
  } catch (error) {
    console.log("Get Blog By Slug Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
// Update Blog
export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("================================");
    console.log("UPDATE BLOG ID:", id);
    console.log("BODY:", req.body);
    console.log("FILES:", req.files);
    console.log("================================");

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    // ==========================================
    // UPDATE TEXT FIELDS
    // ==========================================

    blog.title = req.body.title;

    blog.slug = req.body.slug;

    blog.category = req.body.category;

    blog.author = req.body.author;

    blog.content = req.body.content;

    blog.status = req.body.status;

    blog.seoTitle = req.body.seoTitle;

    blog.seoDescription = req.body.seoDescription;

    // ==========================================
    // TAGS
    // ==========================================

    blog.tags = convertToArray(req.body.tags);

    // ==========================================
    // SEO KEYWORDS
    // ==========================================

    blog.seoKeywords = convertToArray(req.body.seoKeywords);

    // ==========================================
    // IMAGE
    // ==========================================

    if (req.files && req.files.length > 0) {
      console.log("NEW IMAGE FOUND");

      // Old public_id
      const oldPublicId = blog.featuredImage?.public_id;

      console.log("OLD PUBLIC ID:", oldPublicId);

      // Delete old image
      if (oldPublicId) {
        try {
          const deleteResult = await cloudinary.uploader.destroy(oldPublicId);

          console.log("DELETE RESULT:", deleteResult);
        } catch (error) {
          console.log("OLD IMAGE DELETE ERROR:", error);
        }
      }

      // Upload new image
      const newImage = await fileUpload(req.files);

      if (!newImage) {
        return res.status(400).json({
          message: "New image upload failed",
        });
      }

      // Save new image
      blog.featuredImage = {
        url: newImage.url,
        public_id: newImage.public_id,
      };
    }

    // ==========================================
    // SAVE
    // ==========================================

    await blog.save();

    console.log("FINAL BLOG FROM DATABASE:", blog);

    return res.status(200).json({
      message: "Blog updated successfully",
      blog,
    });
  } catch (error) {
    console.log("UPDATE BLOG ERROR:", error);

    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
// Get Blog by ID
export const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    return res.status(200).json({
      success: true,
      blog,
    });
  } catch (error) {
    console.log("GET BLOG BY ID ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
// Delete blog
export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    // Find blog first
    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    // -----------------------------
    // Delete image from Cloudinary
    // -----------------------------

    if (blog.featuredImage?.public_id) {
      await cloudinary.uploader.destroy(blog.featuredImage.public_id);
    }

    // -----------------------------
    // Delete blog from MongoDB
    // -----------------------------

    await Blog.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Blog and featured image deleted successfully",
    });
  } catch (error) {
    console.log("Delete Blog Error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
