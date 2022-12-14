//Grab a couple of things

const section = document.querySelector("section");
const playersLivescount = document.querySelector("span");
let playerLives;



// link text
playersLivescount.textContent = playerLives;


//generate the data


const getdata = () => [
    { imgSrc: "./images/1.jpg ", name: "ken_kanaki" },
    { imgSrc: "./images/2.jpg ", name: "kakashi " },
    { imgSrc: "./images/3.jpg ", name: "naruto" },
    { imgSrc: "./images/4.jpg ", name: "gojo" },
    { imgSrc: "./images/5.jpg ", name: "jiraya" },
    { imgSrc: "./images/6.jpg ", name: "itachi" },
    { imgSrc: "./images/7.jpg ", name: "levi" },
    { imgSrc: "./images/8.jpg ", name: "zenitsu" },
    { imgSrc: "./images/1.jpg ", name: "ken_kanaki" },
    { imgSrc: "./images/2.jpg ", name: "kakashi " },
    { imgSrc: "./images/3.jpg ", name: "naruto" },
    { imgSrc: "./images/4.jpg ", name: "gojo" },
    { imgSrc: "./images/5.jpg ", name: "jiraya" },
    { imgSrc: "./images/6.jpg ", name: "itachi" },
    { imgSrc: "./images/7.jpg ", name: "levi" },
    { imgSrc: "./images/8.jpg ", name: "zenitsu" }
];

//Randomize  

//note:- math.random is technique to random the array's varaibles

const rendomize = () => {
    const cardData = getdata();
    console.log(cardData);
    cardData.sort(() => Math.random() - 0.5);
    return cardData;
}
rendomize();



// card genrator function
const cardGenrator = () => {
    const cardData = rendomize();

    //genrate HTML
    const cards = document.querySelectorAll(".card");
    cardData.forEach(item => {

        const card = document.createElement("div");
        const face = document.createElement("img");
        const back = document.createElement("div");
        card.classList = "card";
        face.classList = "face";
        back.classList = "back";

        //attach the info to the cards
        face.src = item.imgSrc;
        card.setAttribute("name", item.name);

        //attach the card to the section
        section.appendChild(card);
        card.appendChild(face);
        card.appendChild(back);

        card.addEventListener('click', (e) => {
            card.classList.toggle('togglecard');
            checkcards(e);
        })
    });

};

// change background color
function changeColor(event) {
    var color = event.value;
    document.getElementsByTagName('BODY')[0].style.backgroundColor = color;
}

//check cards
const checkcards = (e) => {
    console.log(e);
    const clickedcard = e.target;
    clickedcard.classList.add("flipped");
    const flippedcards = document.querySelectorAll('.flipped');
    const togglecard = document.querySelectorAll(".togglecard")
    console.log("flippedcards")

    //logic
    if (flippedcards.length === 2) {
        if (flippedcards[0].getAttribute("name") === flippedcards[1].getAttribute("name")) {
            console.log("match");
            flippedcards.forEach((card) => {
                card.classList.remove("flipped");
                card.style.pointerEvents = "none";
            });
        }
        else {
            console.log("wrong");
            flippedcards.forEach((card) => {
                card.classList.remove("flipped");
                setTimeout(() => card.classList.remove("togglecard"), 1000);

            });
            playerLives--;
            playersLivescount.textContent = playerLives;
            if (playerLives === 0) {
                restart("try again");
            }
        }
    }
    //check a player win a game or not
    if (togglecard.length === 16) {
        restart("you won game");
    }
};

//Restart 
const restart = (text) => {
    let cardData = rendomize();
    let faces = document.querySelectorAll(".face");
    let cards = document.querySelectorAll(".card");
    section.style.pointerEvents = "none";
    cardData.forEach((item, index) => {
        cards[index].classList.remove('togglecard');
        //randomize
        setTimeout(() => {
            cards[index].style.pointerEvents = 'all';
            faces[index].src = item.imgSrc;
            cards[index].setAttribute('name', item.name);
            section.style.pointerEvents = "all";
        }, 1000);

    });
    playerLives = 20;
    playersLivescount.textContent = playerLives;
    setTimeout(() => window.alert(text), 1000);
}
cardGenrator();

// difficulty buttons 

const easy =document.querySelector("#e");
const medium=document.querySelector("#m");
const hard=document.querySelector("#h");


//if any one of these are selected, the "disabled" class is removed, and the game is then continued.

easy.addEventListener("click", () => {
    playerLives=20;
    document.querySelector(".playersLivescount").innerHTML = playerLives;
    document.querySelector(".container").classList.remove("disabled");
});

  medium.addEventListener("click", () => {
      playerLives=15;
      document.querySelector(".playersLivescount").innerHTML = playerLives;
    document.querySelector(".container").classList.remove("disabled");
});

  hard.addEventListener("click", () => {
      playerLives=10 ;
      document.querySelector(".playersLivescount").innerHTML = playerLives;
      document.querySelector(".container").classList.remove("disabled");
});
