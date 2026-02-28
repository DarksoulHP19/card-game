const section = document.querySelector(".game-board");
const playersLivescount = document.querySelector(".playersLivescount");
const gameOverModal = document.querySelector("#game-over-modal");
const modalTitle = document.querySelector("#modal-title");
const modalMessage = document.querySelector("#modal-message");
const playAgainBtn = document.querySelector("#play-again-btn");

let playerLives = 0;

playersLivescount.textContent = "--";

// Web Audio API Context for synthesized sounds
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;

const playSynthSound = (type) => {
  if (!audioCtx) audioCtx = new AudioCtx();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  
  osc.connect(gain);
  gain.connect(audioCtx.destination);

  const now = audioCtx.currentTime;

  switch (type) {
    case 'flip':
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.1);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
      break;
    case 'match':
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.2); // E5
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
      break;
    case 'wrong':
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now); // A3
      osc.frequency.linearRampToValueAtTime(110, now + 0.2); // A2
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
      break;
    case 'win':
      osc.type = 'sine';
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        const o = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        o.connect(g);
        g.connect(audioCtx.destination);
        o.frequency.setValueAtTime(freq, now + i * 0.1);
        g.gain.setValueAtTime(0.1, now + i * 0.1);
        g.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.3);
        o.start(now + i * 0.1);
        o.stop(now + i * 0.1 + 0.3);
      });
      break;
    case 'lose':
      osc.type = 'square';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.linearRampToValueAtTime(50, now + 0.5);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.5);
      osc.start(now);
      osc.stop(now + 0.5);
      break;
  }
};

const playSound = (sound) => {
  // Try synthesized sound directly since files are missing
  playSynthSound(sound);
};

const getData = () => [
  { imgSrc: "./images/1.jpg", name: "ken_kanaki" },
  { imgSrc: "./images/2.jpg", name: "kakashi" },
  { imgSrc: "./images/3.jpg", name: "naruto" },
  { imgSrc: "./images/4.jpg", name: "gojo" },
  { imgSrc: "./images/5.jpg", name: "jiraya" },
  { imgSrc: "./images/6.jpg", name: "itachi" },
  { imgSrc: "./images/7.jpg", name: "levi" },
  { imgSrc: "./images/8.jpg", name: "zenitsu" },
  { imgSrc: "./images/1.jpg", name: "ken_kanaki" },
  { imgSrc: "./images/2.jpg", name: "kakashi" },
  { imgSrc: "./images/3.jpg", name: "naruto" },
  { imgSrc: "./images/4.jpg", name: "gojo" },
  { imgSrc: "./images/5.jpg", name: "jiraya" },
  { imgSrc: "./images/6.jpg", name: "itachi" },
  { imgSrc: "./images/7.jpg", name: "levi" },
  { imgSrc: "./images/8.jpg", name: "zenitsu" }
];

const randomize = () => {
  const cardData = getData();
  return cardData.sort(() => Math.random() - 0.5);
};

const generateCards = () => {
  const cardData = randomize();
  cardData.forEach(item => {
    const card = document.createElement("div");
    card.className = "card";
    card.setAttribute("name", item.name);

    card.innerHTML = `
      <div class="face">
        <img src="${item.imgSrc}" class="w-full h-full object-cover" />
      </div>
      <div class="back"></div>
    `;

    card.addEventListener("click", (e) => {
      if (!card.classList.contains("flipped") && !card.classList.contains("matched") && document.querySelectorAll(".card.flipped").length < 2 && playerLives > 0) {
        playSound("flip");
        card.classList.add("flipped");
        checkCards(e);
      }
    });

    section.appendChild(card);
  });
};

const checkCards = (e) => {
  const flippedCards = document.querySelectorAll(".card.flipped");

  if (flippedCards.length === 2) {
    const [first, second] = flippedCards;

    if (first.getAttribute("name") === second.getAttribute("name")) {
      playSound("match");
      flippedCards.forEach(card => {
        card.classList.remove("flipped");
        card.classList.add("matched");
      });
    } else {
      playSound("wrong");
      flippedCards.forEach(card => {
        setTimeout(() => {
          card.classList.remove("flipped");
        }, 1000);
      });

      playerLives--;
      playersLivescount.textContent = playerLives;
      
      const livesDisplay = document.querySelector("#lives-display");
      livesDisplay.classList.add("pulse-red");
      setTimeout(() => livesDisplay.classList.remove("pulse-red"), 1000);

      if (playerLives === 0) {
        playSound("lose");
        showModal(false);
      }
    }

    const allCards = document.querySelectorAll(".card");
    const allMatched = document.querySelectorAll(".card.matched");
    if (allMatched.length === allCards.length && allCards.length > 0) {
      playSound("win");
      showModal(true);
    }
  }
};

const showModal = (isWin) => {
  if (isWin) {
    modalTitle.textContent = "You Won! 🎉";
    modalTitle.style.color = "#4ade80"; // Tailwind green-400
    modalMessage.textContent = "Amazing memory! You matched all the pairs.";
  } else {
    modalTitle.textContent = "Game Over 😢";
    modalTitle.style.color = "#f87171"; // Tailwind red-400
    modalMessage.textContent = "Don't give up! Try again to improve your score.";
  }
  gameOverModal.classList.add("visible");
};

const restartGame = () => {
  gameOverModal.classList.remove("visible");
  section.innerHTML = "";
  playerLives = 0;
  playersLivescount.textContent = "--";
  document.querySelector(".container").classList.add("disabled", "opacity-40", "pointer-events-none");
};

playAgainBtn.addEventListener("click", restartGame);

document.querySelector("#e").addEventListener("click", () => {
  playerLives = 15;
  startGame();
});
document.querySelector("#m").addEventListener("click", () => {
  playerLives = 10;
  startGame();
});
document.querySelector("#h").addEventListener("click", () => {
  playerLives = 7;
  startGame();
});

function startGame() {
  document.querySelector(".container").classList.remove("disabled", "opacity-40", "pointer-events-none");
  section.innerHTML = "";
  playersLivescount.textContent = playerLives;
  generateCards();
}
