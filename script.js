let mysteryNumber, attempts, maxAttempts, minRange, maxRange;
let failedAttempts = 0;
const resultDiv = document.querySelector('.result');
const attemptsDiv = document.getElementById('attempts');
const submitBtn = document.getElementById('submitBtn');
const resetBtn = document.getElementById('resetBtn');
const userGuessInput = document.getElementById('userGuess');
const difficultySelect = document.getElementById('difficulty');
const victorySound = document.getElementById('victorySound');
const defeatSound = document.getElementById('defeatSound');
const clickSound = document.getElementById('clickSound');
const errorSound = document.getElementById('errorSound');
const snakeGame = document.getElementById('snakeGame');
const snakeCanvas = document.getElementById('snakeCanvas');
const ctx = snakeCanvas.getContext('2d');
const emojiExplosion = document.getElementById('emojiExplosion');
const miniGameHint = document.createElement('div');

let snake = [{ x: 10, y: 10 }];
let direction = { x: 1, y: 0 };
let food = { x: Math.floor(Math.random() * 20), y: Math.floor(Math.random() * 20) };
let gameInterval;

// Indice subtil du mini-jeu
miniGameHint.innerHTML = "🐍";
miniGameHint.style.position = "absolute";
miniGameHint.style.bottom = "10px";
miniGameHint.style.right = "10px";
miniGameHint.style.fontSize = "2rem";
miniGameHint.style.display = "none";
document.body.appendChild(miniGameHint);

// Initialisation du jeu selon le niveau choisi
function initGame(level = 'easy') {
    mysteryNumber = generateMysteryNumber(level);
    attempts = 0;
    failedAttempts = 0;
    setRangeAndAttempts(level);
    resultDiv.textContent = '';
    attemptsDiv.textContent = `Nombre d'essais restants : ${maxAttempts}`;
    resetBtn.classList.remove('show');
    snakeGame.classList.add('d-none');
    clearInterval(gameInterval);
    submitBtn.disabled = false;
    userGuessInput.min = minRange;
    userGuessInput.max = maxRange;
    userGuessInput.value = '';
    userGuessInput.classList.remove('is-invalid');
}

// Génère le numéro mystère selon le niveau
function generateMysteryNumber(level) {
    switch (level) {
        case 'medium':
            return Math.floor(Math.random() * 50) + 1;
        case 'hard':
            return Math.floor(Math.random() * 100) + 1;
        default:
            return Math.floor(Math.random() * 10) + 1;
    }
}

// Détermine les plages et les tentatives selon le niveau
function setRangeAndAttempts(level) {
    switch (level) {
        case 'medium':
            minRange = 1;
            maxRange = 50;
            maxAttempts = 2;
            break;
        case 'hard':
            minRange = 1;
            maxRange = 100;
            maxAttempts = 1;
            break;
        default:
            minRange = 1;
            maxRange = 10;
            maxAttempts = 3;
            break;
    }
    document.getElementById('range').textContent = `${minRange} et ${maxRange}`;
    attemptsDiv.textContent = `Nombre d'essais restants : ${maxAttempts}`;
}

// Soumission d'une tentative de l'utilisateur
submitBtn.addEventListener('click', () => {
    clickSound.play();
    const userGuess = parseInt(userGuessInput.value);
    
    // Validation de l'entrée
    if (isNaN(userGuess) || userGuess < minRange || userGuess > maxRange) {
        resultDiv.textContent = `Erreur : Veuillez entrer un nombre valide entre ${minRange} et ${maxRange}.`;
        submitBtn.classList.add('shake');
        errorSound.play();
        setTimeout(() => submitBtn.classList.remove('shake'), 500);
        failedAttempts++;
        if (failedAttempts === 3) {
            miniGameHint.style.display = "block";  // Montre l'indice du mini-jeu Snake
        }
        if (failedAttempts >= 5) {
            snakeGame.classList.remove('d-none');  // Affiche le mini-jeu Snake après 5 erreurs
            startSnakeGame();  // Démarre le jeu Snake
        }
        return;
    }

    attempts++;
    failedAttempts = 0;  // Réinitialise les échecs consécutifs

    resultDiv.textContent = "Vérification en cours...";
    createMatrixEffect();

    setTimeout(() => {
        if (userGuess === mysteryNumber) {
            resultDiv.textContent = `🎉 Bravo ! Vous avez trouvé le numéro mystère (${mysteryNumber}) en ${attempts} tentative(s). 🎉`;
            victorySound.play();
            createEmojiExplosion();
            endGame();
        } else if (attempts >= maxAttempts) {
            resultDiv.textContent = `💥 Dommage, vous avez perdu. Le numéro mystère était ${mysteryNumber}. 💥`;
            defeatSound.play();
            createEmojiExplosion();
            endGame();
        } else {
            resultDiv.textContent = userGuess > mysteryNumber ? "C'est moins !" : "C'est plus !";
            attemptsDiv.textContent = `Nombre d'essais restants : ${maxAttempts - attempts}`;
        }
    }, 1000);
});

// Fin de partie
function endGame() {
    resetBtn.classList.add('show');
    submitBtn.disabled = true;
    attemptsDiv.textContent = "Cliquez sur 'Rejouer' pour une autre partie!";
    clearInterval(gameInterval); // Arrête le jeu Snake s'il était en cours
}

// Réinitialisation du jeu
resetBtn.addEventListener('click', () => {
    initGame(difficultySelect.value);
});

// Modification du niveau
difficultySelect.addEventListener('change', (e) => {
    const level = e.target.value;
    initGame(level);
});

// Explosion d'émojis
function createEmojiExplosion() {
    for (let i = 0; i < 20; i++) {
        const emoji = document.createElement('div');
        emoji.classList.add('emoji');
        emoji.style.left = `${Math.random() * 100}%`;
        emoji.style.top = `${Math.random() * 100}%`;
        emoji.textContent = Math.random() > 0.5 ? '🎉' : '💥';
        emojiExplosion.appendChild(emoji);
        setTimeout(() => emoji.remove(), 1000);
    }
}

// Effet Matrix continu
function createMatrixEffect() {
    const matrixStream = document.createElement('div');
    matrixStream.classList.add('matrix-stream');
    matrixStream.style.left = `${Math.random() * 90}vw`; // Positionnement horizontal aléatoire
    matrixStream.style.top = '0'; // Commence en haut
    matrixStream.textContent = Array(20).fill(0).map(() => Math.floor(Math.random() * 10)).join(''); // Génère une chaîne de 20 chiffres aléatoires
    document.body.appendChild(matrixStream);

    setTimeout(() => {
        matrixStream.remove(); // Supprime le flux après 5 secondes
    }, 5000);
}

// Lancer les chiffres Matrix en continu
function startMatrixEffect() {
    setInterval(() => {
        createMatrixEffect(); // Génère un nouveau flux toutes les 3 secondes
    }, 3000);
}

// Fonction pour afficher et masquer le message caché à intervalles aléatoires
function showHiddenMessage() {
    const hiddenMessage = document.getElementById('hiddenMessage');
    
    // Délai aléatoire entre chaque apparition
    const randomDelay = Math.floor(Math.random() * 10000) + 5000; // Entre 5 et 15 secondes
    
    setTimeout(() => {
        hiddenMessage.style.display = 'block';  // Affiche le message
        
        // Le message reste visible pendant 3 secondes, puis disparaît
        setTimeout(() => {
            hiddenMessage.style.display = 'none'; // Cache le message
            showHiddenMessage(); // Relance l'apparition du message après un autre délai aléatoire
        }, 3000);
        
    }, randomDelay);  // Attente avant la prochaine apparition
}

// Démarrer l'affichage du message caché au chargement de la page
window.onload = () => {
    difficultySelect.value = 'easy';
    initGame('easy');
    startMatrixEffect(); // Lancer l'effet Matrix
    showHiddenMessage(); // Lancer le message caché de façon aléatoire
};

// Mini-jeu Snake
function drawSnake() {
    ctx.clearRect(0, 0, snakeCanvas.width, snakeCanvas.height);
    snake.forEach(part => {
        ctx.fillStyle = 'green';
        ctx.fillRect(part.x * 20, part.y * 20, 20, 20);
    });
}

function moveSnake() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        food = { x: Math.floor(Math.random() * 20), y: Math.floor(Math.random() * 20) };
    } else {
        snake.pop();
    }

    if (head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 20 || snake.slice(1).some(part => part.x === head.x && part.y === head.y)) {
        clearInterval(gameInterval);
        alert("Game Over! Vous avez perdu le mini-jeu Snake.");
        failedAttempts = 0;  // Réinitialise le compteur d'erreurs
        snakeGame.classList.add('d-none');
        miniGameHint.style.display = "none";  // Masque l'indication
    }
}

function drawFood() {
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * 20, food.y * 20, 20, 20);
}

function gameLoop() {
    moveSnake();
    drawSnake();
    drawFood();
}

function startSnakeGame() {
    snake = [{ x: 10, y: 10 }];
    direction = { x: 1, y: 0 };
    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, 200);
}

// Contrôler le Snake
window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp':
            if (direction.y !== 1) direction = { x: 0, y: -1 };
            break;
        case 'ArrowDown':
            if (direction.y !== -1) direction = { x: 0, y: 1 };
            break;
        case 'ArrowLeft':
            if (direction.x !== 1) direction = { x: -1, y: 0 };
            break;
        case 'ArrowRight':
            if (direction.x !== -1) direction = { x: 1, y: 0 };
            break;
    }
});