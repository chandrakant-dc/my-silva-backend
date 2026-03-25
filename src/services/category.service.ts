import type { Request, Response } from "express";
import fs from "fs";
import mongoose from "mongoose";
import path from "path";
import Category from "../models/category.model";

export const createCategoryModel = async (req: Request, res: Response) => {
    try {
        const { name } = req.body;
        const imageUrl = req.file
            ? `${req.protocol}://${req.get("host")}/uploads/categories/${req.file.filename}`
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
        const cate = new Category({ name, image: imageUrl });
        await cate.save();
        return res.status(201).json({
            status: true,
            message: "category created"
        })
    } catch (error) {
        throw error;
    }
}

export const updateCategoryModel = async (req: Request, res: Response) => {
    try {
        const { name, id } = req.body;

        if (!id) {
            return res.status(400).json({
                status: false,
                message: "Category ID is required"
            });
        }

        if (!name || !name.trim()) {
            return res.status(400).json({
                status: false,
                message: "Category name is required"
            });
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                status: false,
                message: "Invalid Category ID"
            });
        }

        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({
                status: false,
                message: "Category not found"
            });
        }

        let imageUrl = category.image;

        if (req.file) {
            if (category.image) {
                const oldImagePath = category.image.split("/uploads/")[1];
                const fullPath = path.join("uploads", oldImagePath || "");

                if (fs.existsSync(fullPath)) {
                    fs.unlinkSync(fullPath);
                }
            }

            imageUrl = `${req.protocol}://${req.get("host")}/uploads/categories/${req.file.filename}`;
        }

        const updatedCategory = await Category.findByIdAndUpdate(
            id,
            {
                name: name.trim(),
                image: imageUrl
            },
            { new: true }
        );

        return res.status(200).json({
            status: true,
            message: "Category updated successfully",
            data: updatedCategory
        });

    } catch (error: any) {
        return res.status(500).json({
            status: false,
            message: error.message || "Internal server error"
        });
    }
};

export const deleteCategoryModel = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id || Array.isArray(id)) {
            return res.status(400).json({
                status: false,
                message: "Category ID is required"
            });
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                status: false,
                message: "Invalid Category ID"
            });
        }

        const deletedCategory = await Category.findByIdAndDelete(id);

        if (!deletedCategory) {
            return res.status(404).json({
                status: false,
                message: "Category not found"
            });
        }

        return res.status(200).json({
            status: true,
            message: "Category deleted successfully"
        });

    } catch (error: any) {
        return res.status(500).json({
            status: false,
            message: error.message || "Internal server error"
        });
    }
}

export const getAllCategoryModel = async (req: Request, res: Response) => {
    try {
        const allCategory = await Category.find({});
        res.status(200).json({
            status: true,
            data: allCategory
        })
    } catch (error: any) {
        return res.status(500).json({
            status: false,
            message: error.message || "Internal server error"
        });
    }
}