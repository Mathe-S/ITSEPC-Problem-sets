import React from "react";
import styled from "styled-components";
import { Difficulty } from "../../types/flashcard.types";

interface FlashcardControlsProps {
  onDifficultySelected: (difficulty: Difficulty) => void;
  answerRevealed: boolean;
  disabled?: boolean;
}

const ControlsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 24px;
`;

const DifficultyButton = styled.button<{ difficultyType: Difficulty }>`
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  background-color: ${(props) => {
    switch (props.difficultyType) {
      case "easy":
        return "#28a745";
      case "hard":
        return "#ffc107";
      case "wrong":
        return "#dc3545";
      default:
        return "#6c757d";
    }
  }};

  color: ${(props) => (props.difficultyType === "hard" ? "#212529" : "white")};

  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
  }

  &:disabled {
    background-color: #e9ecef;
    color: #6c757d;
    cursor: not-allowed;
    transform: none;
  }
`;

const FlashcardControls: React.FC<FlashcardControlsProps> = ({
  onDifficultySelected,
  answerRevealed,
  disabled = false,
}) => {
  return (
    <ControlsContainer>
      <DifficultyButton
        difficultyType="easy"
        onClick={() => onDifficultySelected("easy")}
        disabled={!answerRevealed || disabled}
      >
        Easy
      </DifficultyButton>
      <DifficultyButton
        difficultyType="hard"
        onClick={() => onDifficultySelected("hard")}
        disabled={!answerRevealed || disabled}
      >
        Hard
      </DifficultyButton>
      <DifficultyButton
        difficultyType="wrong"
        onClick={() => onDifficultySelected("wrong")}
        disabled={!answerRevealed || disabled}
      >
        Wrong
      </DifficultyButton>
    </ControlsContainer>
  );
};

export default FlashcardControls;
