// Select the search bar input and button
const searchInput = document.querySelector("#search");
const searchButton = document.querySelector("button");

// Select all circles (Easy, Medium, Hard, Total)
const easyCircle = document.querySelector(".easy.circle");
const mediumCircle = document.querySelector(".medium.circle");
const hardCircle = document.querySelector(".hard.circle");
const totalCircle = document.querySelector(".total.circle");

// Select the acceptance rate and global rank
const acceptanceRate = document.querySelector(".submission-rate .count");
const globalRank = document.querySelector(".ranking .count");

// Select stats (Easy, Medium, Hard, Total counts)
const easyStat = document.querySelector(".stat .easy .count");
const mediumStat = document.querySelector(".stat .medium .count");
const hardStat = document.querySelector(".stat .hard .count");
const totalStat = document.querySelector(".stat .total .count");

let all = document.querySelector(".all");

// Function to animate numbers
function animateNumber(element, endValue, suffix = "") {
  let startValue = 0;
  let duration = 1500; // Animation duration in milliseconds
  let stepTime = 50; // Time per step in milliseconds
  let steps = Math.ceil(duration / stepTime);
  let increment = endValue / steps;

  let interval = setInterval(() => {
    startValue += increment;
    if (startValue >= endValue) {
      clearInterval(interval);
      startValue = endValue;
    }
    element.textContent = `${Math.floor(startValue)}${suffix}`;
  }, stepTime);
}

// Function to animate circle progress bars
function animateCircle(
  circleElement,
  solved,
  total,
  solvedColor,
  unsolvedColor
) {
  let duration = 1500; // Animation duration in milliseconds
  let stepTime = 50; // Time per step in milliseconds
  let steps = Math.ceil(duration / stepTime);
  let increment = ((solved / total) * 100) / steps;

  let currentPercentage = 0;
  let currentSolved = 0;
  let currentUnsolved = total;

  // Create labels for solved and unsolved numbers
  const solvedLabel = document.createElement("div");
  const unsolvedLabel = document.createElement("div");

  solvedLabel.classList.add("circle-label", "solved-label");
  unsolvedLabel.classList.add("circle-label", "unsolved-label");

  solvedLabel.style.cssText = `
        position: absolute;
        top: 30%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 14px;
        color: #000;
        opacity: 0;
        transition: opacity 0.3s;
    `;

  unsolvedLabel.style.cssText = `
        position: absolute;
        bottom: 30%;
        left: 50%;
        transform: translate(-50%, 50%);
        font-size: 14px;
        color: #000;
        opacity: 0;
        transition: opacity 0.3s;
    `;

  circleElement.appendChild(solvedLabel);
  circleElement.appendChild(unsolvedLabel);

  let interval = setInterval(() => {
    currentPercentage += increment;
    currentSolved += solved / steps;
    currentUnsolved -= total / steps;

    if (currentPercentage >= (solved / total) * 100) {
      clearInterval(interval);
      currentPercentage = (solved / total) * 100;
      currentSolved = solved;
      currentUnsolved = total - solved;

      // Set final values to labels
      solvedLabel.textContent = `Solved: ${currentSolved}`;
      unsolvedLabel.textContent = `Unsolved: ${currentUnsolved}`;
    }

    // Update circle gradient
    circleElement.style.background = `conic-gradient(${solvedColor} ${currentPercentage}%, ${unsolvedColor} ${currentPercentage}% 100%)`;
  }, stepTime);

  // Add hover effect to show labels after animation
  circleElement.addEventListener("mouseover", () => {
    if (currentPercentage >= (solved / total) * 100) {
      solvedLabel.style.opacity = "1";
      unsolvedLabel.style.opacity = "1";
    }
  });

  circleElement.addEventListener("mouseout", () => {
    solvedLabel.style.opacity = "0";
    unsolvedLabel.style.opacity = "0";
  });
}

async function inputs() {
  return new Promise((resolve) => {
    searchButton.addEventListener("click", () => {
      let inp = searchInput.value.trim();
      resolve(inp);
    });
  });
}

async function scraper() {
  try {
    let inp = await inputs();
    let url = `https://leetcode-stats-api.herokuapp.com/${inp}`;
    let response = await axios.get(url);
    let data = response.data;
    console.log(data);

    // Show the stats section once data is loaded
    all.classList.remove("hidden");

    // Extracting required data
    let totaleasy = data.totalEasy;
    let totalmedium = data.totalMedium;
    let totalhard = data.totalHard;
    let total = data.totalQuestions;
    let easy = data.easySolved;
    let medium = data.mediumSolved;
    let hard = data.hardSolved;
    let totalSolved = data.totalSolved;

    // Animate the stats counts
    animateNumber(acceptanceRate, data.acceptanceRate, "%");
    animateNumber(globalRank, data.ranking);
    animateNumber(easyStat, easy);
    animateNumber(mediumStat, medium);
    animateNumber(hardStat, hard);
    animateNumber(totalStat, totalSolved);

    // Animate circle progress bars
    animateCircle(easyCircle, easy, totaleasy, "#3498DB", "#AED6F1"); // Blue
    animateCircle(mediumCircle, medium, totalmedium, "#F39C12", "#FAD7A0"); // Yellow
    animateCircle(hardCircle, hard, totalhard, "#E74C3C", "#F5B7B1"); // Red
    animateCircle(totalCircle, totalSolved, total, "#2ECC71", "#A9DFBF"); // Green
  } catch (error) {
    console.log("error", error);
  }
}

scraper();
