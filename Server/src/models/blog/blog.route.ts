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
import { validate } from "../../middlewares/validate.middleware";
import { createBlogSchema, updateBlogSchema } from "../../validations/blog.validation";

const router = Router();

router.post(
    "/",
    auth("admin", "farmer"),
    uploadMiddleware.array("photos"),
    validate(createBlogSchema),
    postBlog
);
router.get("/owner", auth("admin", "farmer"), getBlogsByOwner);
router.get("/", getAllBlogs);
router.put(
    "/:blogId",
    auth("admin", "farmer"),
    uploadMiddleware.array("photos"),
    validate(updateBlogSchema),
    updateBlogById
);
router.delete("/:blogId", auth("admin"), deleteBlogById);
router.post("/:blogId/like", auth(), likeBlogById);

export const BlogRouter = router;
