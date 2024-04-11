const wordDisplay = document.querySelector(".word-display");
const guessesText = document.querySelector(".guesses-text b");
const keyboardDiv = document.querySelector(".keyboard");
const hangmanImage = document.querySelector(".hangman-box img");
const gameFinish = document.querySelector(".game-over");
const gameError = document.querySelector(".game-error");
const playAgainBtn = gameFinish.querySelector("button");
const keepPlayBtn = gameError.querySelector("button");
const timeLeftText = document.querySelector(".time span b");
const scrambleText = document.querySelector(".scramble-text b");
const wordInput = document.querySelector(".word-input");
const refreshWordBtn = document.querySelector(".refresh-word");
const checkWordBtn = document.querySelector(".check-word");
const backspaceBtn = document.querySelector(".backspace");
const continueBtn = document.querySelector(".continue");

let currentWord = "",
  correctLetters = [],
  timer = null;
const totalTime = 30;

document.addEventListener("DOMContentLoaded", function () {
  const wordInput = document.querySelector(".word-input");
  wordInput.focus();
  wordInput.addEventListener("blur", function () {
    wordInput.focus();
  });
});

const resetGame = () => {
  correctLetters = [];
  hangmanImage.src = "images/scrabble.svg";
  wordInput.value = "";
  gameFinish.classList.remove("show");
  gameError.classList.remove("show");
  resetTimer();
};

const startTimer = () => {
  let timeLeft = totalTime;
  timeLeftText.innerText = timeLeft;
  timer = setInterval(() => {
    timeLeft--;
    timeLeftText.innerText = timeLeft;
    if (timeLeft <= 0) {
      gameOver(false);
      resetTimer();
    }
  }, 1000);
};

const resetTimer = () => {
  clearInterval(timer);
  timeLeftText.innerText = totalTime;
};

const getRandomWord = () => {
  const { word, hint } = wordList[Math.floor(Math.random() * wordList.length)];
  currentWord = word.toLowerCase();
  document.querySelector(".hint-text b").innerText = hint;
  resetGame();
  startTimer();
  scrambleText.innerText = scrambleWord(currentWord);
};

const scrambleWord = (word) => {
  const scrambledWord = word
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");
  return scrambledWord;
};

const gameOver = (isVictory) => {
  const modalText = isVictory ? `You found the word:` : "The correct word was:";
  gameFinish.querySelector("img").src = `images/${
    isVictory ? "victory" : "lost"
  }.gif`;
  gameFinish.querySelector("h4").innerText = isVictory
    ? "Congrats!"
    : "Game Over!";
  gameFinish.querySelector(
    "p"
  ).innerHTML = `${modalText} <b>${currentWord}</b>`;
  gameFinish.classList.add("show");
  resetTimer();
};

const errorCheck = (isError) => {
  const modalText = isError ? `Type a word first to check` : "is incorrect";
  gameError.querySelector("img").src = `images/${
    isError ? "null" : "lost"
  }.gif`;
  gameError.querySelector("h4").innerText = isError ? "Aah!" : "Ooops!";
  gameError.querySelector(
    "p"
  ).innerHTML = `<b>${wordInput.value}</b> ${modalText}`;
  gameError.classList.add("show");
};

const initGame = (button, clickedLetter) => {
  if (currentWord.includes(clickedLetter)) {
    if (!correctLetters.includes(clickedLetter)) {
      correctLetters.push(clickedLetter);
      updateWordInput();
      if (correctLetters.length === currentWord.length) return gameOver(true);
    }
  }
};

const selectLetter = (letter) => {
  const button = keyboardDiv.querySelector(`button[data-letter="${letter}"]`);
  wordInput.value += letter;
};

for (let i = 97; i <= 122; i++) {
  const letter = String.fromCharCode(i);
  const button = document.createElement("button");
  button.innerText = letter;
  button.setAttribute("data-letter", letter);
  keyboardDiv.appendChild(button);
  button.addEventListener("click", (e) =>
    selectLetter(e.target.getAttribute("data-letter"))
  );
}

getRandomWord();
playAgainBtn.addEventListener("click", getRandomWord);

refreshWordBtn.addEventListener("click", getRandomWord);

checkWordBtn.addEventListener("click", () => {
  const wordTyped = wordInput.value.trim().toLowerCase();
  if (!wordTyped) {
    errorCheck(true);
  } else if (wordTyped !== currentWord) {
    errorCheck(false);
  } else {
    gameOver(true);
  }
});

backspaceBtn.addEventListener("click", () => {
  let currentValue = wordInput.value;
  let caretPosition = wordInput.selectionStart;
  if (currentValue.length > 0 && caretPosition > 0) {
    const newValue =
      currentValue.slice(0, caretPosition - 1) +
      currentValue.slice(caretPosition);
    wordInput.value = newValue;
    wordInput.setSelectionRange(caretPosition - 1, caretPosition - 1);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.keyCode === 13) {
    checkWordBtn.click();
  }
});

continueBtn.addEventListener("click", () => {
  gameError.classList.remove("show");
});
