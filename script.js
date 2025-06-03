// Game images (you can replace these with your own images)
const images = [
    'images/card1.jpg', 'images/card2.jpg', 'images/card3.jpg', 'images/card4.jpg',
    'images/card5.jpg', 'images/card6.jpg', 'images/card7.jpg', 'images/card8.jpg',
    'images/card1.jpg', 'images/card2.jpg', 'images/card3.jpg', 'images/card4.jpg',
    'images/card5.jpg', 'images/card6.jpg', 'images/card7.jpg', 'images/card8.jpg'
];

const wrongGifs = [
    'images/wrong1.gif',
    'images/wrong2.gif',
    'images/wrong3.gif',
    'images/wrong4.gif',
    'images/wrong5.gif'
];

const winGifs = [
    'images/win1.gif',
    'images/win2.gif',
    'images/win3.gif'
];

// Game variables
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let timer = 0;
let timerInterval;
let gameStarted = false;

// DOM elements
const gameBoard = document.getElementById('game-board');
const movesElement = document.getElementById('moves');
const timeElement = document.getElementById('time');
const restartButton = document.getElementById('restart');
const gifPopup = document.getElementById('gif-popup');
const gifPopupImg = document.getElementById('gif-popup-img');
const winGifPopup = document.getElementById('win-gif-popup');
const winGifPopupImg = document.getElementById('win-gif-popup-img');

// Initialize the game
function initGame() {
    // Reset game variables
    cards = [];
    flippedCards = [];
    matchedPairs = 0;
    moves = 0;
    timer = 0;
    gameStarted = false;
    clearInterval(timerInterval);
    
    // Update UI
    movesElement.textContent = moves;
    timeElement.textContent = '00:00';
    
    // Shuffle and create cards
    const shuffledImages = shuffleArray([...images]);
    gameBoard.innerHTML = '';
    
    shuffledImages.forEach((image, index) => {
        const card = createCard(image, index);
        gameBoard.appendChild(card);
        cards.push(card);
    });
}

// Create a card element
function createCard(image, index) {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.index = index;
    
    const cardFront = document.createElement('div');
    cardFront.className = 'card-front';
    
    const cardBack = document.createElement('div');
    cardBack.className = 'card-back';
    
    const img = document.createElement('img');
    img.src = image;
    img.alt = 'Card';
    cardBack.appendChild(img);
    
    card.appendChild(cardFront);
    card.appendChild(cardBack);
    
    card.addEventListener('click', () => flipCard(card));
    
    return card;
}

// Shuffle array using Fisher-Yates algorithm
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Flip card
function flipCard(card) {
    if (flippedCards.length === 2 || card.classList.contains('flipped') || card.classList.contains('matched')) {
        return;
    }
    
    if (!gameStarted) {
        startTimer();
        gameStarted = true;
    }
    
    card.classList.add('flipped');
    flippedCards.push(card);
    
    if (flippedCards.length === 2) {
        moves++;
        movesElement.textContent = moves;
        checkMatch();
    }
}

// Check if flipped cards match
function checkMatch() {
    const [card1, card2] = flippedCards;
    const match = card1.querySelector('img').src === card2.querySelector('img').src;
    
    if (match) {
        card1.classList.add('matched');
        card2.classList.add('matched');
        matchedPairs++;
        
        if (matchedPairs === 8) {
            endGame();
        }
    } else {
        showWrongGif();
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
        }, 1000);
    }
    
    flippedCards = [];
}

// Start timer
function startTimer() {
    timerInterval = setInterval(() => {
        timer++;
        const minutes = Math.floor(timer / 60).toString().padStart(2, '0');
        const seconds = (timer % 60).toString().padStart(2, '0');
        timeElement.textContent = `${minutes}:${seconds}`;
    }, 1000);
}

// End game
function endGame() {
    clearInterval(timerInterval);
    showWinGif();
    // Trigger confetti effect
    if (window.confetti) {
        confetti({
            particleCount: 120,
            spread: 90,
            origin: { y: 0.6 }
        });
    }
    setTimeout(() => {
        alert(`Congratulations! You won in ${moves} moves and ${timeElement.textContent} seconds!`);
    }, 500);
}

function showWrongGif() {
    const randomGif = wrongGifs[Math.floor(Math.random() * wrongGifs.length)];
    setTimeout(() => {
        gifPopupImg.src = randomGif;
        gifPopup.style.display = 'flex';
        setTimeout(() => {
            gifPopup.style.display = 'none';
        }, 1500);
    }, 200); // 200ms delay before showing popup
}

function showWinGif() {
    const randomGif = winGifs[Math.floor(Math.random() * winGifs.length)];
    winGifPopupImg.src = randomGif;
    winGifPopup.style.display = 'flex';
    setTimeout(() => {
        winGifPopup.style.display = 'none';
    }, 2500);
}

// Event listeners
restartButton.addEventListener('click', initGame);

// Initialize the game when the page loads
initGame(); 