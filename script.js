const homeContainer = document.getElementById("home-container");
const questionsContainer = document.getElementById("questions-container");
const resultsContainer = document.getElementById("results-container");
const startButton = document.getElementById('start-button')

function goQuestion() {
    homeContainer.classList.add("hide");
    questionsContainer.classList.remove("hide");
}

startButton.addEventListener("click", goQuestion);