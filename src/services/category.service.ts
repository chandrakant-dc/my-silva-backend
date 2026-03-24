import type { Request, Response } from "express";
import mongoose from "mongoose";
import Category from "../models/category.model";

export const createCategoryModel = async (req: Request, res: Response) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({
                message: "name is required"
            })
        }
        const cate = new Category({ name });
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

        const updatedCategory = await Category.findByIdAndUpdate(
            id,
            { name: name.trim() },
            { new: true }
        );

        if (!updatedCategory) {
            return res.status(404).json({
                status: false,
                message: "Category not found"
            });
        }

        return res.status(200).json({
            status: true,
            message: "Category updated successfully",
            // data: updatedCategory
        });

    } catch (error: any) {
        return res.status(500).json({
            status: false,
            message: error.message || "Internal server error"
        });
    }
}

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