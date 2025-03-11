import path from "path";
import fs from "fs";

export interface Quiz {
  id: string;
  question: string;
  options: string[];
  correctAnswers: string[];
  isMultipleChoice: boolean;
  duration: number;
  createdAt: Date;
  status: "active" | "completed";
  submissions: QuizSubmission[];
}

export interface QuizSubmission {
  studentId: string;
  answers: string[];
  timestamp: Date;
  isCorrect: boolean;
  score: number;
}

export class QuizModel {
  public readonly QUIZ_DIR = path.join(__dirname, "../../../quizzes");

  constructor() {
    if (!fs.existsSync(this.QUIZ_DIR)) {
      fs.mkdirSync(this.QUIZ_DIR, { recursive: true });
    }
  }

  // Basic CRUD operations
  async save(quiz: Quiz): Promise<Quiz> {
    await fs.promises.writeFile(
      path.join(this.QUIZ_DIR, `${quiz.id}.json`),
      JSON.stringify(quiz, null, 2)
    );
    return quiz;
  }

  async findById(id: string): Promise<Quiz | null> {
    try {
      const quiz = await fs.promises.readFile(
        path.join(this.QUIZ_DIR, `${id}.json`),
        "utf8"
      );
      return JSON.parse(quiz);
    } catch {
      return null;
    }
  }
}
