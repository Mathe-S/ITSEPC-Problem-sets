// In QuizService.ts, add this helper function:

import { Quiz } from "../../models/Quiz";

export const generateQuizHTML = (quizzes: Quiz[]): string => {
  return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Active Quizzes</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; /* Modern, clean font */
            background-color: #f4f7f9; /* Light background */
            color: #333;
            margin: 0; /* Reset default margin */
            padding: 20px;
            display: flex;
            justify-content: center; /* Center content horizontally */
          }

          .container {
            max-width: 800px;
            width: 100%; /* Take full width within max-width */
            background-color: #fff; /* White container background */
            padding: 30px;
            border-radius: 12px; /* Rounded corners for container */
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1); /* Soft shadow for depth */
          }

          h1 {
            color: #2c3e50; /* Darker heading color */
            text-align: center;
            margin-bottom: 30px;
          }

          .error-message, .success-message {
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
            text-align: center;
          }

          .error-message {
            background-color: #ffebee; /* Light red */
            color: #e53935; /* Darker red */
            border: 1px solid #e53935;
            display: none;
          }

          .success-message {
            background-color: #e8f5e9; /* Light green */
            color: #43a047; /* Darker green */
            border: 1px solid #43a047;
            display: none; /* Initially hidden */
          }


          .name-input {
            width: calc(100% - 20px); /* Adjust width for padding */
            padding: 12px;
            margin: 10px 0 20px 0; /* Increased bottom margin */
            border: 1px solid #bdc3c7; /* Lighter border */
            border-radius: 6px;
            font-size: 16px;
            transition: border-color 0.3s ease; /* Smooth border transition */
          }

          .name-input:focus {
            border-color: #3498db; /* Highlighted border on focus */
            outline: none; /* Remove default focus outline */
            box-shadow: 0 0 5px rgba(52, 152, 219, 0.5); /* Subtle focus shadow */
          }

          .quiz-container {
            background-color: #fff; /* White background for quiz box */
            border: 1px solid #e0e0e0; /* Light border */
            border-radius: 8px;
            padding: 25px;
            margin-bottom: 20px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05); /* Lighter shadow for quiz boxes */
          }

          .quiz-question {
            font-size: 1.2rem; /* Slightly larger question text */
            color: #34495e; /* Darker question color */
            margin-bottom: 20px;
            line-height: 1.6; /* Improved line height for readability */
          }

          .multiple-choice-label {
            color: #7f8c8d; /* Muted label color */
            font-style: italic;
            font-size: 0.9rem;
            margin-left: 5px;
          }

          .option {
            margin: 15px 0;
            display: flex; /* Use flexbox for option layout */
            align-items: center; /* Vertically align checkbox/radio and label */
          }

          .option input[type="radio"],
          .option input[type="checkbox"] {
            margin-right: 10px;
            -webkit-appearance: none; /* Remove default styling */
            -moz-appearance: none;
            appearance: none;
            width: 18px;
            height: 18px;
            border: 1px solid #bdc3c7;
            border-radius: 50%; /* For radio buttons */
            background-color: #fff;
            cursor: pointer;
            position: relative; /* For custom checkmark/dot */
          }

          .option input[type="checkbox"] {
            border-radius: 4px; /* Square corners for checkboxes */
          }

          .option input[type="radio"]:checked::before {
            content: '';
            display: block;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 10px;
            height: 10px;
            background-color: #3498db; /* Active radio dot color */
            border-radius: 50%;
          }

          .option input[type="checkbox"]:checked::before {
            content: '\\2713'; /* Checkmark character */
            display: block;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 14px;
            color: #fff;
            background-color: #3498db; /* Active checkbox color */
            width: 18px;
            height: 18px;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
          }


          .option label {
            font-size: 1rem;
            color: #555;
            cursor: pointer;
          }

          .submit-btn {
            background-color: #3498db; /* Blue submit button */
            color: white;
            padding: 12px 25px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 1.1rem;
            transition: background-color 0.3s ease;
            margin-top: 20px;
            display: block; /* Make button full width */
            width: 100%;
            text-align: center; /* Center text inside button */
          }

          .submit-btn:hover {
            background-color: #2980b9; /* Darker blue on hover */
          }

          .submit-btn:focus {
            outline: none; /* Remove focus outline */
            box-shadow: 0 0 5px rgba(52, 152, 219, 0.7); /* Stronger focus shadow */
          }

        </style>
      </head>
      <body>
        <div class="container">
          <h1>Active Quizzes</h1>
          <div id="error-display" class="error-message"></div>
          <div id="success-display" class="success-message"></div>
          <form id="quizForm" action="/quiz/submit" method="POST">
            <input
              type="text"
              name="studentId"
              class="name-input"
              placeholder="Enter your full name"
              required
            >

            ${quizzes
              .map(
                (quiz, index) => `
              <div class="quiz-container">
                <div class="quiz-question">
                  ${index + 1}. ${quiz.question}
                  ${
                    quiz.isMultipleChoice
                      ? '<span class="multiple-choice-label">(Multiple correct answers possible)</span>'
                      : '<span class="multiple-choice-label">(Select one answer)</span>'
                  }
                </div>
                <input type="hidden" name="quizId" value="${quiz.id}">
                ${quiz.options
                  .map(
                    (option) => `
                  <div class="option">
                    <input
                      type="${quiz.isMultipleChoice ? "checkbox" : "radio"}"
                      name="answers_${quiz.id}"
                      value="${option}"
                      id="${quiz.id}_${option}"
                    >
                    <label for="${quiz.id}_${option}">${option}</label>
                  </div>
                `
                  )
                  .join("")}
              </div>
            `
              )
              .join("")}
            <button type="submit" class="submit-btn">Submit Answers</button>
          </form>
        </div>

        <script>
          document.getElementById('quizForm').onsubmit = function(e) {
            e.preventDefault();

            const formData = new FormData(this);
            const studentId = formData.get('studentId');
            const submissions = [];
            const errorDisplay = document.getElementById('error-display');
            const successDisplay = document.getElementById('success-display');

            errorDisplay.style.display = 'none'; // Hide error message
            successDisplay.style.display = 'none'; // Hide success message

            // Get all quiz containers
            document.querySelectorAll('.quiz-container').forEach(container => {
              const quizId = container.querySelector('input[name="quizId"]').value;
              const answers = [];

              // Get all selected answers for this quiz
              container.querySelectorAll('input[type="checkbox"]:checked, input[type="radio"]:checked').forEach(input => {
                answers.push(input.value);
              });

              if (answers.length > 0) {
                submissions.push({
                  quizId,
                  studentId,
                  answers
                });
              }
            });

            if (submissions.length === 0) {
              errorDisplay.textContent = 'Please answer at least one question before submitting.';
              errorDisplay.style.display = 'block';
              return;
            }

            // Submit each quiz answer separately
            Promise.all(submissions.map(submission =>
              fetch('/quiz/submit', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(submission)
              })
            ))
            .then(responses => Promise.all(responses.map(r => r.json().then(data => ({ ok: r.ok, data }))))) // Handle response and data
            .then(results => {
              let hasError = false;
              results.forEach(result => {
                if (!result.ok) {
                  hasError = true;
                  if (result.data && result.data.error) {
                    errorDisplay.textContent = 'Error submitting answers: ' + result.data.error;
                  } else {
                    errorDisplay.textContent = 'Error submitting answers. Please try again.'; // Generic error if no specific error from server
                  }
                  errorDisplay.style.display = 'block';
                }
              });

              if (!hasError) {
                successDisplay.textContent = 'Answers submitted successfully!';
                successDisplay.style.display = 'block';
                // Optionally clear form or redirect after success
              }
            })
            .catch(error => {
              errorDisplay.textContent = 'Error submitting answers. Please check your network and try again.';
              errorDisplay.style.display = 'block';
              console.error(error);
            });
          };
        </script>
      </body>
      </html>
    `;
};
