const section = document.querySelector(".game-board");
const playersLivescount = document.querySelector(".playersLivescount");
let playerLives = 0;

playersLivescount.textContent = playerLives;

const sounds = {
  flip: new Audio("./sounds/flip.wav"),
  match: new Audio("./sounds/match.wav"),
  wrong: new Audio("./sounds/wrong.wav"),
  win: new Audio("./sounds/win.wav"),
  lose: new Audio("./sounds/lose.wav"),
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
    card.className = "card w-20 h-24 sm:w-24 sm:h-28 bg-gray-800 rounded relative perspective";
    card.setAttribute("name", item.name);

    card.innerHTML = `
      <div class="face absolute inset-0 backface-hidden rounded overflow-hidden transition-transform duration-700 transform rotate-y-180">
        <img src="${item.imgSrc}" class="w-full h-full object-cover" />
      </div>
      <div class="back absolute inset-0 bg-gray-600 backface-hidden rounded transition-transform duration-700"></div>
    `;

    card.addEventListener("click", (e) => {
      if (!card.classList.contains("flipped") && document.querySelectorAll(".flipped").length < 2) {
        sounds.flip.play();
        card.classList.add("flipped", "rotate-y-180");
        checkCards(e);
      }
    });

    section.appendChild(card);
  });
};

const checkCards = (e) => {
  const flippedCards = document.querySelectorAll(".flipped");

  if (flippedCards.length === 2) {
    const [first, second] = flippedCards;

    if (first.getAttribute("name") === second.getAttribute("name")) {
      sounds.match.play();
      flippedCards.forEach(card => {
        card.classList.remove("flipped");
        card.style.pointerEvents = "none";
      });
    } else {
      sounds.wrong.play();
      flippedCards.forEach(card => {
        setTimeout(() => {
          card.classList.remove("flipped", "rotate-y-180");
        }, 1000);
      });

      playerLives--;
      playersLivescount.textContent = playerLives;
      if (playerLives === 0) {
        sounds.lose.play();
        restart("Try again 😢");
      }
    }

    const allFlipped = document.querySelectorAll(".card.rotate-y-180");
    if (allFlipped.length === 16) {
      sounds.win.play();
      restart("🎉 You won!");
    }
  }
};

const restart = (msg) => {
  alert(msg);
  section.innerHTML = "";
  playerLives = 20;
  playersLivescount.textContent = playerLives;
  generateCards();
};

generateCards();

// Difficulty selectors
document.querySelector("#e").addEventListener("click", () => {
  playerLives = 20;
  startGame();
});
document.querySelector("#m").addEventListener("click", () => {
  playerLives = 15;
  startGame();
});
document.querySelector("#h").addEventListener("click", () => {
  playerLives = 10;
  startGame();
});

function startGame() {
  document.querySelector(".container").classList.remove("disabled", "opacity-40", "pointer-events-none");
  section.innerHTML = "";
  playersLivescount.textContent = playerLives;
  generateCards();
}
