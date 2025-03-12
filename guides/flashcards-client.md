# Flashcards React App Guide

This guide provides a structure and step by step instructions to build the flashcards app.

**Prerequisites**

- To have finished the client-setup.md file

** Project Structure **

```
src/
├── components/
│ ├── common/ # Reusable UI components
│ │ ├── Button.tsx
│ │ ├── Card.tsx
│ │ └── ...
│ ├── flashcard/ # Flashcard specific components
│ │ ├── Flashcard.tsx
│ │ ├── FlashcardControls.tsx
│ │ └── ...
│ ├── practice/ # Practice session components
│ │ ├── PracticeSession.tsx
│ │ └── ...
│ └── progress/ # Progress tracking components
│ ├── ProgressChart.tsx
│ └── ...
├── pages/ # Page components/routes
│ ├── HomePage.tsx
│ ├── PracticePage.tsx
│ ├── DeckManagementPage.tsx
│ └── ...
├── services/ # API and service layer
│ ├── api.ts # Real API integration (future)
│ ├── mockApi.ts # Mock implementation
│ └── ...
├── types/ # TypeScript type definitions
│ ├── flashcard.types.ts
│ └── ...
├── utils/ # Utility functions
├── hooks/ # Custom React hooks
├── contexts/ # React context providers (if needed)
├── App.tsx # Main application component
└── main.tsx # Entry point
```

**1. Core Components (Initial Design)**

First, let's define our core types:

```javascript
// src/types/flashcard.types.ts

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
    bucketId: number,
    bucketName: string,
    count: number,
  }[];
  masteredPercentage: number;
  dueForReview: number;
}
```

now let's create the core flashcard component, which will displays a single flashcard with front/back content and handles flipping between them.

```javascript
// src/components/flashcard/Flashcard.tsx

import { useState } from "react";
import { FlashcardType } from "../../types/flashcard.types";

interface FlashcardProps {
  card: FlashcardType;
  showAnswer?: boolean;
  onFlip?: () => void;
}

const Flashcard: React.FC<FlashcardProps> = ({
  card,
  showAnswer = false,
  onFlip,
}) => {
  const [isFlipped, setIsFlipped] = useState(showAnswer);

  const handleFlip = () => {
    const newFlippedState = !isFlipped;
    setIsFlipped(newFlippedState);
    if (onFlip) onFlip();
  };

  return (
    <div className="flashcard">
      <div className="flashcard-content">
        {isFlipped ? (
          <div className="flashcard-back">{card.back}</div>
        ) : (
          <div className="flashcard-front">{card.front}</div>
        )}
      </div>
      <button onClick={handleFlip}>
        {isFlipped ? "Show Question" : "Show Answer"}
      </button>
    </div>
  );
};

export default Flashcard;
```

now let's create the flashcard controls component, which will handle the logic for flipping the flashcard and updating the bucket.

```javascript
// src/components/flashcard/FlashcardControls.tsx

import React from "react";
import { Difficulty } from "../../types/flashcard.types";

interface FlashcardControlsProps {
  onDifficultySelected: (difficulty: Difficulty) => void;
  answerRevealed: boolean;
  disabled?: boolean;
}

const FlashcardControls: React.FC<FlashcardControlsProps> = ({
  onDifficultySelected,
  answerRevealed,
  disabled = false,
}) => {
  return (
    <div className="flashcard-controls">
      <button
        onClick={() => onDifficultySelected("easy")}
        disabled={!answerRevealed || disabled}
      >
        Easy
      </button>
      <button
        onClick={() => onDifficultySelected("hard")}
        disabled={!answerRevealed || disabled}
      >
        Hard
      </button>
      <button
        onClick={() => onDifficultySelected("wrong")}
        disabled={!answerRevealed || disabled}
      >
        Wrong
      </button>
    </div>
  );
};

export default FlashcardControls;
```

now let's create the practice session component, which will handle the logic for the practice session.

```javascript

import { useState, useEffect } from 'react';
import Flashcard from '../flashcard/Flashcard';
import FlashcardControls from '../flashcard/FlashcardControls';
import { FlashcardType, Difficulty } from '../../types/flashcard.types';
import { practice, update } from '../../services/mockApi';

const PracticeSession: React.FC = () => {
  const [cards, setCards] = useState<FlashcardType[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCards = async () => {
      setIsLoading(true);
      try {
        const practiceCards = await practice();
        setCards(practiceCards);
      } catch (error) {
        console.error('Failed to fetch practice cards:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCards();
  }, []);

  const handleFlip = () => {
    setShowAnswer(!showAnswer);
  };

  const handleDifficultySelected = async (difficulty: Difficulty) => {
    if (cards.length === 0) return;

    const currentCard = cards[currentCardIndex];

    try {
      await update(currentCard.id, difficulty);

      if (currentCardIndex < cards.length - 1) {
        setCurrentCardIndex(currentCardIndex + 1);
        setShowAnswer(false);
      } else {
        // Practice session complete
        // Could navigate to a summary screen or fetch new cards
      }
    } catch (error) {
      console.error('Failed to update card:', error);
    }
  };

  if (isLoading) {
    return <div>Loading practice session...</div>;
  }

  if (cards.length === 0) {
    return <div>No cards to practice right now!</div>;
  }

  const currentCard = cards[currentCardIndex];

  return (
    <div className="practice-session">
      <div className="progress-indicator">
        Card {currentCardIndex + 1} of {cards.length}
      </div>

      <Flashcard
        card={currentCard}
        showAnswer={showAnswer}
        onFlip={handleFlip}
      />

      <FlashcardControls
        onDifficultySelected={handleDifficultySelected}
        answerRevealed={showAnswer}
      />
    </div>
  );
};

export default PracticeSession;
```

now let's create the progress chart component, which will display the progress of the user.

```javascript
// src/components/progress/ProgressChart.tsx

import { useState, useEffect } from "react";
import { ProgressData } from "../../types/flashcard.types";
import { computeProgress } from "../../services/mockApi";

const ProgressDisplay: React.FC = () => {
  const [progressData, setProgressData] =
    (useState < ProgressData) | (null > null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      setIsLoading(true);
      try {
        const data = await computeProgress();
        setProgressData(data);
      } catch (error) {
        console.error("Failed to fetch progress data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProgress();
  }, []);

  if (isLoading) {
    return <div>Loading progress data...</div>;
  }

  if (!progressData) {
    return <div>No progress data available.</div>;
  }

  return (
    <div className="progress-display">
      <h2>Your Learning Progress</h2>

      <div className="progress-stats">
        <div className="stat">
          <h3>Total Cards</h3>
          <p>{progressData.totalCards}</p>
        </div>

        <div className="stat">
          <h3>Mastery Level</h3>
          <p>{progressData.masteredPercentage.toFixed(1)}%</p>
        </div>

        <div className="stat">
          <h3>Due for Review</h3>
          <p>{progressData.dueForReview}</p>
        </div>
      </div>

      <h3>Cards by Bucket</h3>
      <ul className="bucket-list">
        {progressData.cardsByBucket.map((bucket) => (
          <li key={bucket.bucketId}>
            {bucket.bucketName}: {bucket.count} cards
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProgressDisplay;
```

now let's create the DeckManagement Component:

```javascript
// src/components/deck/DeckManagement.tsx

import { useState } from "react";
import { addCard } from "../../services/mockApi";

const DeckManagement: React.FC = () => {
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [message, setMessage] = useState("");

  const handleAddCard = async () => {
    if (!front.trim() || !back.trim()) {
      setMessage("Both question and answer are required.");
      return;
    }

    try {
      await addCard(front, back);
      setFront("");
      setBack("");
      setMessage("Card added successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Failed to add card:", error);
      setMessage("Failed to add card. Please try again.");
    }
  };

  return (
    <div className="deck-management">
      <h2>Add New Flashcard</h2>

      <div className="form-group">
        <label htmlFor="question">Question (Front):</label>
        <textarea
          id="question"
          value={front}
          onChange={(e) => setFront(e.target.value)}
          rows={3}
        />
      </div>

      <div className="form-group">
        <label htmlFor="answer">Answer (Back):</label>
        <textarea
          id="answer"
          value={back}
          onChange={(e) => setBack(e.target.value)}
          rows={3}
        />
      </div>

      <button onClick={handleAddCard}>Add Flashcard</button>

      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default DeckManagement;
```

**2. Mock API Implementation**

now let's create the mockApi.ts file, which will handle the mock API implementation.

```javascript
// src/services/mockApi.ts

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
        "This is a hint for the card. In a real app, this would be specific to the card."
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
```

Aim for:

- Unit tests: 80%+ coverage
- Integration tests: Key user flows covered
- E2E tests: Critical paths (login, core functionality)
