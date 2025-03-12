import { useState, useEffect } from "react";
import { ProgressData } from "../../types/flashcard.types";
import { computeProgress } from "../../services/mockApi";

const ProgressDisplay: React.FC = () => {
  const [progressData, setProgressData] = useState<ProgressData | null>(null);
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
