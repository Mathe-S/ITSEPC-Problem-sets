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
