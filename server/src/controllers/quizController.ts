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
      const quizHTML = await this.quizService.getActiveQuiz();
      if (!quizHTML) {
        return res.status(404).json({ message: "No active quizzes found" });
      }

      // Set content type to HTML
      res.setHeader("Content-Type", "text/html");
      return res.send(quizHTML);
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch active quizzes" });
    }
  };

  submitAnswer = async (req: Request, res: Response) => {
    try {
      const { quizId, studentId, answers } = req.body;
      const result = await this.quizService.submitAnswer(
        quizId,
        studentId,
        answers
      );
      res.json(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error?.message });
      }
    }
  };

  getQuizResults = async (req: Request, res: Response) => {
    try {
      const { quizId } = req.params;
      if (!quizId) throw new Error("Quiz ID is required");
      const resultsHTML = await this.quizService.getQuizResults(quizId);

      // Set content type to HTML
      res.setHeader("Content-Type", "text/html");
      res.send(resultsHTML);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch quiz results" });
    }
  };
}
