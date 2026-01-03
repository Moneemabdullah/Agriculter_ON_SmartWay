import { Router } from "express";
import {
    postBlog,
    getBlogsByOwner,
    getAllBlogs,
    updateBlogById,
    deleteBlogById,
    likeBlogById,
} from "./blog.controller";

const router = Router();

router.post("/", postBlog);
router.get("/owner/:userId", getBlogsByOwner);
router.get("/", getAllBlogs);
router.put("/:blogId", updateBlogById);
router.delete("/:blogId", deleteBlogById);
router.post("/:blogId/like", likeBlogById);

export const BlogRouter = router;
