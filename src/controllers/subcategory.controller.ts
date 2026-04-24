import type { Request, Response } from "express";
import mongoose from "mongoose";
import UserTopicProgresses from "../models/user-topic-progress.model.js";
import { createSubCategoryModel, deleteSubCategoryModel, getAllSubCategoryModel, getSubCategoryByCategoryIdModel, getSubCategoryByIdModel, updateSubCategoryModel } from "../services/subcategory.service.js";


export const createSubCategory = async (req: Request, res: Response) => {
    try {
        await createSubCategoryModel(req, res);
    } catch (error) {
        res.status(400).json({
            message: "something went wrong",
            error: error
        })
    }
}

export const updateSubCategory = async (req: Request, res: Response) => {
    try {
        await updateSubCategoryModel(req, res);
    } catch (error) {
        res.status(400).json({
            message: "something went wrong",
            error: error
        })
    }
}

export const deleteSubCategory = async (req: Request, res: Response) => {
    try {
        await deleteSubCategoryModel(req, res);
    } catch (error) {
        res.status(400).json({
            message: "something went wrong",
            error: error
        })
    }
}

export const getAllSubCategory = async (req: Request, res: Response) => {
    try {
        await getAllSubCategoryModel(req, res);
    } catch (error) {
        res.status(400).json({
            message: "something went wrong",
            error: error
        })
    }
}

export const getSubCategoryByCategoryId = async (req: Request, res: Response) => {
    try {
        await getSubCategoryByCategoryIdModel(req, res);
    } catch (error) {
        res.status(400).json({
            message: "something went wrong",
            error: error
        })
    }
}

export const getOneSubCateDetailsById = async (req: Request, res: Response) => {
    try {
        await getSubCategoryByIdModel(req, res);
    } catch (error) {
        res.status(400).json({
            message: "something went wrong",
            error: error
        })
    }
}

export const getUserProgressSubcategories = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;

        const data = await UserTopicProgresses.aggregate([
            // 1. Only completed topics of user
            {
                $match: {
                    user: new mongoose.Types.ObjectId(userId),
                    status: "completed"
                }
            },

            // 2. Join topic
            {
                $lookup: {
                    from: "topics",
                    localField: "topic",
                    foreignField: "_id",
                    as: "topic"
                }
            },
            { $unwind: "$topic" },

            // 3. Join subcategory
            {
                $lookup: {
                    from: "subcategories",
                    localField: "topic.subcategory",
                    foreignField: "_id",
                    as: "subcategory"
                }
            },
            { $unwind: "$subcategory" },

            // 4. Join category
            {
                $lookup: {
                    from: "categories",
                    localField: "subcategory.category",
                    foreignField: "_id",
                    as: "category"
                }
            },
            { $unwind: "$category" },

            // 5. Group by subcategory (count completed topics)
            {
                $group: {
                    _id: "$subcategory._id",
                    name: { $first: "$subcategory.name" },
                    image: { $first: "$subcategory.image" },
                    description: { $first: "$subcategory.description" },
                    category: { $first: "$category" },
                    completedTopics: { $sum: 1 }
                }
            },

            // 6. Get total topics per subcategory
            {
                $lookup: {
                    from: "topics",
                    localField: "_id",
                    foreignField: "subcategory",
                    as: "allTopics"
                }
            },
            {
                $addFields: {
                    topicCount: { $size: "$allTopics" }
                }
            },

            // 7. Calculate percentage
            {
                $addFields: {
                    overallPercentage: {
                        $round: [
                            {
                                $multiply: [
                                    { $divide: ["$completedTopics", "$topicCount"] },
                                    100
                                ]
                            },
                            0
                        ]
                    }
                }
            },

            // 8. Group by category
            {
                $group: {
                    _id: "$category._id",
                    categoryName: { $first: "$category.name" },
                    allStudiedSubCategory: {
                        $push: {
                            _id: "$_id",
                            name: "$name",
                            image: "$image",
                            description: "$description",
                            category: {
                                _id: "$category._id",
                                name: "$category.name"
                            },
                            topicCount: "$topicCount",
                            overallPercentage: "$overallPercentage"
                        }
                    }
                }
            },

            // 9. Final shape
            {
                $project: {
                    _id: 0,
                    categoryName: 1,
                    allStudiedSubCategory: 1
                }
            }
        ]);

        res.json({
            status: true,
            data
        });

    } catch (error) {
        res.status(500).json({
            status: false,
            message: error
        });
    }
};