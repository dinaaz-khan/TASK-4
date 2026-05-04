// Quiz Questions Data
const quizData = [
    {
        question: "What is the capital of France?",
        options: ["London", "Berlin", "Paris", "Madrid"],
        correctAnswer: 2
    },
    {
        question: "Which planet is known as the Red Planet?",
        options: ["Venus", "Mars", "Jupiter", "Saturn"],
        correctAnswer: 1
    },
    {
        question: "What is the largest ocean on Earth?",
        options: ["Atlantic Ocean", "Arctic Ocean", "Pacific Ocean", "Indian Ocean"],
        correctAnswer: 2
    },
    {
        question: "Who wrote 'Romeo and Juliet'?",
        options: ["Jane Austen", "Charles Dickens", "William Shakespeare", "Mark Twain"],
        correctAnswer: 2
    },
    {
        question: "What is the smallest prime number?",
        options: ["0", "1", "2", "3"],
        correctAnswer: 2
    }
];

// Global Variables
let currentQuestion = 0;
let userAnswers = new Array(quizData.length).fill(null);
let score = 0;

// Initialize Quiz on Page Load
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('totalQuestions').textContent = quizData.length;
    loadQuestion();
});

/**
 * Load and display current question
 */
function loadQuestion() {
    const question = quizData[currentQuestion];
    
    // Update question text
    document.getElementById('questionText').textContent = `Q${currentQuestion + 1}: ${question.question}`;
    
    // Update progress bar
    const progressPercentage = ((currentQuestion + 1) / quizData.length) * 100;
    document.getElementById('progressFill').style.width = progressPercentage + '%';
    
    // Update question counter
    document.getElementById('currentQuestion').textContent = currentQuestion + 1;
    
    // Generate options
    const optionsContainer = document.getElementById('optionsContainer');
    optionsContainer.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'option';
        
        const input = document.createElement('input');
        input.type = 'radio';
        input.name = 'option';
        input.value = index;
        input.id = `option${index}`;
        
        // Check if this option was previously selected
        if (userAnswers[currentQuestion] === index) {
            input.checked = true;
        }
        
        const label = document.createElement('label');
        label.htmlFor = `option${index}`;
        label.textContent = option;
        
        optionDiv.appendChild(input);
        optionDiv.appendChild(label);
        optionsContainer.appendChild(optionDiv);
    });
    
    // Update button states
    updateButtonStates();
    
    // Clear error message
    clearErrorMessage();
}

/**
 * Update Previous and Next button states
 */
function updateButtonStates() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    // Disable Previous button on first question
    prevBtn.disabled = currentQuestion === 0;
    
    // Change Next button text to Submit on last question
    if (currentQuestion === quizData.length - 1) {
        nextBtn.textContent = 'Submit →';
    } else {
        nextBtn.textContent = 'Next →';
    }
}

/**
 * Get selected answer for current question
 */
function getSelectedAnswer() {
    const selectedOption = document.querySelector('input[name="option"]:checked');
    return selectedOption ? parseInt(selectedOption.value) : null;
}

/**
 * Validate if user has selected an answer
 */
function validateAnswer() {
    const selectedAnswer = getSelectedAnswer();
    
    if (selectedAnswer === null) {
        showErrorMessage('⚠️ Please select an answer before proceeding!');
        return false;
    }
    
    return true;
}

/**
 * Show error message
 */
function showErrorMessage(message) {
    const errorElement = document.getElementById('errorMessage');
    errorElement.textContent = message;
    errorElement.classList.add('show');
}

/**
 * Clear error message
 */
function clearErrorMessage() {
    const errorElement = document.getElementById('errorMessage');
    errorElement.classList.remove('show');
    errorElement.textContent = '';
}

/**
 * Move to next question
 */
function nextQuestion() {
    // Validate that an answer is selected
    if (!validateAnswer()) {
        return;
    }
    
    // Save the selected answer
    userAnswers[currentQuestion] = getSelectedAnswer();
    
    // Check if we're at the last question
    if (currentQuestion === quizData.length - 1) {
        // Submit quiz
        submitQuiz();
    } else {
        // Move to next question
        currentQuestion++;
        loadQuestion();
        window.scrollTo(0, 0);
    }
}

/**
 * Move to previous question
 */
function previousQuestion() {
    // Save current answer if any
    const selectedAnswer = getSelectedAnswer();
    if (selectedAnswer !== null) {
        userAnswers[currentQuestion] = selectedAnswer;
    }
    
    // Move to previous question
    currentQuestion--;
    loadQuestion();
    window.scrollTo(0, 0);
}

/**
 * Submit quiz and calculate score
 */
function submitQuiz() {
    // Save the last answer
    userAnswers[currentQuestion] = getSelectedAnswer();
    
    // Calculate score
    score = 0;
    userAnswers.forEach((answer, index) => {
        if (answer === quizData[index].correctAnswer) {
            score++;
        }
    });
    
    // Display results
    displayResults();
}

/**
 * Display quiz results
 */
function displayResults() {
    const resultsSection = document.getElementById('resultsSection');
    const finalScore = document.getElementById('finalScore');
    const maxScore = document.getElementById('maxScore');
    const scorePercentage = document.getElementById('scorePercentage');
    const scoreFeedback = document.getElementById('scoreFeedback');
    
    // Update score display
    finalScore.textContent = score;
    maxScore.textContent = quizData.length;
    
    const percentage = Math.round((score / quizData.length) * 100);
    scorePercentage.textContent = percentage + '%';
    
    // Generate feedback message
    let feedbackMessage = '';
    let feedbackClass = '';
    
    if (percentage === 100) {
        feedbackMessage = '🎉 Perfect! You got all questions correct!';
        feedbackClass = 'excellent';
    } else if (percentage >= 80) {
        feedbackMessage = '🌟 Excellent work! You scored very well!';
        feedbackClass = 'excellent';
    } else if (percentage >= 60) {
        feedbackMessage = '👍 Good job! You passed the quiz!';
        feedbackClass = 'good';
    } else if (percentage >= 40) {
        feedbackMessage = '📚 Average performance. Keep learning!';
        feedbackClass = 'average';
    } else {
        feedbackMessage = '💪 Keep practicing and try again!';
        feedbackClass = 'poor';
    }
    
    scoreFeedback.textContent = feedbackMessage;
    scoreFeedback.className = 'score-feedback ' + feedbackClass;
    
    // Hide quiz container and show results
    document.querySelector('.quiz-container').style.display = 'none';
    document.querySelector('.quiz-header').style.display = 'none';
    resultsSection.classList.remove('hidden');
}

/**
 * Restart the quiz
 */
function restartQuiz() {
    // Reset variables
    currentQuestion = 0;
    userAnswers = new Array(quizData.length).fill(null);
    score = 0;
    
    // Show quiz container and hide results
    document.querySelector('.quiz-container').style.display = 'block';
    document.querySelector('.quiz-header').style.display = 'block';
    document.getElementById('resultsSection').classList.add('hidden');
    
    // Load first question
    loadQuestion();
    window.scrollTo(0, 0);
}
