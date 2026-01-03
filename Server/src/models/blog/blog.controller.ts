import { Request, Response } from "express";
import {
    postBlogService,
    getBlogServiceByOwner,
    getAllBlogsService,
    updateBlogServiceById,
    deleteBlogServiceById,
    likeBlogServiceById,
} from "./blog.service";

const postBlog = async (req: Request, res: Response) => {
    try {
        const blogData = req.body;
        const newBlog = await postBlogService(blogData);
        res.status(201).json(newBlog);
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

const getBlogsByOwner = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        const blogs = await getBlogServiceByOwner(userId as string);
        res.status(200).json(blogs);
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

const getAllBlogs = async (req: Request, res: Response) => {
    try {
        const blogs = await getAllBlogsService();
        res.status(200).json(blogs);
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

const updateBlogById = async (req: Request, res: Response) => {
    try {
        const blogId = req.params.blogId;
        const updateData = req.body;
        const updatedBlog = await updateBlogServiceById(
            blogId as string,
            updateData
        );
        res.status(200).json(updatedBlog);
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

const deleteBlogById = async (req: Request, res: Response) => {
    try {
        const blogId = req.params.blogId;
        const deletedBlog = await deleteBlogServiceById(blogId as string);
        res.status(200).json(deletedBlog);
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

const likeBlogById = async (req: Request, res: Response) => {
    try {
        const blogId = req.params.blogId;
        const likedBlog = await likeBlogServiceById(blogId as string);
        res.status(200).json(likedBlog);
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
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
