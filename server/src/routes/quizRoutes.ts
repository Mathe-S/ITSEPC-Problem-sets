import express, { Router } from "express";
import { QuizController } from "../controllers/quizController";

const router: Router = express.Router();
const quizController = new QuizController();

router.post("/create", quizController.createQuiz);
router.get("/active", quizController.getActiveQuiz);
router.post("/submit", quizController.submitAnswer);
router.get("/results/:quizId", quizController.getQuizResults);

export default router;
