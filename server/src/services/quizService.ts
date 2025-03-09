import { Quiz, QuizModel, QuizSubmission } from "../models/Quiz";
import fs from "fs";

export class QuizService {
  private quizModel: QuizModel;

  constructor() {
    this.quizModel = new QuizModel();
  }

  // Complex business logic
  async createQuiz(quizData: Quiz): Promise<Quiz> {
    // Validate input
    if (
      !quizData.question ||
      !quizData.options ||
      !quizData.correctAnswers?.length
    ) {
      throw new Error("Missing required quiz fields");
    }

    // Business logic: ensure correct answer is in options
    const invalidAnswers = quizData.correctAnswers.filter(
      (answer) => !quizData.options.includes(answer)
    );
    if (invalidAnswers.length > 0) {
      throw new Error(`Invalid correct answers: ${invalidAnswers.join(", ")}`);
    }

    // Create quiz with defaults
    const quiz: Quiz = {
      ...quizData,
      id: Date.now().toString(),
      status: "active",
      createdAt: new Date(),
      submissions: [],
    };

    // Save using model
    return await this.quizModel.save(quiz);
  }

  async getActiveQuiz(): Promise<Quiz[]> {
    // Changed return type to array
    try {
      // Get all files from quiz directory
      const files = await fs.promises.readdir(this.quizModel.QUIZ_DIR);
      const activeQuizzes: Quiz[] = [];

      // Find all active quizzes
      for (const file of files) {
        const quiz = await this.quizModel.findById(file.replace(".json", ""));
        if (quiz && quiz.status === "active") {
          // Remove correctAnswers when sending to students
          const { correctAnswers, ...quizWithoutAnswer } = quiz;
          activeQuizzes.push(quizWithoutAnswer as Quiz);
        }
      }

      return activeQuizzes; // Return array of active quizzes
    } catch (error) {
      throw new Error("Failed to fetch active quizzes");
    }
  }

  async submitAnswer(quizId: string, studentId: string, answers: string[]) {
    const quiz = await this.quizModel.findById(quizId);
    if (!quiz) throw new Error("Quiz not found");

    if (quiz.status !== "active") {
      throw new Error("Quiz is no longer active");
    }

    if (quiz.submissions.some((sub) => sub.studentId === studentId)) {
      throw new Error("Student already submitted an answer");
    }

    // Validate answer format based on quiz type
    if (!quiz.isMultipleChoice && answers.length !== 1) {
      throw new Error("Single choice questions require exactly one answer");
    }

    // Calculate score
    let score = 0;
    let isCorrect = false;

    if (quiz.isMultipleChoice) {
      // For multiple choice: partial scoring
      const correctAnswersSet = new Set(quiz.correctAnswers);
      const submittedAnswersSet = new Set(answers);

      // Calculate correct selections
      const correctSelections = answers.filter((a) => correctAnswersSet.has(a));
      // Calculate incorrect selections
      const incorrectSelections = answers.filter(
        (a) => !correctAnswersSet.has(a)
      );

      // Calculate score (correct selections minus incorrect selections)
      const totalPossibleScore = quiz.correctAnswers.length;
      score =
        Math.max(
          0,
          correctSelections.length / totalPossibleScore -
            incorrectSelections.length / totalPossibleScore
        ) * 100;

      // Consider correct if score is above 50%
      isCorrect = score >= 50;
    } else {
      // For single choice: all or nothing
      isCorrect = quiz.correctAnswers[0] === answers[0];
      score = isCorrect ? 100 : 0;
    }

    const submission: QuizSubmission = {
      studentId,
      answers,
      timestamp: new Date(),
      isCorrect,
      score,
    };

    quiz.submissions.push(submission);
    await this.quizModel.save(quiz);

    return {
      submission,
      feedback: {
        correct: quiz.correctAnswers,
        score,
        isCorrect,
      },
    };
  }

  async getQuizResults(quizId: string) {
    const quiz = await this.quizModel.findById(quizId);
    if (!quiz) throw new Error("Quiz not found");

    const totalSubmissions = quiz.submissions.length;
    const averageScore =
      quiz.submissions.reduce((acc, sub) => acc + sub.score, 0) /
      totalSubmissions;

    // Group submissions by answer
    const answerDistribution = quiz.submissions.reduce((acc, sub) => {
      sub.answers.forEach((answer) => {
        acc[answer] = (acc[answer] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

    return {
      quizId: quiz.id,
      question: quiz.question,
      status: quiz.status,
      isMultipleChoice: quiz.isMultipleChoice,
      correctAnswers: quiz.correctAnswers,
      statistics: {
        totalSubmissions,
        averageScore: averageScore.toFixed(2) + "%",
        answerDistribution,
        scoreRanges: {
          perfect: quiz.submissions.filter((s) => s.score === 100).length,
          good: quiz.submissions.filter((s) => s.score >= 75 && s.score < 100)
            .length,
          fair: quiz.submissions.filter((s) => s.score >= 50 && s.score < 75)
            .length,
          poor: quiz.submissions.filter((s) => s.score < 50).length,
        },
      },
      submissions: quiz.submissions.map((sub) => ({
        studentId: sub.studentId,
        answers: sub.answers,
        score: sub.score,
        timestamp: sub.timestamp,
      })),
    };
  }
}
