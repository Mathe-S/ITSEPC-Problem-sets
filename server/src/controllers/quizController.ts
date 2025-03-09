import { Request, Response } from "express";
import { QuizService } from "../services/quizService";
import { UID } from "../utils/localUID";

export class QuizController {
  private quizService: QuizService;

  constructor() {
    this.quizService = new QuizService();
  }

  createQuiz = async (req: Request, res: Response) => {
    try {
      const { question, options, correctAnswers, duration } = req.body;

      const isMultipleChoice = correctAnswers.length > 1;
      const quiz = await this.quizService.createQuiz({
        id: UID(),
        question,
        options,
        correctAnswers,
        isMultipleChoice,
        duration, // in minutes
        createdAt: new Date(),
        status: "active",
        submissions: [],
      });

      res.json({
        message: "Quiz created successfully",
        quiz,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to create quiz" });
    }
  };

  getActiveQuiz = async (req: Request, res: Response) => {
    try {
      const activeQuizzes = await this.quizService.getActiveQuiz();
      if (activeQuizzes.length === 0) {
        return res.status(404).json({ message: "No active quizzes found" });
      }
      return res.json({
        message: "Active quizzes retrieved successfully",
        quizzes: activeQuizzes,
      });
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch active quizzes" });
    }
  };

  submitAnswer = async (req: Request, res: Response) => {
    try {
      const { quizId, studentId, answer } = req.body;
      const result = await this.quizService.submitAnswer(
        quizId,
        studentId,
        answer
      );
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to submit answer" });
    }
  };

  getQuizResults = async (req: Request, res: Response) => {
    try {
      const { quizId } = req.params;
      if (!quizId) throw new Error("Quiz ID is required");
      const results = await this.quizService.getQuizResults(quizId);
      res.json(results);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch quiz results" });
    }
  };
}
