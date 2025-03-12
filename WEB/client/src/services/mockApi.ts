import {
  FlashcardType,
  Difficulty,
  ProgressData,
  BucketType,
} from "../types/flashcard.types";
import { v4 as uuidv4 } from "uuid";

// Mock data
const buckets: BucketType[] = [
  { id: 0, name: "Learning", reviewInterval: 0 },
  { id: 1, name: "Review 1 day", reviewInterval: 1 },
  { id: 2, name: "Review 3 days", reviewInterval: 3 },
  { id: 3, name: "Review 7 days", reviewInterval: 7 },
  { id: 4, name: "Review 14 days", reviewInterval: 14 },
  { id: 5, name: "Review 30 days", reviewInterval: 30 },
  { id: 6, name: "Mastered", reviewInterval: 60 },
];

let flashcards: FlashcardType[] = [
  {
    id: "1",
    front: "What is the capital of France?",
    back: "Paris",
    bucketId: 1,
    lastPracticed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
  },
  {
    id: "2",
    front: "What is 2 + 2?",
    back: "4",
    bucketId: 3,
    lastPracticed: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
  },
  {
    id: "3",
    front: "Who wrote Romeo and Juliet?",
    back: "William Shakespeare",
    bucketId: 0,
    lastPracticed: undefined,
  },
  {
    id: "4",
    front: "What is the chemical symbol for water?",
    back: "H₂O",
    bucketId: 2,
    lastPracticed: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
  },
  {
    id: "5",
    front: "What is the capital of Japan?",
    back: "Tokyo",
    bucketId: 6,
    lastPracticed: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
  },
];

// Mock API functions
export function toBucketSets(): Record<number, FlashcardType[]> {
  const bucketSets: Record<number, FlashcardType[]> = {};

  buckets.forEach((bucket) => {
    bucketSets[bucket.id] = flashcards.filter(
      (card) => card.bucketId === bucket.id
    );
  });

  return bucketSets;
}

export function getBucketRange(): BucketType[] {
  return [...buckets];
}

// Return cards due for practice based on their bucket interval
export function practice(): Promise<FlashcardType[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const now = new Date();
      const dueCards = flashcards.filter((card) => {
        const bucket = buckets.find((b) => b.id === card.bucketId);
        if (!bucket) return false;
        if (!card.lastPracticed) return true; // New cards are always due

        const dueDate = new Date(card.lastPracticed);
        dueDate.setDate(dueDate.getDate() + bucket.reviewInterval);
        return now >= dueDate;
      });

      resolve(dueCards.slice(0, 10)); // Limit to 10 cards per session
    }, 500); // Simulate network delay
  });
}

// Update a card's bucket based on difficulty rating
export function update(
  cardId: string,
  difficulty: Difficulty
): Promise<FlashcardType> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const cardIndex = flashcards.findIndex((card) => card.id === cardId);
      if (cardIndex === -1) {
        reject(new Error("Card not found"));
        return;
      }

      const card = flashcards[cardIndex];
      let newBucketId: number;

      switch (difficulty) {
        case "easy":
          // Move up a bucket, max is bucket 6
          newBucketId = Math.min(6, card.bucketId + 1);
          break;
        case "hard":
          // Stay in same bucket but reset last practiced date
          newBucketId = card.bucketId;
          break;
        case "wrong":
          // Move back to bucket 0 (learning)
          newBucketId = 0;
          break;
        default:
          reject(new Error("Invalid difficulty rating"));
          return;
      }

      const updatedCard: FlashcardType = {
        ...card,
        bucketId: newBucketId,
        lastPracticed: new Date(),
      };

      flashcards[cardIndex] = updatedCard;
      resolve(updatedCard);
    }, 500);
  });
}

// Provide a hint for a card (not implemented in detail)
export function getHint(cardId: string): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        "This is a hint for the card - " +
          cardId +
          ". In a real app, this would be specific to the card."
      );
    }, 500);
  });
}

// Compute learning progress statistics
export function computeProgress(): Promise<ProgressData> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const now = new Date();
      const dueForReview = flashcards.filter((card) => {
        const bucket = buckets.find((b) => b.id === card.bucketId);
        if (!bucket) return false;
        if (!card.lastPracticed) return true;

        const dueDate = new Date(card.lastPracticed);
        dueDate.setDate(dueDate.getDate() + bucket.reviewInterval);
        return now >= dueDate;
      }).length;

      const cardsByBucket = buckets.map((bucket) => {
        const count = flashcards.filter(
          (card) => card.bucketId === bucket.id
        ).length;
        return {
          bucketId: bucket.id,
          bucketName: bucket.name,
          count,
        };
      });

      const masteredCards = flashcards.filter(
        (card) => card.bucketId >= 5
      ).length;
      const masteredPercentage = (masteredCards / flashcards.length) * 100;

      resolve({
        totalCards: flashcards.length,
        cardsByBucket,
        masteredPercentage,
        dueForReview,
      });
    }, 500);
  });
}

// Add a new card
export function addCard(front: string, back: string): Promise<FlashcardType> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newCard: FlashcardType = {
        id: uuidv4(),
        front,
        back,
        bucketId: 0, // Start in the learning bucket
        lastPracticed: undefined,
      };

      flashcards.push(newCard);
      resolve(newCard);
    }, 500);
  });
}
