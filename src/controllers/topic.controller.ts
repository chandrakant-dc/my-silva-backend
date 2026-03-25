import type { Request, Response } from "express";
import mongoose from "mongoose";
import Questions, { type TopicQuestionsI } from "../models/question.model";
import Topic from "../models/topic.model";

export const createTopic = async (req: Request, res: Response) => {
    try {
        const {
            categoryId,
            subcategoryId,
            topicName,
            description,
            questions,
        } = req.body;

        const topic = await Topic.create({
            category: categoryId,
            subcategory: subcategoryId,
            topicName,
            description,
        });

        const questionsData = questions.map((q: TopicQuestionsI) => ({
            ...q,
            topic: topic._id,
        }));

        await Questions.insertMany(questionsData);

        res.json({
            success: true,
            message: "Topic created",
            data: topic,
        });

    } catch (error) {
        res.status(400).json({
            message: "something went wrong",
            error: error
        })
    }
}

export const getAllTopics = async (req: Request, res: Response) => {
    try {
        const { category, subcategory } = req.query;

        const matchStage: any = {};

        if (category) {
            matchStage.category = new mongoose.Types.ObjectId(category as string);
        }

        if (subcategory) {
            matchStage.subcategory = new mongoose.Types.ObjectId(subcategory as string);
        }
        const topics = await Topic.aggregate([
            {
                $match: matchStage
            },
            {
                $lookup: {
                    from: "questions",
                    localField: "_id",
                    foreignField: "topic",
                    as: "questions"
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
                $lookup: {
                    from: "subcategories",
                    localField: "subcategory",
                    foreignField: "_id",
                    as: "subcategory"
                }
            },
            {
                $unwind: "$category"
            },
            {
                $unwind: "$subcategory"
            },
            {
                $project: {
                    topicName: 1,
                    description: 1,
                    "category._id": 1,
                    "category.name": 1,
                    "subcategory._id": 1,
                    "subcategory.name": 1,
                    questions: 1
                }
            }
        ]);
        res.status(200).json({
            status: true,
            data: topics
        })
    } catch (error) {
        res.status(400).json({
            message: "something went wrong",
            error: error
        })
    }
}

export const deleteTopic = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id || Array.isArray(id)) {
            return res.status(400).json({
                status: false,
                message: "Topic ID is required"
            });
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                status: false,
                message: "Invalid Topic ID"
            });
        }

        const deletedCategory = await Topic.findByIdAndDelete(id);
        await Questions.deleteMany({ topic: id });
        if (!deletedCategory) {
            return res.status(404).json({
                status: false,
                message: "Topic not found"
            });
        }

        return res.status(200).json({
            status: true,
            message: "Topic deleted successfully"
        });

    } catch (error: any) {
        return res.status(500).json({
            status: false,
            message: error.message || "Internal server error"
        });
    }
}

export const updateTopic = async (req: Request, res: Response) => {
    try {
        const topicId = req.params.topicId as string;

        const {
            categoryId,
            subcategoryId,
            topicName,
            description,
            questions,
        } = req.body;

        const updatedTopic = await Topic.findByIdAndUpdate(
            topicId,
            {
                category: categoryId,
                subcategory: subcategoryId,
                topicName,
                description,
            },
            { new: true }
        );

        if (!updatedTopic) {
            return res.status(404).json({
                message: "Topic not found",
            });
        }

        if (questions && questions.length > 0) {
            await Questions.deleteMany({ topic: topicId });

            const questionsData = questions.map((q: TopicQuestionsI) => ({
                ...q,
                topic: topicId,
            }));

            await Questions.insertMany(questionsData);
        }

        res.json({
            success: true,
            message: "Topic updated",
            data: updatedTopic,
        });

    } catch (error) {
        res.status(400).json({
            message: "Something went wrong",
            error,
        });
    }
};