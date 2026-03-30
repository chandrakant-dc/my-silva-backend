import type { Request, Response } from "express";
import { createSubCategoryModel, deleteSubCategoryModel, getAllSubCategoryModel, getSubCategoryByCategoryIdModel, getSubCategoryByIdModel, updateSubCategoryModel } from "../services/subcategory.service";


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