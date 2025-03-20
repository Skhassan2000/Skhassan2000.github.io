// Get DOM elements
const choices = document.querySelectorAll('.choice');
const computerImg = document.getElementById('computer-img');
const computerCaption = document.getElementById('computer-caption');
const resultText = document.getElementById('result-text');
const winsElement = document.getElementById('wins');
const lossesElement = document.getElementById('losses');
const tiesElement = document.getElementById('ties');
const resetBtn = document.getElementById('reset-btn');

// Game state
let playerChoice = null;
let computerChoice = null;
let isComputerThinking = false;
let scores = {
    wins: 0,
    losses: 0,
    ties: 0
};

// Load scores from localStorage if available
function loadScores() {
    const savedScores = localStorage.getItem('rpsScores');
    if (savedScores) {
        scores = JSON.parse(savedScores);
        updateScoreDisplay();
    }
}

// Save scores to localStorage
function saveScores() {
    localStorage.setItem('rpsScores', JSON.stringify(scores));
}

// Update score display
function updateScoreDisplay() {
    winsElement.textContent = scores.wins;
    lossesElement.textContent = scores.losses;
    tiesElement.textContent = scores.ties;
}

// Reset game state and UI
function resetGame() {
    playerChoice = null;
    computerChoice = null;
    isComputerThinking = false;
    
    // Reset UI
    choices.forEach(choice => choice.classList.remove('selected'));
    computerImg.src = 'question-mark.png';
    computerCaption.textContent = 'Computer is waiting...';
    resultText.textContent = 'Make your choice to start the game!';
    resultText.className = '';
}

// Reset scores
function resetScores() {
    scores.wins = 0;
    scores.losses = 0;
    scores.ties = 0;
    updateScoreDisplay();
    saveScores();
    resetGame();
}

// Get random choice for computer
function getRandomChoice() {
    const options = ['rock', 'paper', 'scissors'];
    const randomIndex = Math.floor(Math.random() * 3);
    return options[randomIndex];
}

// Shuffle computer images during "thinking" phase
function shuffleComputerChoice() {
    const options = ['rock', 'paper', 'scissors'];
    const startTime = Date.now();
    const thinkingTime = 3000; // 3 seconds in milliseconds
    let shuffleInterval;
    
    // Start shuffle animation
    shuffleInterval = setInterval(() => {
        // Get a random choice for the shuffle animation
        const randomChoice = options[Math.floor(Math.random() * 3)];
        computerImg.src = `${randomChoice}.png`;
        computerCaption.textContent = 'Thinking...';
        
        // Check if we've reached the 3-second mark
        const elapsedTime = Date.now() - startTime;
        if (elapsedTime >= thinkingTime) {
            // Stop the animation after 3 seconds
            clearInterval(shuffleInterval);
            
            // Make the final random choice
            computerChoice = getRandomChoice();
            computerImg.src = `${computerChoice}.png`;
            computerCaption.textContent = `Computer chose ${computerChoice.charAt(0).toUpperCase() + computerChoice.slice(1)}`;
            
            // Determine the winner
            determineWinner();
        }
    }, 500); // Shuffle every half second
}

// Determine winner
function determineWinner() {
    if (playerChoice === computerChoice) {
        // Tie
        resultText.textContent = "It's a tie!";
        resultText.className = 'tie';
        scores.ties++;
    } else if (
        (playerChoice === 'rock' && computerChoice === 'scissors') ||
        (playerChoice === 'paper' && computerChoice === 'rock') ||
        (playerChoice === 'scissors' && computerChoice === 'paper')
    ) {
        // Player wins
        resultText.textContent = "You win!";
        resultText.className = 'win';
        scores.wins++;
    } else {
        // Computer wins
        resultText.textContent = "Computer wins!";
        resultText.className = 'lose';
        scores.losses++;
    }
    
    updateScoreDisplay();
    saveScores();
    isComputerThinking = false;
}

// Event Listeners
choices.forEach(choice => {
    choice.addEventListener('click', function() {
        // Prevent multiple selections while computer is thinking
        if (isComputerThinking) return;
        
        // Reset previous selection
        choices.forEach(c => c.classList.remove('selected'));
        
        // Select current choice
        this.classList.add('selected');
        playerChoice = this.id;
        
        // Start computer's turn
        isComputerThinking = true;
        shuffleComputerChoice();
    });
});

resetBtn.addEventListener('click', resetScores);

// Initialize game
loadScores();
resetGame();