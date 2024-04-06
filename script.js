//Fetch questions from the server
fetch("http://localhost:3000/quiz-questions")
	.then((response) => response.json())
	.then((questions) => {
		console.log(questions);
		const quizContainer = document.getElementById("quiz-container");
		questions.forEach((question, index) => {
			const questionHTML = `
                        <div class="question">
                            <p>${index + 1}. ${question.question}</p>
                            <ul>
                                ${question.options.map((option, optionIndex) => 
                                `<li>
                                    <input type="radio" name="question${index}" value="${optionIndex}">
                                    <label>${option}</label>
                                </li>`).join("")}
                            </ul>
                        </div>
                    `;
			quizContainer.innerHTML += questionHTML;
		});
	});


const submit = document.getElementById("submit-btn");

submit.addEventListener("click", () => {
	const answers = [];
	const quizQuestions = document.querySelectorAll(".question");
	quizQuestions.forEach((question, index) => {
		const selectedOption = question.querySelector(
			`input[name="question${index}"]:checked`
		);
		if (selectedOption) {
			answers.push(parseInt(selectedOption.value));
		} else {
			answers.push(-1);
		}
	});

//Submit answer and get results
	fetch("http://localhost:3000/submit-answers", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ answers }),
	})
		.then((response) => response.json())
		.then((result) => {
            const feedbackContainer = document.getElementById("feedback-container");
            feedbackContainer.innerHTML = ""; // Clear previous feedback
            const feedbackTitle = document.createElement("h2");
            feedbackTitle.textContent = "Feedback";
            feedbackContainer.appendChild(feedbackTitle);

            //Feedback for each answer
            result.feedback.forEach((message, index) => {
                const p = document.createElement("p");
                p.textContent = message;
                feedbackContainer.appendChild(p);
            });

            //Final Score
            const scoreMessage = document.createElement("h3");
            scoreMessage.textContent = result.message;
            feedbackContainer.appendChild(scoreMessage);
		})
		.catch((error) => {
			console.error("Error submitting answers:", error);
			alert("An error occurred. Please try again.");
		});
});
