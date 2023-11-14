document.addEventListener("DOMContentLoaded", function () {
  const homeContainer = document.getElementById("home-container");
  const startButton = document.getElementById("start-btn");
  const nextButton = document.getElementById("next-btn");
  const againButton = document.getElementById("again-btn");

  const questionContainerElement = document.getElementById("question-container");
  const questionElement = document.getElementById("question");
  const answerButtonsElement = document.getElementById("answer-buttons");

  const resultsContainerElement = document.getElementById("score");
  const results = document.getElementById("results");

  let currentQuestionIndex;
  let questionList = [];
  let correctAnswers = 0; // Variable para rastrear el número de aciertos

  function startGame() {
    console.log("startGame clicked");
    homeContainer.classList.add("hide");
    currentQuestionIndex = 0;
    correctAnswers = 0;
    questionContainerElement.classList.remove("hide");
    getQuestionsFromAPI();
  }

  function showQuestion(item) {
    questionElement.innerHTML = item.question;
    item.answers.forEach((answer, index) => {
      const button = document.createElement("button");
      switch (index) {
        case 0:
          button.classList.add("btn", "button-red");
          break;
        case 1:
          button.classList.add("btn", "button-yellow");
          break;
        case 2:
          button.classList.add("btn", "button-green");
          break;
        case 3:
          button.classList.add("btn", "button-blue");
          break;
        default:
          break;
      }
      button.innerHTML = answer.text;

      if (answer.correct) {
        button.dataset.correct = true;
      }
      button.addEventListener("click", selectAnswer);
      answerButtonsElement.appendChild(button);
    });
  }

  function setNextQuestion() {
    resetState();
    if (currentQuestionIndex < questionList.length) {
      showQuestion(questionList[currentQuestionIndex]);
    }
    if (currentQuestionIndex === questionList.length - 1) {
      nextButton.classList.add("hide");
      showResults();
    }
  }

  function showResults() {
    questionContainerElement.classList.add("hide");
    resultsContainerElement.classList.remove("hide");
    results.innerText = `${correctAnswers}/10`;
  }
  function playAgain() {
    homeContainer.classList.remove("hide");
    resultsContainerElement.classList.add("hide");
  }

  function selectAnswer(event) {
    const selectedButton = event.target;
    Array.from(answerButtonsElement.children).forEach((button) => {
      setStatusClass(button);
    });

    if (selectedButton.dataset.correct) {
      correctAnswers++; // Incrementar el número de aciertos si la respuesta es correcta
    }

    if (currentQuestionIndex < questionList.length - 1) {
      nextButton.classList.remove("hide");
    } else {
      // Mostrar el número de aciertos al final del juego
      nextButton.classList.add("hide");
      showResults();
    }
  }

  function setStatusClass(element) {
    element.classList.add("hover-disabled");
    if (element.dataset.correct) {
      element.classList.add("color-correct");
    } else {
      element.classList.add("color-wrong");
    }
  }

  nextButton.addEventListener("click", () => {
    currentQuestionIndex++;
    setNextQuestion();
  });

  function resetState() {
    nextButton.classList.add("hide");

    while (answerButtonsElement.firstChild) {
      answerButtonsElement.removeChild(answerButtonsElement.firstChild);
    }
  }

  function getQuestionsFromAPI() {
    axios
      .get("https://opentdb.com/api.php?amount=10")
      .then((response) => {
        const data = response.data;
        questionList = data.results.map((result) => {
          const allAnswers = [
            ...result.incorrect_answers,
            result.correct_answer,
          ];
          const shuffledAnswers = shuffleArray(allAnswers);

          return {
            question: result.question,
            answers: shuffledAnswers.map((answer) => ({
              text: answer,
              correct: answer === result.correct_answer,
            })),
          };
        });
        setNextQuestion();
      })
      .catch((error) => console.error("Error fetching questions:", error));
  }

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  startButton.addEventListener("click", startGame);
  againButton.addEventListener("click", playAgain);
});
