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
