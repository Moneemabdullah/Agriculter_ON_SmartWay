import { Router } from "express";
import {
    postBlog,
    getBlogsByOwner,
    getAllBlogs,
    updateBlogById,
    deleteBlogById,
    likeBlogById,
} from "./blog.controller";
import auth from "../../middlewares/auth.middleware";

const router = Router();

router.post("/", auth("admin", "farmer"), postBlog);
router.get("/owner", auth("admin", "farmer"), getBlogsByOwner);
router.get("/", getAllBlogs);
router.put("/:blogId", auth("admin", "farmer"), updateBlogById);
router.delete("/:blogId", auth("admin"), deleteBlogById);
router.post("/:blogId/like", likeBlogById);

export const BlogRouter = router;
