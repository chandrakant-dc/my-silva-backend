import { Router } from "express";
import { createTopic, deleteTopic, getAllTopics, getAllTopicsByCategoryId, getQuestionsByTopicId, getTopicDetailsById, topicTestQuizSubmit, updateTopic } from "../controllers/topic.controller.js";
import { authMiddleware } from "../middleware/auth.js";
import { optionalAuth } from "../middleware/optionalAuth.js";
import { validate } from "../middleware/validate.js";
import { createTopicSchema } from "../schemas/topic.schema.js";

const router = Router();

router.post("/", authMiddleware, validate(createTopicSchema), createTopic);
router.put("/:topicId", authMiddleware, updateTopic);
router.delete("/:id", authMiddleware, deleteTopic);
router.get("/", getAllTopics);
router.get("/all", optionalAuth, getAllTopicsByCategoryId);
router.get("/details/:topicId", getTopicDetailsById);
router.get("/questions/:topicId", getQuestionsByTopicId);
router.post("/quiz-submit", optionalAuth, topicTestQuizSubmit);

export default router;