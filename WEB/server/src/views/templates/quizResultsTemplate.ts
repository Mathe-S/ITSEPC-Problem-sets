import { Quiz } from "../../models/Quiz";

export interface QuizResultsInterface {
  quiz: Quiz;
  averageScore: number;
  scoreRanges: {
    perfect: number;
    good: number;
    fair: number;
    poor: number;
  };
  answerDistribution: Record<string, number>;
  totalSubmissions: number;
}

export const generateQuizResultsHTML = ({
  quiz,
  averageScore,
  scoreRanges,
  answerDistribution,
  totalSubmissions,
}: QuizResultsInterface): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Quiz Results - ${quiz.question}</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          max-width: 900px; /* Slightly wider for better readability */
          margin: 20px auto; /* Add some margin around the body */
          padding: 20px;
          color: #333; /* Darker text for better readability */
          background-color: #f9f9f9; /* Lighter background */
          border: 1px solid #eee; /* Subtle border around the body */
          border-radius: 8px;
        }
        .card {
          background: #fff;
          border-radius: 12px; /* More rounded corners */
          box-shadow: 0 4px 8px rgba(0,0,0,0.05); /* Softer shadow */
          padding: 25px; /* Slightly more padding */
          margin-bottom: 25px; /* More margin between cards */
          border: 1px solid #eee; /* Add a border to cards */
        }
        h1, h2, h3 {
          color: #2c3e50; /* Primary heading color */
          margin-top: 0;
          margin-bottom: 15px;
        }
        h1 {
          font-size: 2.5em;
        }
        h2 {
          font-size: 1.8em;
        }
        h3 {
          font-size: 1.4em;
        }
        p {
          color: #555; /* Slightly darker paragraph text */
          line-height: 1.6;
          margin-bottom: 10px;
        }
        .stat-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); /* Slightly wider stat boxes */
          gap: 25px; /* More gap in stat grid */
          margin: 25px 0;
        }
        .stat-box {
          background: #f0f4f7; /* Lighter stat box background */
          padding: 20px; /* More padding in stat boxes */
          border-radius: 10px;
          text-align: center;
          border: 1px solid #e0e0e0; /* Border for stat boxes */
        }
        .stat-number {
          font-size: 2.8em; /* Larger stat numbers */
          font-weight: bold;
          color: #3498db; /* Vibrant stat number color */
          margin-bottom: 8px; /* Space below number */
        }
        .stat-label {
          color: #777; /* Slightly darker label color */
          font-size: 1.1em;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 25px;
          border-radius: 8px;
          overflow: hidden; /* For rounded corners on table */
          box-shadow: 0 2px 4px rgba(0,0,0,0.03); /* Subtle table shadow */
        }
        th, td {
          padding: 15px; /* More padding in table cells */
          text-align: left;
        }
        th {
          background-color: #f2f2f2; /* Lighter header background */
          font-weight: bold;
          color: #555;
          text-align: center; /* Center header text */
        }
        tbody tr:nth-child(even) {
          background-color: #f9f9f9; /* Very light grey for even rows */
        }
        tbody tr:hover {
          background-color: #f5f5f5; /* Slightly darker on hover */
        }
        td {
          border-bottom: 1px solid #eee; /* Lighter row separator */
        }
        .progress-bar {
          background: #e0e0e0; /* Lighter progress bar background */
          height: 22px; /* Slightly taller progress bar */
          border-radius: 12px; /* More rounded progress bar */
          overflow: hidden;
          margin-bottom: 12px;
        }
        .progress-fill {
          height: 100%;
          background: #5cb85c; /* Green progress fill for positive connotation */
          transition: width 0.4s ease; /* Slightly slower transition */
          border-radius: 12px; /* Match progress bar border-radius */
          text-align: right; /* Align percentage text to the right */
          padding-right: 10px; /* Padding for percentage text */
          color: white; /* White text for percentage */
          font-size: 0.9em;
          line-height: 22px; /* Vertically center percentage text */
        }
        .answer-label {
            margin-bottom: 8px;
            font-weight: bold;
            color: #444;
        }
        .answer-percentage {
            color: #777;
            font-size: 0.9em;
        }
        .answer-item {
            margin-bottom: 20px; /* More space between answer items */
        }
      </style>
    </head>
    <body>
      <div class="card">
        <h1>Quiz Results</h1>
        <h2>${quiz.question}</h2>
        <p>Type: ${
          quiz.isMultipleChoice ? "Multiple Choice" : "Single Choice"
        }</p>
        <p>Status: ${quiz.status}</p>
      </div>

      <div class="card">
        <h2>Summary Statistics</h2>
        <div class="stat-grid">
          <div class="stat-box">
            <div class="stat-number">${totalSubmissions}</div>
            <div class="stat-label">Total Submissions</div>
          </div>
          <div class="stat-box">
            <div class="stat-number">${averageScore.toFixed(1)}%</div>
            <div class="stat-label">Average Score</div>
          </div>
          <div class="stat-box">
            <div class="stat-number">${scoreRanges.perfect}</div>
            <div class="stat-label">Perfect Scores</div>
          </div>
        </div>

        <h3>Score Distribution</h3>
        <div class="stat-grid">
          <div class="stat-box">
            <div class="stat-number">${scoreRanges.perfect}</div>
            <div class="stat-label">Perfect (100%)</div>
          </div>
          <div class="stat-box">
            <div class="stat-number">${scoreRanges.good}</div>
            <div class="stat-label">Good (75-99%)</div>
          </div>
          <div class="stat-box">
            <div class="stat-number">${scoreRanges.fair}</div>
            <div class="stat-label">Fair (50-74%)</div>
          </div>
          <div class="stat-box">
            <div class="stat-number">${scoreRanges.poor}</div>
            <div class="stat-label">Poor (<50%)</div>
          </div>
        </div>

        <h3>Answer Distribution</h3>
        ${Object.entries(answerDistribution)
          .map(
            ([answer, count]) => `
          <div class="answer-item">
            <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 8px;">
              <span class="answer-label">${answer}</span>
              <span class="answer-percentage">${count} responses (${(
              (count / totalSubmissions) *
              100
            ).toFixed(1)}%)</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${
                (count / totalSubmissions) * 100
              }%">
                 ${((count / totalSubmissions) * 100).toFixed(1)}%
              </div>
            </div>
          </div>
        `
          )
          .join("")}
      </div>

      <div class="card">
        <h2>Individual Submissions</h2>
        <table>
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Score</th>
              <th>Answers</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            ${quiz.submissions
              .map(
                (sub) => `
              <tr>
                <td>${sub.studentId}</td>
                <td>${sub.score}%</td>
                <td>${sub.answers.join(", ")}</td>
                <td>${new Date(sub.timestamp).toLocaleString()}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      </div>
    </body>
    </html>
  `;
};
