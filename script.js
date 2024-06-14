const names = [
    "Goutham", "Shilpavalli", "Satya", "Sunil", "Shashank",
    "Sahith", "Sai Charan", "Pritham", "Nikhil", "Sameer"
];

const teamA = [];
const teamB = [];
let currentTeam = 'A';

const wheelCanvas = document.getElementById("wheelCanvas");
const ctx = wheelCanvas.getContext("2d");
const spinButton = document.getElementById("spinButton");
const resultModal = document.getElementById("resultModal");
const modalResult = document.getElementById("modalResult");
const closeModal = document.querySelector(".close");
const currentTeamHeading = document.getElementById("currentTeam");

let availableNames = [...names];
const segments = availableNames.length;
const segmentAngle = (2 * Math.PI) / segments;
let isSpinning = false;
let selectedIndex = 0;  // Default to the first name in the array

function drawWheel() {
    ctx.clearRect(0, 0, wheelCanvas.width, wheelCanvas.height);

    // Draw the base
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(250, 500);
    ctx.lineTo(200, 550);
    ctx.lineTo(300, 550);
    ctx.closePath();
    ctx.fillStyle = "#000";
    ctx.fill();
    ctx.restore();

    // Draw the wheel border
    ctx.save();
    ctx.beginPath();
    ctx.arc(250, 250, 250, 0, 2 * Math.PI);
    ctx.fillStyle = "#E4E4E4";
    ctx.fill();
    ctx.restore();

    for (let i = 0; i < availableNames.length; i++) {
        const startAngle = i * segmentAngle;
        const endAngle = startAngle + segmentAngle;
        ctx.beginPath();
        ctx.moveTo(250, 250);
        ctx.arc(250, 250, 240, startAngle, endAngle);
        ctx.closePath();

        // Alternate segment colors
        ctx.fillStyle = i % 2 === 0 ? "#00DE11" : "#E4E4E4";
        ctx.fill();
        ctx.strokeStyle = "#00DE11";
        ctx.lineWidth = 5;
        ctx.stroke();

        // Draw text
        ctx.save();
        ctx.translate(250 + Math.cos(startAngle + segmentAngle / 2) * 150, 250 + Math.sin(startAngle + segmentAngle / 2) * 150);
        ctx.rotate(startAngle + segmentAngle / 2 + Math.PI / 2);
        ctx.font = "18px 'Poppins', sans-serif";
        ctx.fillStyle = "#000";
        ctx.fillText(availableNames[i], -ctx.measureText(availableNames[i]).width / 2, 0);
        ctx.restore();
    }

    // Draw the center circle
    ctx.save();
    const gradient = ctx.createRadialGradient(250, 250, 0, 250, 250, 50);
    gradient.addColorStop(0, "#00DE11");
    gradient.addColorStop(1, "#E4E4E4");
    ctx.beginPath();
    ctx.arc(250, 250, 50, 0, 2 * Math.PI);
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.restore();
}

function drawArrow() {
    const arrow = document.createElement('div');
    arrow.classList.add('arrow');
    document.querySelector('.wheel-container').appendChild(arrow);
}

function spinWheel() {
    if (isSpinning || availableNames.length === 0) return;
    isSpinning = true;

    const randomIndex = Math.floor(Math.random() * availableNames.length);
    const targetAngle = (availableNames.length - randomIndex) * segmentAngle - segmentAngle / 2;
    const randomSpin = Math.floor(Math.random() * 360) + 1440; // At least 4 full rotations
    const finalAngle = randomSpin + targetAngle;

    wheelCanvas.style.transition = "transform 3s ease-out";
    wheelCanvas.style.transform = `rotate(${finalAngle}deg)`;

    setTimeout(() => {
        selectedIndex = randomIndex;
        drawWheel();
        displayResult(availableNames[randomIndex]);
        availableNames.splice(randomIndex, 1); // Remove the selected name from available names
        isSpinning = false;
        wheelCanvas.style.transition = "none";
        wheelCanvas.style.transform = `rotate(${targetAngle}rad)`;
    }, 3000);
}

function displayResult(selectedName) {
    modalResult.innerHTML = `Team: <strong>${currentTeam}</strong><br>Name: <strong>${selectedName}</strong>`;
    resultModal.style.display = "block";
    if (currentTeam === 'A') {
        teamA.push(selectedName);
        currentTeam = 'B';
        currentTeamHeading.innerHTML = "Next Pick: Team B";
    } else {
        teamB.push(selectedName);
        currentTeam = 'A';
        currentTeamHeading.innerHTML = "Next Pick: Team A";
    }

    if (teamA.length === 5 && teamB.length === 5) {
        modalResult.innerHTML += `<br>Finished`;
        spinButton.disabled = true;
    }
}

// Close the modal
closeModal.addEventListener("click", () => {
    resultModal.style.display = "none";
});

window.addEventListener("click", (event) => {
    if (event.target == resultModal) {
        resultModal.style.display = "none";
    }
});

spinButton.addEventListener("click", spinWheel);
drawWheel();
drawArrow();
