import assert from "assert";
import { AnswerDifficulty, Flashcard, BucketMap } from "../src/flashcards";
import {
  toBucketSets,
  getBucketRange,
  practice,
  update,
  getHint,
  computeProgress,
} from "../src/algorithm";
import { expect } from "chai";

/*
 * Testing strategy for toBucketSets():
 *
 * TODO: Describe your testing strategy for toBucketSets() here.
 */
describe("toBucketSets()", () => {
  // Helper function to create test flashcards
  const createCard = (front: string): Flashcard => {
    return new Flashcard(front, "back", "hint", []);
  };

  it("should handle empty buckets map", () => {
    const emptyMap = new Map<number, Set<Flashcard>>();
    const result = toBucketSets(emptyMap);
    expect(result).to.be.an("array");
    expect(result.length).to.equal(0);
  });

  it("should convert simple sequential buckets", () => {
    const buckets = new Map<number, Set<Flashcard>>();
    const card0 = createCard("card0");
    const card1 = createCard("card1");

    buckets.set(0, new Set([card0]));
    buckets.set(1, new Set([card1]));

    const result = toBucketSets(buckets);

    expect(result.length).to.equal(2);
    expect(result[0]?.has(card0)).to.be.true;
    expect(result[1]?.has(card1)).to.be.true;
  });

  it("should handle gaps in bucket numbers", () => {
    const buckets = new Map<number, Set<Flashcard>>();
    const card0 = createCard("card0");
    const card2 = createCard("card2");

    buckets.set(0, new Set([card0]));
    buckets.set(2, new Set([card2]));

    const result = toBucketSets(buckets);

    expect(result.length).to.equal(3);
    expect(result[0]?.has(card0)).to.be.true;
    expect(result[1]?.size).to.equal(0);
    expect(result[2]?.has(card2)).to.be.true;
  });
});

/*
 * Testing strategy for getBucketRange():
 *
 * TODO: Describe your testing strategy for getBucketRange() here.
 */
describe("getBucketRange()", () => {
  it("Example test case - replace with your own tests", () => {
    assert.fail(
      "Replace this test case with your own tests based on your testing strategy"
    );
  });
});

/*
 * Testing strategy for practice():
 *
 * TODO: Describe your testing strategy for practice() here.
 */
describe("practice()", () => {
  it("Example test case - replace with your own tests", () => {
    assert.fail(
      "Replace this test case with your own tests based on your testing strategy"
    );
  });
});

/*
 * Testing strategy for update():
 *
 * TODO: Describe your testing strategy for update() here.
 */
describe("update()", () => {
  it("Example test case - replace with your own tests", () => {
    assert.fail(
      "Replace this test case with your own tests based on your testing strategy"
    );
  });
});

/*
 * Testing strategy for getHint():
 *
 * TODO: Describe your testing strategy for getHint() here.
 */
describe("getHint()", () => {
  it("Example test case - replace with your own tests", () => {
    assert.fail(
      "Replace this test case with your own tests based on your testing strategy"
    );
  });
});

/*
 * Testing strategy for computeProgress():
 *
 * TODO: Describe your testing strategy for computeProgress() here.
 */
describe("computeProgress()", () => {
  it("Example test case - replace with your own tests", () => {
    assert.fail(
      "Replace this test case with your own tests based on your testing strategy"
    );
  });
});
