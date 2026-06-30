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
        res.status(201).json(newBlog);
    } catch (error) {
        next(error);
    }
};

const getBlogsByOwner = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.userId;
        if (!userId) throw new AppError("Unauthorized", 401);
        const blogs = await getBlogServiceByOwner(userId);
        res.status(200).json(blogs);
    } catch (error) {
        next(error);
    }
};

const getAllBlogs = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const blogs = await getAllBlogsService();
        res.status(200).json(blogs);
    } catch (error) {
        next(error);
    }
};

const updateBlogById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const blogId = req.params.blogId;
        const updateData = req.body;
        if (!blogId) throw new AppError("Blog ID is required", 400);
        const updatedBlog = await updateBlogServiceById(
            blogId,
            updateData
        );
        res.status(200).json(updatedBlog);
    } catch (error) {
        next(error);
    }
};

const deleteBlogById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const blogId = req.params.blogId;
        if (!blogId) throw new AppError("Blog ID is required", 400);
        const deletedBlog = await deleteBlogServiceById(blogId);
        res.status(200).json(deletedBlog);
    } catch (error) {
        next(error);
    }
};

const likeBlogById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const blogId = req.params.blogId;
        if (!blogId) throw new AppError("Blog ID is required", 400);
        const likedBlog = await likeBlogServiceById(blogId);
        res.status(200).json(likedBlog);
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
