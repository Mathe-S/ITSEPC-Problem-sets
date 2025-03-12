import { useState, useEffect } from "react";
import styled from "styled-components";
import Flashcard from "../flashcard/Flashcard";
import FlashcardControls from "../flashcard/FlashcardControls";
import { FlashcardType, Difficulty } from "../../types/flashcard.types";
import { practice, update, getHint } from "../../services/mockApi";

const SessionContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background-color: #e9ecef;
  border-radius: 4px;
  margin-bottom: 24px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ percent: number }>`
  height: 100%;
  width: ${(props) => `${props.percent}%`};
  background-color: #007bff;
  transition: width 0.3s ease;
`;

const SessionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const CountDisplay = styled.p`
  font-size: 1rem;
  color: #6c757d;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 40px;
  font-size: 1.2rem;
  color: #6c757d;
`;

const EmptyStateMessage = styled.div`
  text-align: center;
  padding: 60px 20px;
  font-size: 1.2rem;
  color: #6c757d;
  background-color: #f8f9fa;
  border-radius: 8px;
`;

const HintButton = styled.button`
  background: none;
  border: none;
  color: #007bff;
  text-decoration: underline;
  cursor: pointer;
  margin-top: 16px;

  &:hover {
    color: #0056b3;
  }
`;

const HintText = styled.p`
  margin-top: 12px;
  padding: 12px;
  background-color: #fff3cd;
  border-left: 4px solid #ffc107;
  color: #856404;
  border-radius: 4px;
`;

const PracticeSession: React.FC = () => {
  const [cards, setCards] = useState<FlashcardType[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hint, setHint] = useState<string | null>(null);
  const [sessionCompleted, setSessionCompleted] = useState(false);

  useEffect(() => {
    const fetchCards = async () => {
      setIsLoading(true);
      try {
        const practiceCards = await practice();
        setCards(practiceCards);
      } catch (error) {
        console.error("Failed to fetch practice cards:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCards();
  }, []);

  const handleFlip = () => {
    setShowAnswer(!showAnswer);
  };

  const handleShowHint = async () => {
    if (cards.length === 0) return;

    try {
      const hintText = await getHint(cards[currentCardIndex].id);
      setHint(hintText);
    } catch (error) {
      console.error("Failed to get hint:", error);
    }
  };

  const handleDifficultySelected = async (difficulty: Difficulty) => {
    if (cards.length === 0) return;

    const currentCard = cards[currentCardIndex];

    try {
      await update(currentCard.id, difficulty);
      setHint(null); // Clear hint

      if (currentCardIndex < cards.length - 1) {
        setCurrentCardIndex(currentCardIndex + 1);
        setShowAnswer(false);
      } else {
        setSessionCompleted(true);
      }
    } catch (error) {
      console.error("Failed to update card:", error);
    }
  };

  const startNewSession = async () => {
    setIsLoading(true);
    setSessionCompleted(false);
    setCurrentCardIndex(0);
    setShowAnswer(false);
    setHint(null);

    try {
      const practiceCards = await practice();
      setCards(practiceCards);
    } catch (error) {
      console.error("Failed to fetch practice cards:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingMessage>Loading practice session...</LoadingMessage>;
  }

  if (cards.length === 0) {
    return (
      <EmptyStateMessage>
        <p>No cards to practice right now!</p>
        <p>
          Add some cards or check back later after your review intervals have
          passed.
        </p>
      </EmptyStateMessage>
    );
  }

  if (sessionCompleted) {
    return (
      <SessionContainer>
        <h2>Practice Session Completed!</h2>
        <p>You've completed all {cards.length} cards in this session.</p>
        <button onClick={startNewSession}>Start New Session</button>
      </SessionContainer>
    );
  }

  const currentCard = cards[currentCardIndex];
  const progressPercent = (currentCardIndex / cards.length) * 100;

  return (
    <SessionContainer>
      <SessionHeader>
        <CountDisplay>
          Card {currentCardIndex + 1} of {cards.length}
        </CountDisplay>
      </SessionHeader>

      <ProgressBar>
        <ProgressFill percent={progressPercent} />
      </ProgressBar>

      <Flashcard
        card={currentCard}
        showAnswer={showAnswer}
        onFlip={handleFlip}
      />

      {!showAnswer && (
        <HintButton onClick={handleShowHint}>Need a hint?</HintButton>
      )}

      {hint && <HintText>{hint}</HintText>}

      <FlashcardControls
        onDifficultySelected={handleDifficultySelected}
        answerRevealed={showAnswer}
      />
    </SessionContainer>
  );
};

export default PracticeSession;
