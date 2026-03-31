const wordBank = "algorithm architecture development encryption framework interface javascript network optimization performance protocol responsive software structure system technology variable asynchronous callback deployment iteration complexity responsive database modular scalable redundant security integration".split(' ');
let timeLimit = 15;
let timeLeft = timeLimit;
let timer = null;
let isPlaying = false;
let charIndex = 0;
let mistakes = 0;

const wordsDisplay = document.getElementById('words-display');
const inputField = document.getElementById('main-input');
const timerDisplay = document.getElementById('timer');
const wpmDisplay = document.getElementById('wpm');
const mistakeDisplay = document.getElementById('mistakes-count');
const progressFill = document.getElementById('progress-fill');
const resultsOverlay = document.getElementById('in-game-results');
const highScoresList = document.getElementById('high-scores-list');

function initGame() {
    clearInterval(timer);
    isPlaying = false;
    charIndex = 0;
    mistakes = 0;
    timeLeft = timeLimit;
    inputField.value = "";
    inputField.disabled = false;
    timerDisplay.innerText = timeLeft;
    wpmDisplay.innerText = "0";
    mistakeDisplay.innerText = "0";
    progressFill.style.width = "100%";
    resultsOverlay.classList.add('hidden');
    wordsDisplay.innerHTML = "";
    const selectedWords = [];
    for (let i = 0; i < 60; i++) {
        selectedWords.push(wordBank[Math.floor(Math.random() * wordBank.length)]);
    }
    selectedWords.join(' ').split('').forEach(char => {
        const span = document.createElement('span');
        span.classList.add('letter');
        span.innerText = char;
        wordsDisplay.appendChild(span);
    });
    inputField.focus();
}

function changeMode(seconds, btn) {
    document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    timeLimit = seconds;
    initGame();
}

inputField.addEventListener('input', () => {
    const letters = wordsDisplay.querySelectorAll('.letter');
    const typedChar = inputField.value.split('')[charIndex];
    if (!isPlaying && inputField.value.length > 0) {
        isPlaying = true;
        timer = setInterval(countDown, 1000);
    }
    if (typedChar == null) {
        if (charIndex > 0) {
            charIndex--;
            letters[charIndex].classList.remove('correct', 'incorrect');
        }
    } else {
        if (letters[charIndex].innerText === typedChar) {
            letters[charIndex].classList.add('correct');
        } else {
            letters[charIndex].classList.add('incorrect');
            mistakes++;
            mistakeDisplay.innerText = mistakes;
        }
        charIndex++;
    }
    if (charIndex === letters.length) {
        stopGame();
        return;
    }
    const timeElapsed = (timeLimit - timeLeft) || 1;
    const wpm = Math.round(((charIndex - mistakes) / 5) / (timeElapsed / 60));
    wpmDisplay.innerText = wpm > 0 ? wpm : 0;
});

function countDown() {
    if (timeLeft > 0) {
        timeLeft--;
        timerDisplay.innerText = timeLeft;
        progressFill.style.width = (timeLeft / timeLimit) * 100 + "%";
    } else {
        stopGame();
    }
}

function stopGame() {
    clearInterval(timer);
    inputField.disabled = true;
    const finalWpm = parseInt(wpmDisplay.innerText);
    const acc = Math.round(((charIndex - mistakes) / charIndex) * 100) || 0;
    saveHighScore(finalWpm, acc);
    displayHighScores();
    resultsOverlay.classList.remove('hidden');
    document.getElementById('final-wpm').innerText = finalWpm;
    document.getElementById('final-acc').innerText = acc + "%";
}

function saveHighScore(wpm, acc) {
    let scores = JSON.parse(localStorage.getItem('turboTypeScores')) || [];
    scores.push({ wpm, acc, date: new Date().toLocaleDateString() });
    scores.sort((a, b) => b.wpm - a.wpm);
    localStorage.setItem('turboTypeScores', JSON.stringify(scores.slice(0, 5)));
}

function displayHighScores() {
    const scores = JSON.parse(localStorage.getItem('turboTypeScores')) || [];
    highScoresList.innerHTML = scores.map((score, index) =>
        `<li>${index + 1}. <span>${score.wpm} WPM</span> | ${score.acc}% Acc</li>`
    ).join('');
}

function restartGame() {
    initGame();
}

window.onload = initGame;