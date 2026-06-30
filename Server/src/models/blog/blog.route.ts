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
import { uploadMiddleware } from "../../middlewares/upload.middleware";

const router = Router();

router.post(
    "/",
    auth("admin", "farmer"),
    uploadMiddleware.array("photos"),
    postBlog
);
router.get("/owner", auth("admin", "farmer"), getBlogsByOwner);
router.get("/", getAllBlogs);
router.put(
    "/:blogId",
    auth("admin", "farmer"),
    uploadMiddleware.array("photos"),
    updateBlogById
);
router.delete("/:blogId", auth("admin"), deleteBlogById);
router.post("/:blogId/like", likeBlogById);

export const BlogRouter = router;
