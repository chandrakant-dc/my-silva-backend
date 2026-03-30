import { Router } from "express";
import { createTopic, deleteTopic, getAllTopics, getAllTopicsByCategoryId, getQuestionsByTopicId, getTopicDetailsById, updateTopic } from "../controllers/topic.controller";
import { authMiddleware } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { createTopicSchema } from "../schemas/topic.schema";

const router = Router();

router.post("/", authMiddleware, validate(createTopicSchema), createTopic);
router.put("/:topicId", authMiddleware, updateTopic);
router.delete("/:id", authMiddleware, deleteTopic);
router.get("/", getAllTopics);
router.get("/all", getAllTopicsByCategoryId);
router.get("/details/:topicId", getTopicDetailsById);
router.get("/questions/:topicId", getQuestionsByTopicId);

export default router;