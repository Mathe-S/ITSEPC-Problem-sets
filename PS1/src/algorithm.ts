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
          updatedBuckets.get(bucketNumber - 1)?.add(card);
        } else {
          updatedBuckets.get(0)?.add(card); // Stay in bucket 0
        }
      } else if (difficulty === AnswerDifficulty.Easy) {
        // Move up one bucket if not in the retired bucket
        if (bucketNumber < 5) {
          updatedBuckets.get(bucketNumber + 1)?.add(card);
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
 * @param card flashcard to hint
 * @returns a hint for the front of the flashcard.
 * @spec.requires card is a valid Flashcard.
 */
export function getHint(card: Flashcard): string {
  return card.hint;
}

/**
 * Computes statistics about the user's learning progress.
 *
 * @param buckets representation of learning buckets.
 * @param history representation of user's answer history.
 * @returns statistics about learning progress.
 * @spec.requires [SPEC TO BE DEFINED]
 */
export function computeProgress(buckets: any, history: any): any {
  // Replace 'any' with appropriate types
  // TODO: Implement this function (and define the spec!)
  throw new Error("Implement me!");
}
