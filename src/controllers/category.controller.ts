import type { Request, Response } from "express";
import { createCategoryModel, deleteCategoryModel, getAllCategoryModel, updateCategoryModel } from "../services/category.service";


export const createCategory = async (req: Request, res: Response) => {
    try {
        await createCategoryModel(req, res);
    } catch (error) {
        res.status(400).json({
            message: "something went wrong",
            error: error
        })
    }
}

export const updateCategory = async (req: Request, res: Response) => {
    try {
        await updateCategoryModel(req, res);
    } catch (error) {
        res.status(400).json({
            message: "something went wrong",
            error: error
        })
    }
}

export const deleteCategory = async (req: Request, res: Response) => {
    try {
        await deleteCategoryModel(req, res);
    } catch (error) {
        res.status(400).json({
            message: "something went wrong",
            error: error
        })
    }
}

export const getAllCategory = async (req: Request, res: Response) => {
    try {
        await getAllCategoryModel(req, res);
    } catch (error) {
        res.status(400).json({
            message: "something went wrong",
            error: error
        })
    }
}