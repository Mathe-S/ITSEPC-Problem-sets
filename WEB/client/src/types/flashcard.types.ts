export interface FlashcardType {
  id: string;
  front: string;
  back: string;
  bucketId: number;
  lastPracticed?: Date;
}

export interface BucketType {
  id: number;
  name: string;
  reviewInterval: number; // in days
}

export type Difficulty = "easy" | "hard" | "wrong";

export interface PracticeSessionCard extends FlashcardType {
  showAnswer: boolean;
}

export interface ProgressData {
  totalCards: number;
  cardsByBucket: {
    bucketId: number;
    bucketName: string;
    count: number;
  }[];
  masteredPercentage: number;
  dueForReview: number;
}
