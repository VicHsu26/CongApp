let timerInterval;
let drawInterval;
let time = 0;
let numbersDrawn = [];
let drawnNumbers = [];
let bingoNumbers = [];
let cardNumbers = [];

// Initialize bingo numbers (1 to 75)
for (let i = 1; i <= 75; i++) {
    bingoNumbers.push(i);
}

document.addEventListener("DOMContentLoaded", () => {
    const startBtn = document.getElementById("start-btn");
    const timerDisplay = document.getElementById("time");
    const currentNumberDisplay = document.getElementById("number");
    const bingoCard = document.getElementById("bingo-card");

    // Generate Bingo Card
    generateBingoCard();

    // Start game button
    startBtn.addEventListener("click", () => {
        startGame();
    });

    function startGame() {
        startBtn.disabled = true;
        time = 0;
        numbersDrawn = [];

        // Start timer
        timerInterval = setInterval(() => {
            time++;
            timerDisplay.textContent = time;
        }, 1000);

        // Start drawing numbers every 3 seconds
        drawInterval = setInterval(() => {
            drawNumber();
        }, 3000);
    }

    // Draw a random Bingo number
    function drawNumber() {
        if (bingoNumbers.length === 0) {
            clearInterval(drawInterval);
            alert("All numbers have been drawn!");
            return;
        }
        const randomIndex = Math.floor(Math.random() * bingoNumbers.length);
        const number = bingoNumbers.splice(randomIndex, 1)[0]; // Remove number from list
        drawnNumbers.push(number);
        currentNumberDisplay.textContent = number;
        checkForBingo();
    }

    // Generate a random Bingo card
    function generateBingoCard() {
        let cardSet = new Set();

        while (cardSet.size < 24) { // Exclude center space
            cardSet.add(Math.floor(Math.random() * 75) + 1);
        }

        cardNumbers = Array.from(cardSet);

        bingoCard.innerHTML = "";
        for (let i = 0; i < 25; i++) {
            const cell = document.createElement("div");
            cell.classList.add("bingo-cell");

            if (i === 12) {
                // Free space in the middle
                cell.textContent = "FREE";
                cell.classList.add("active");
            } else {
                cell.textContent = cardNumbers[i < 12 ? i : i - 1];
                cell.addEventListener("click", () => {
                    if (drawnNumbers.includes(parseInt(cell.textContent))) {
                        cell.classList.add("active");
                    }
                    checkForBingo();
                });
            }

            bingoCard.appendChild(cell);
        }
    }

    // Check if player has a Bingo (horizontally, vertically, or diagonally)
    function checkForBingo() {
        const cells = document.querySelectorAll(".bingo-cell");
        const matrix = Array.from(cells).map(cell => cell.classList.contains("active"));

        const winningPatterns = [
            // Rows
            [0, 1, 2, 3, 4],
            [5, 6, 7, 8, 9],
            [10, 11, 12, 13, 14],
            [15, 16, 17, 18, 19],
            [20, 21, 22, 23, 24],
            // Columns
            [0, 5, 10, 15, 20],
            [1, 6, 11, 16, 21],
            [2, 7, 12, 17, 22],
            [3, 8, 13, 18, 23],
            [4, 9, 14, 19, 24],
            // Diagonals
            [0, 6, 12, 18, 24],
            [4, 8, 12, 16, 20]
        ];

        let bingo = winningPatterns.some(pattern => pattern.every(index => matrix[index]));

        if (bingo) {
            clearInterval(drawInterval);
            clearInterval(timerInterval);
            alert("BINGO! You won!");
            startBtn.disabled = false; // Enable restart button
        }
    }
});
