import type { Request, Response } from "express";
import fs from "fs";
import mongoose from "mongoose";
import path from "path";
import SubCategory from "../models/subcategory.model.js";

export const createSubCategoryModel = async (req: Request, res: Response) => {
    try {
        const { name, categoryId, description } = req.body;
        const imageUrl = req.file
            ? `${req.protocol}://${req.get("host")}/uploads/subcategories/${req.file.filename}`
            : "";

        if (!imageUrl) {
            return res.status(400).json({
                message: "image is required"
            })
        }

        if (!name) {
            return res.status(400).json({
                message: "name is required"
            })
        }

        if (!categoryId) {
            return res.status(400).json({
                status: false,
                message: "Category ID is required"
            });
        }

        if (!mongoose.Types.ObjectId.isValid(categoryId)) {
            return res.status(400).json({
                status: false,
                message: "Invalid Category ID"
            });
        }

        await SubCategory.create({ name, category: categoryId, image: imageUrl, description });

        return res.status(201).json({
            status: true,
            message: "subcategory created"
        })
    } catch (error: any) {
        return res.status(500).json({
            status: false,
            message: error?.message || "Internal server error"
        });
    }
}

export const updateSubCategoryModel = async (req: Request, res: Response) => {
    try {
        const { name, categoryId, id, description } = req.body;

        if (!categoryId) {
            return res.status(400).json({
                status: false,
                message: "Category ID is required"
            });
        }

        if (!mongoose.Types.ObjectId.isValid(categoryId)) {
            return res.status(400).json({
                status: false,
                message: "Invalid Category ID"
            });
        }

        if (!id) {
            return res.status(400).json({
                status: false,
                message: "SubCategory ID is required"
            });
        }

        if (!name || !name.trim()) {
            return res.status(400).json({
                status: false,
                message: "SubCategory name is required"
            });
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                status: false,
                message: "Invalid SubCategory ID"
            });
        }

        const subcategory = await SubCategory.findById(id);
        if (!subcategory) {
            return res.status(404).json({
                status: false,
                message: "SubCategory not found"
            });
        }

        let imageUrl = subcategory.image;

        if (req.file) {
            if (subcategory.image) {
                const oldImagePath = subcategory.image.split("/uploads/")[1];
                const fullPath = path.join("uploads", oldImagePath || "");

                if (fs.existsSync(fullPath)) {
                    fs.unlinkSync(fullPath);
                }
            }

            imageUrl = `${req.protocol}://${req.get("host")}/uploads/subcategories/${req.file.filename}`;
        }

        const updatedCategory = await SubCategory.findByIdAndUpdate(
            id,
            {
                name: name.trim(),
                image: imageUrl,
                description
            },
            { new: true }
        );

        if (!updatedCategory) {
            return res.status(404).json({
                status: false,
                message: "SubCategory not found"
            });
        }

        return res.status(200).json({
            status: true,
            message: "SubCategory updated successfully",
            // data: updatedCategory
        });

    } catch (error: any) {
        return res.status(500).json({
            status: false,
            message: error.message || "Internal server error"
        });
    }
}

export const deleteSubCategoryModel = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id || Array.isArray(id)) {
            return res.status(400).json({
                status: false,
                message: "SubCategory ID is required"
            });
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                status: false,
                message: "Invalid SubCategory ID"
            });
        }

        const deletedCategory = await SubCategory.findByIdAndDelete(id);

        if (!deletedCategory) {
            return res.status(404).json({
                status: false,
                message: "SubCategory not found"
            });
        }

        return res.status(200).json({
            status: true,
            message: "SubCategory deleted successfully"
        });

    } catch (error: any) {
        return res.status(500).json({
            status: false,
            message: error.message || "Internal server error"
        });
    }
}

export const getAllSubCategoryModel = async (req: Request, res: Response) => {
    try {
        const allSubCategory = await SubCategory.find({}).populate("category", "name");
        res.status(200).json({
            status: true,
            data: allSubCategory
        })
    } catch (error: any) {
        return res.status(500).json({
            status: false,
            message: error.message || "Internal server error"
        });
    }
}

export const getSubCategoryByCategoryIdModel = async (req: Request, res: Response) => {
    try {
        const categoryId = req.params.categoryId as string;

        const subcategories = await SubCategory.aggregate([
            {
                $match: {
                    category: new mongoose.Types.ObjectId(categoryId)
                }
            },
            {
                $lookup: {
                    from: "topics",
                    localField: "_id",
                    foreignField: "subcategory",
                    as: "topics"
                }
            },
            {
                $addFields: {
                    topicCount: { $size: "$topics" }
                }
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "category",
                    foreignField: "_id",
                    as: "category"
                }
            },
            {
                $unwind: "$category"
            },
            {
                $project: {
                    name: 1,
                    description: 1,
                    image: 1,
                    topicCount: 1,
                    "category._id": 1,
                    "category.name": 1
                }
            }
        ]);

        res.status(200).json({
            status: true,
            data: subcategories
        });

    } catch (error: any) {
        return res.status(500).json({
            status: false,
            message: error.message || "Internal server error"
        });
    }
};


export const getSubCategoryByIdModel = async (req: Request, res: Response) => {
    try {
        const subCategoryId = req.params.subCategoryId as string;

        if (!mongoose.Types.ObjectId.isValid(subCategoryId)) {
            return res.status(400).json({
                status: false,
                message: "Invalid SubCategory ID"
            });
        }

        const subcategory = await SubCategory.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(subCategoryId)
                }
            },
            {
                $lookup: {
                    from: "topics",
                    localField: "_id",
                    foreignField: "subcategory",
                    as: "topics"
                }
            },
            {
                $addFields: {
                    topicCount: { $size: "$topics" }
                }
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "category",
                    foreignField: "_id",
                    as: "category"
                }
            },
            {
                $unwind: "$category"
            },
            {
                $project: {
                    name: 1,
                    description: 1,
                    image: 1,
                    topicCount: 1,
                    "category._id": 1,
                    "category.name": 1
                }
            }
        ]);

        res.status(200).json({
            status: true,
            data: subcategory[0] || null
        });

    } catch (error: any) {
        return res.status(500).json({
            status: false,
            message: error.message || "Internal server error"
        });
    }
};