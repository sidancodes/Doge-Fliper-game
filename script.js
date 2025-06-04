// Game images
const images = [
    'https://t4.ftcdn.net/jpg/05/84/79/77/240_F_584797754_ioWO23lWL5Rxa1yJS81wz1osLgaPoLOi.webp',
    'https://t4.ftcdn.net/jpg/05/45/58/65/240_F_545586510_PnVBWbzyo1OSUTK47TwVvVXFAwdawkxn.jpg',
    'https://t3.ftcdn.net/jpg/05/64/83/20/240_F_564832021_BReUmPUDsFpYsAcFZFFfX5TieC8EPKrM.webp',
    'https://t3.ftcdn.net/jpg/05/56/06/44/240_F_556064488_JilZYUA1CWOG8OwZ7lRC8mMaUUs2BdKp.webp',
    'https://t3.ftcdn.net/jpg/06/33/86/86/240_F_633868669_jNPpLRc4xT7PbZ02nFOUu8GNjSRONzco.webp',
    'https://t4.ftcdn.net/jpg/05/84/91/67/240_F_584916761_kGoQDUec1CfxI4gq5SvskUGivoWZP0YK.webp',
    'https://t3.ftcdn.net/jpg/06/22/88/96/240_F_622889648_wMsxudUj3zMCbIqYG4l74q2AO8IHtCGT.jpg',
    'https://t4.ftcdn.net/jpg/05/65/13/61/240_F_565136198_5mOWYZz8zsj5ot9LAxwlF9i3x3SVdpOj.jpg',
    // Duplicate the images for matching pairs
    'https://t4.ftcdn.net/jpg/05/84/79/77/240_F_584797754_ioWO23lWL5Rxa1yJS81wz1osLgaPoLOi.webp',
    'https://t4.ftcdn.net/jpg/05/45/58/65/240_F_545586510_PnVBWbzyo1OSUTK47TwVvVXFAwdawkxn.jpg',
    'https://t3.ftcdn.net/jpg/05/64/83/20/240_F_564832021_BReUmPUDsFpYsAcFZFFfX5TieC8EPKrM.webp',
    'https://t3.ftcdn.net/jpg/05/56/06/44/240_F_556064488_JilZYUA1CWOG8OwZ7lRC8mMaUUs2BdKp.webp',
    'https://t3.ftcdn.net/jpg/06/33/86/86/240_F_633868669_jNPpLRc4xT7PbZ02nFOUu8GNjSRONzco.webp',
    'https://t4.ftcdn.net/jpg/05/84/91/67/240_F_584916761_kGoQDUec1CfxI4gq5SvskUGivoWZP0YK.webp',
    'https://t3.ftcdn.net/jpg/06/22/88/96/240_F_622889648_wMsxudUj3zMCbIqYG4l74q2AO8IHtCGT.jpg',
    'https://t4.ftcdn.net/jpg/05/65/13/61/240_F_565136198_5mOWYZz8zsj5ot9LAxwlF9i3x3SVdpOj.jpg'
];

const wrongGifs = [
    'https://media.tenor.com/nYtu_y3iFWwAAAAi/doge.gif',
    'https://media.tenor.com/FrUFy1DveuIAAAAi/bonk-doge.gif',
    'https://media.tenor.com/o9sXuSI4M34AAAAi/kek-dog.gif',
    'https://media.tenor.com/aaREt24LEoIAAAAi/i-will-shoot.gif',
    'https://media1.tenor.com/m/J7FOSZsIKN4AAAAd/doge-doge-coin.gif'
];

const winGifs = [
    'https://media.tenor.com/kAQlH5am9jwAAAAi/spookyposting-halloween.gif',
    'https://media.tenor.com/kAQlH5am9jwAAAAi/spookyposting-halloween.gif',
    'https://media.tenor.com/kAQlH5am9jwAAAAi/spookyposting-halloween.gif'
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

// Preload images
function preloadImages() {
    const allImages = [...images, ...wrongGifs, ...winGifs];
    allImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

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

    // Preload images
    preloadImages();
}

// Create a card element
function createCard(image, index) {
    const card = document.createElement('div');
    card.className = 'card no-select';
    card.dataset.index = index;
    
    const cardFront = document.createElement('div');
    cardFront.className = 'card-front';
    
    const cardBack = document.createElement('div');
    cardBack.className = 'card-back';
    
    const img = document.createElement('img');
    img.src = image;
    img.alt = 'Card';
    img.loading = 'eager'; // Force immediate loading
    cardBack.appendChild(img);
    
    card.appendChild(cardFront);
    card.appendChild(cardBack);
    
    // Use touchstart for mobile devices
    card.addEventListener('touchstart', (e) => {
        e.preventDefault(); // Prevent double-tap zoom
        flipCard(card);
    }, { passive: false });
    
    // Keep click for desktop
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