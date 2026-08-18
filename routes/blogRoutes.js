import express from "express";
import protectRoute from "../middleware/authMiddleware.js";
import multer from "multer";
import {
  createBlog,
  getAllBlogs,
  publishBlog,
  getPublishedBlogs,
  getBlogBySlug,
  updateBlog,
  getBlogById,
  deleteBlog,
} from "../controllers/blogController.js";
const upload = multer({
  storage: multer.memoryStorage(),
});

const router = express.Router();
router.post("/blog", protectRoute, upload.array("featuredImage"), createBlog);
router.get("/blogs", getAllBlogs);
router.patch("/blog/:id/publish", protectRoute, publishBlog);
router.get("/blogs/published", getPublishedBlogs);
router.get("/blogs/:slug", getBlogBySlug);
router.get("/blog/:id", getBlogById);
router.delete("/blog/:id", protectRoute, deleteBlog);
router.put("/blog/:id", protectRoute, upload.array("featuredImage"), updateBlog);
export default router;
