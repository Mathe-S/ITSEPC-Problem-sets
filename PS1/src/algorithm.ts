/**
 * Problem Set 1: Flashcards - Algorithm Functions
 *
 * This file contains the implementations for the flashcard algorithm functions
 * as described in the problem set handout.
 *
 * Please DO NOT modify the signatures of the exported functions in this file,
 * or you risk failing the autograder.
 */

import { Flashcard, AnswerDifficulty, BucketMap } from "./flashcards";

/**
 * Converts a Map representation of learning buckets into an Array-of-Set representation.
 *
 * @param buckets Map where keys are bucket numbers and values are sets of Flashcards.
 * @returns Array of Sets, where element at index i is the set of flashcards in bucket i.
 *          Buckets with no cards will have empty sets in the array.
 * @spec.requires buckets is a valid representation of flashcard buckets.
 */
export function toBucketSets(buckets: BucketMap): Array<Set<Flashcard>> {
  // If map is empty, return empty array
  if (buckets.size === 0) {
    return [];
  }

  // Find the highest bucket number to determine array size
  const maxBucket = Math.max(...buckets.keys());

  // Create array with (maxBucket + 1) empty sets
  const result = Array.from(
    { length: maxBucket + 1 },
    () => new Set<Flashcard>()
  );

  // Copy each bucket's flashcards to corresponding array index
  for (const [bucketNumber, flashcards] of buckets) {
    result[bucketNumber] = new Set(flashcards);
  }

  return result;
}

/**
 * Finds the range of buckets that contain flashcards, as a rough measure of progress.
 *
 * @param buckets Array-of-Set representation of buckets.
 * @returns object with minBucket and maxBucket properties representing the range,
 *          or undefined if no buckets contain cards.
 * @spec.requires buckets is a valid Array-of-Set representation of flashcard buckets.
 */
export function getBucketRange(
  buckets: Array<Set<Flashcard>>
): { minBucket: number; maxBucket: number } | undefined {
  // Handle empty array case
  if (buckets.length === 0) {
    return undefined;
  }

  let minBucket = -1;
  let maxBucket = -1;

  // Find first non-empty bucket
  for (let i = 0; i < buckets.length; i++) {
    const bucket = buckets[i];
    if (bucket && bucket.size > 0) {
      minBucket = i;
      break;
    }
  }

  // If no non-empty buckets found, return undefined
  if (minBucket === -1) {
    return undefined;
  }

  // Find last non-empty bucket
  for (let i = buckets.length - 1; i >= 0; i--) {
    const bucket = buckets[i];
    if (bucket && bucket.size > 0) {
      maxBucket = i;
      break;
    }
  }

  return { minBucket, maxBucket };
}

/**
 * Selects cards to practice on a particular day.
 *
 * @param buckets Array-of-Set representation of buckets.
 * @param day current day number (starting from 0).
 * @returns a Set of Flashcards that should be practiced on day `day`,
 *          according to the Modified-Leitner algorithm.
 * @spec.requires buckets is a valid Array-of-Set representation of flashcard buckets.
 */
export function practice(
  buckets: Array<Set<Flashcard>>,
  day: number
): Set<Flashcard> {
  if (buckets.length === 0) return new Set();

  const leitnerNumbers = [2 ** 0, 2 ** 1, 2 ** 2, 2 ** 3, 2 ** 4, 2 ** 5];
  const setOfFlashcards: Set<Flashcard> = new Set();

  for (let i = 0; i < leitnerNumbers.length; i++) {
    const leitnerNumber = leitnerNumbers[i] as number;
    if ((day + 1) % leitnerNumber === 0 && buckets[i]) {
      for (let flashcard of buckets[i]!) {
        setOfFlashcards.add(flashcard);
      }
    }
  }

  return setOfFlashcards;
}

/**
 * Updates a card's bucket number after a practice trial.
 *
 * @param buckets Map representation of learning buckets.
 * @param card flashcard that was practiced.
 * @param difficulty how well the user did on the card in this practice trial.
 * @returns updated Map of learning buckets.
 * @spec.requires buckets is a valid representation of flashcard buckets.
 */
export function update(
  buckets: BucketMap,
  card: Flashcard,
  difficulty: AnswerDifficulty
): BucketMap {
  const updatedBuckets = new Map(buckets); // Create a copy of the buckets to avoid mutating the original

  // Find the current bucket of the card
  for (const [bucketNumber, flashcards] of updatedBuckets) {
    if (flashcards.has(card)) {
      flashcards.delete(card); // Remove the card from the current bucket

      // Determine the new bucket based on difficulty
      if (difficulty === AnswerDifficulty.Wrong) {
        // Stay in bucket 0
        updatedBuckets.get(0)?.add(card);
      } else if (difficulty === AnswerDifficulty.Hard) {
        // Move down one bucket if not in bucket 0
        if (bucketNumber > 0) {
          if (!updatedBuckets.has(bucketNumber - 1)) {
            updatedBuckets.set(bucketNumber - 1, new Set<Flashcard>());
          }
          updatedBuckets.get(bucketNumber - 1)?.add(card);
        } else {
          if (!updatedBuckets.has(0)) {
            updatedBuckets.set(0, new Set<Flashcard>());
          }
          updatedBuckets.get(0)?.add(card); // Stay in bucket 0
        }
      } else if (difficulty === AnswerDifficulty.Easy) {
        // Move up one bucket if not in the retired bucket
        if (bucketNumber < 5) {
          if (!updatedBuckets.has(bucketNumber + 1)) {
            updatedBuckets.set(bucketNumber + 1, new Set<Flashcard>());
          }
          updatedBuckets.get(bucketNumber + 1)?.add(card);
        } else {
          updatedBuckets.get(5)?.add(card);
        }
      }
      break; // Exit the loop once the card is found and updated
    }
  }

  return updatedBuckets;
}

/**
 * Generates a hint for a flashcard.
 *
 * @param card - The flashcard for which to generate a hint.
 * @returns A hint for the front of the flashcard, or a helpful message if no hint is available.
 *
 * @spec.requires card is a valid Flashcard instance.
 * @spec.ensures If the card has a non-empty hint, return the hint.
 * @spec.ensures If the card's hint is empty, return a message indicating that the hint is not available.
 * @spec.ensures If the card is not a valid Flashcard, throw an error with a descriptive message.
 *
 * This function is designed to assist users in recalling information related to the flashcard.
 * It can be extended to other learning domains, such as providing hints for math problems,
 * historical facts, or scientific concepts, by adapting the hint generation logic.
 */
export function getHint(card: Flashcard): string {
  // Check if the input is a valid Flashcard
  if (!(card instanceof Flashcard)) {
    throw new Error("Invalid flashcard.");
  }

  // Return the hint or a default message if the hint is empty
  return card.hint.length > 0 ? card.hint : "No hint available.";
}

/**
 * Computes statistics about the user's learning progress based on flashcard buckets and answer history.
 *
 * @param buckets - A representation of the current state of flashcard buckets, where each bucket contains a set of Flashcards.
 * @param history - A representation of the user's answer history, which includes information about each flashcard practiced,
 *                  the difficulty level of the answer, and the date of practice.
 *
 * @returns An object containing various statistics about the user's learning progress, including:
 *          - totalCards: Total number of flashcards practiced.
 *          - correctAnswers: Total number of correct answers.
 *          - incorrectAnswers: Total number of incorrect answers.
 *          - accuracy: The percentage of correct answers out of total answers (0-100%).
 *          - progressByBucket: An object mapping each bucket number to the number of cards practiced from that bucket.
 *
 * @spec.requires buckets is a valid representation of flashcard buckets.
 * @spec.requires history is a valid representation of the user's answer history, where each entry includes:
 *          - card: The Flashcard that was practiced.
 *          - difficulty: The AnswerDifficulty indicating how well the user performed (Wrong, Hard, Easy).
 *          - date: The date when the flashcard was practiced.
 *
 * @spec.ensures If the input is valid, the function returns an object with the specified statistics.
 * @spec.ensures If the input is invalid, the function throws an error with a descriptive message.
 *
 * This function is designed to help users understand their learning progress and identify areas for improvement.
 * It can be extended to include additional statistics or metrics as needed.
 */
export function computeProgress(buckets: BucketMap, history: any[]): any {
  // Validate input types
  if (!(buckets instanceof Map)) {
    throw new Error("Invalid buckets.");
  }
  if (!Array.isArray(history)) {
    throw new Error("Invalid history.");
  }

  let totalCards = 0;
  let correctAnswers = 0;
  let incorrectAnswers = 0;
  const progressByBucket: { [key: number]: number } = {};
  // Initialize progressByBucket
  for (const bucketNumber of buckets.keys()) {
    progressByBucket[bucketNumber] = 0;
  }

  // Process the history to calculate statistics
  for (const entry of history) {
    const { card, difficulty } = entry;

    // Validate history entry
    if (
      !(card instanceof Flashcard) ||
      !Object.values(AnswerDifficulty).includes(difficulty)
    ) {
      throw new Error("Invalid history entry.");
    }

    totalCards++;
    progressByBucket[
      Array.from(buckets.keys()).find((key) => buckets.get(key)?.has(card)) || 0
    ]!++;

    if (difficulty === AnswerDifficulty.Easy) {
      correctAnswers++;
    } else if (difficulty === AnswerDifficulty.Wrong) {
      incorrectAnswers++;
    }
  }

  // Calculate accuracy
  const accuracy = totalCards > 0 ? (correctAnswers / totalCards) * 100 : 0;

  return {
    totalCards,
    correctAnswers,
    incorrectAnswers,
    accuracy: parseFloat(accuracy.toFixed(2)),
    progressByBucket,
  };
}
