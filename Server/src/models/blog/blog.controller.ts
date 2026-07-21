import { NextFunction, Request, Response } from "express";
import { AppError } from "../../utils/appError.utils";
import {
    postBlogService,
    getBlogServiceByOwner,
    getAllBlogsService,
    updateBlogServiceById,
    deleteBlogServiceById,
    likeBlogServiceById,
} from "./blog.service";

const postBlog = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const blogData = req.body;
        blogData.owner = req.userId;
        const newBlog = await postBlogService(blogData);
        res.status(201).json({ success: true, message: "Blog created successfully", data: newBlog });
    } catch (error) {
        next(error);
    }
};

const getBlogsByOwner = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.userId;
        if (!userId) throw new AppError("Unauthorized", 401);
        const blogs = await getBlogServiceByOwner(userId);
        res.status(200).json({ success: true, message: "Blogs retrieved successfully", data: blogs });
    } catch (error) {
        next(error);
    }
};

const getAllBlogs = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const blogs = await getAllBlogsService();
        res.status(200).json({ success: true, message: "Blogs retrieved successfully", data: blogs });
    } catch (error) {
        next(error);
    }
};

const updateBlogById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const blogId = String(req.params.blogId);
        const updateData = req.body;
        if (!blogId) throw new AppError("Blog ID is required", 400);
        const updatedBlog = await updateBlogServiceById(
            blogId,
            updateData
        );
        res.status(200).json({ success: true, message: "Blog updated successfully", data: updatedBlog });
    } catch (error) {
        next(error);
    }
};

const deleteBlogById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const blogId = String(req.params.blogId);
        if (!blogId) throw new AppError("Blog ID is required", 400);
        const deletedBlog = await deleteBlogServiceById(blogId);
        if (!deletedBlog) {
            throw AppError.notFound("Blog not found");
        }
        res.status(200).json({ success: true, message: "Blog deleted successfully", data: deletedBlog });
    } catch (error) {
        next(error);
    }
};

const likeBlogById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const blogId = String(req.params.blogId);
        if (!blogId) throw new AppError("Blog ID is required", 400);
        const likedBlog = await likeBlogServiceById(blogId);
        res.status(200).json({ success: true, message: "Blog liked successfully", data: likedBlog });
    } catch (error) {
        next(error);
    }
};
export {
    postBlog,
    getBlogsByOwner,
    getAllBlogs,
    updateBlogById,
    deleteBlogById,
    likeBlogById,
};
