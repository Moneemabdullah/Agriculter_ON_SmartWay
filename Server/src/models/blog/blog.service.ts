import blogModel from "./blog.model";
import { IBlog } from "./bolg.type";

export const postBlogService = async (blogbody: IBlog) => {
    const nowBlog = new blogModel(blogbody);
    return await nowBlog.save();
};

export const getBlogServiceByOwner = async (userId: string) => {
    const blogs = await blogModel
        .find({ owner: userId })
        .populate("owner", "username email")
        .exec();
    return blogs;
};

export const getAllBlogsService = async () => {
    const blogs = await blogModel
        .find()
        .populate("owner", "username email")
        .exec();
    return blogs;
};

export const updateBlogServiceById = async (
    blogId: string,
    updateData: Partial<IBlog>
) => {
    const updatedBlog = await blogModel
        .findByIdAndUpdate(blogId, updateData, { new: true })
        .exec();
    return updatedBlog;
};

export const deleteBlogServiceById = async (blogId: string) => {
    const deletedBlog = await blogModel.findByIdAndDelete(blogId).exec();
    return deletedBlog;
};

export const likeBlogServiceById = async (blogId: string) => {
    const likedBlog = await blogModel
        .findByIdAndUpdate(blogId, { $inc: { likes: 1 } }, { new: true })
        .exec();
    return likedBlog;
};
