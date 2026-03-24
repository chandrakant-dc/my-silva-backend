import type { Request, Response } from "express";
import mongoose from "mongoose";
import SubCategory from "../models/subcategory.model";

export const createSubCategoryModel = async (req: Request, res: Response) => {
    try {
        const { name, categoryId } = req.body;
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

        await SubCategory.create({ name, category: categoryId });

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
        const { name, categoryId, id } = req.body;

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

        const updatedCategory = await SubCategory.findByIdAndUpdate(
            id,
            { name: name.trim() },
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