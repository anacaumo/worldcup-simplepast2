let firstRound = true;

let answered = false;

let totalRounds = 0;

let currentRound = 1;

let feedbackRevealed = false;

let pendingFeedback = "";

let rankingActive = false;

/* ========= TEAMS ========= */

let teams = [];
let currentTeamIndex = 0;

/* ========= SETUP ========= */

function generateNameInputs() {
  let count = parseInt(document.getElementById("teamCount").value);
  let container = document.getElementById("teamNames");

  // Save existing names
  let existingNames = [];
  let inputs = container.querySelectorAll("input");

  inputs.forEach(input => {
    existingNames.push(input.value);
  });

  container.innerHTML = "";

  for (let i = 0; i < count; i++) {
    let input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Team " + (i + 1);
    input.id = "teamName" + i;

    // Restore previous values
    if (existingNames[i]) {
      input.value = existingNames[i];
    }

    // Character limit
    input.maxLength = 12;

    input.className = "team-input";

    container.appendChild(input);
  }
}

function startGame() {
  let count = parseInt(document.getElementById("teamCount").value);

  teams = [];

  for (let i = 0; i < count; i++) {
    let input = document.getElementById("teamName" + i);

    // 🛡️ safety check
    if (!input) {
      alert("Something went wrong. Try selecting the number of teams again.");
      return;
    }

    let nameInput = input.value;
    let teamName = nameInput.trim() !== "" ? nameInput : "Team " + (i + 1);

    teams.push({
      name: teamName,
      score: 0
    });

    totalRounds = parseInt(document.getElementById("roundCount").value);
currentRound = 1;
    
  }

  document.getElementById("setup").style.display = "none";
  document.getElementById("game").style.display = "block";

  updateScoreboard();

  // reset rotation properly
  currentTeamIndex = 0;
  firstRound = true;

  nextRound();
}
/* ========= QUESTIONS ========= */

let allQuestions = [
  {
  text: "Your friend returned your hoodie with a stain. What do you say?",
  options: [
    { text: "What did you do to my hoodie?!", score: 0, type: "too direct", explanation: "Direct accusation ('you') with no softener or question. Sounds aggressive." },

    { text: "Hey, I think there’s a stain here—do you know what happened?", score: 1, type: "appropriate", explanation: "Uses softener ('I think') + indirect question. reduces blame and keeps it friendly." },

    { text: "There’s a stain on this.", score: 0.5, type: "acceptable", explanation: "Clear statement, but no softener or question. More direct." },

    { text: "It's fine.", score: 0, type: "too indirect", explanation: "Avoids the issue completely. Lacks request or clarification." }
  ]
},

  {
  text: "You are late to meet your friend. What do you say?",
  options: [
    { text: "I'm late.", score: 0, type: "too blunt", explanation: "States the problem, but no apology or repair strategy." },

    { text: "Sorry I'm late! I'll be there in 10 minutes.", score: 1, type: "appropriate", explanation: "Uses apology ('sorry') + repair (time info). Socially appropriate." },

    { text: "Hey, I’m running a bit late.", score: 0.5, type: "acceptable", explanation: "Uses softener ('a bit'), but lacks full repair (no timing or solution)." },

    { text: "Relax.", score: 0, type: "dismissive", explanation: "Dismisses the other person’s perspective. No apology or responsibility." }
  ]
},

  {
  text: "You want extra time for an assignment. What do you say?",
  options: [
    { text: "Give me more time.", score: 0, type: "too direct", explanation: "Direct command. Lacks modal or softener." },

    { text: "Could I possibly have an extra day to finish this?", score: 1, type: "appropriate", explanation: "Uses modal ('could') + softener ('possibly'). Polite and indirect request." },

    { text: "Is it okay if I turn it in late?", score: 0.5, type: "acceptable", explanation: "Polite question, but lacks additional mitigation (no softener or justification)." },

    { text: "I didn’t do it.", score: 0, type: "avoidance", explanation: "States problem, but no request or solution." }
  ]
},

  {
  text: "You think your teacher graded you unfairly. What do you say?",
  options: [
    { text: "This grade is wrong.", score: 0, type: "too direct", explanation: "Direct statement with no softener. Threatens face." },

    { text: "I was wondering if we could review my grade together.", score: 1, type: "appropriate", explanation: "Uses intro phrase ('I was wondering if') + collaborative tone. Reduces imposition." },

    { text: "I think there might be a mistake.", score: 0.5, type: "acceptable", explanation: "Uses softeners ('I think', 'might'), but lacks collaboration." },

    { text: "You made a mistake.", score: 0, type: "accusatory", explanation: "Direct accusation ('you'). Confrontational." }
  ]
},

  {
  text: "A server brought you the wrong drink. What do you say?",
  options: [
    { text: "This is wrong.", score: 0, type: "too direct", explanation: "Blunt statement. Lacks softener or request." },

    { text: "Excuse me, I think I ordered a Sprite.", score: 1, type: "appropriate", explanation: "Uses softener ('I think') + indirect correction. Polite." },

    { text: "I asked for something else.", score: 0.5, type: "acceptable", explanation: "Clear, but lacks softener. Direct and blunt." },

    { text: "Whatever.", score: 0, type: "dismissive", explanation: "Dismissive response. No communication strategy." }
  ]
},

  {
  text: "You didn’t understand the homework. What do you say?",
  options: [
    { text: "I don't get it.", score: 0, type: "too blunt", explanation: "Direct statement. No modal or softener." },

    { text: "Could you explain it again, please?", score: 1, type: "appropriate", explanation: "Uses modal ('could') + 'please'. Polite request." },

    { text: "I’m not sure I understood. Could you go over it again?", score: 1, type: "appropriate", explanation: "Takes responsibility + uses modal ('could'). Strong face-saving strategy." },

    { text: "This makes no sense.", score: 0, type: "negative", explanation: "Critical statement. Threatens listener’s face." }
  ]
},

  {
  text: "It is 11:30 PM and your neighbor is playing loud music. What do you say?",
  options: [
    { text: "Turn that music down right now!", score: 0, type: "too direct", explanation: "Direct command. No softener or modal." },

    { text: "Sorry to bother you, but it’s quite loud and I have an exam tomorrow. Would it be possible to lower it?", score: 1, type: "appropriate", explanation: "Uses apology + softener ('quite') + modal ('would it be possible'). Very polite." },

    { text: "It’s really loud.", score: 0.5, type: "acceptable", explanation: "States problem, but no request or softener." },

    { text: "You’re being inconsiderate.", score: 0, type: "too harsh", explanation: "Judgment ('you'). Escalates conflict." }
  ]
},

  {
  text: "You are at a restaurant and your fork is dirty. What do you say?",
  options: [
    { text: "This is dirty. Bring me another one.", score: 0, type: "too direct", explanation: "Blunt statement + command. No softener or modal." },

    { text: "Excuse me, there seems to be a slight problem with this fork. Could I get another one?", score: 1, type: "appropriate", explanation: "Uses 'there seems to be' + 'slight' + modal ('could'). Highly mitigated request." },

    { text: "I think this isn’t clean. Could I have another one?", score: 0.5, type: "appropriate", explanation: "Uses softener ('I think') + modal ('could')." },

    { text: "Um… this fork…", score: 0, type: "too indirect", explanation: "Too vague. No clear request." }
  ]
},

  {
  text: "Your friend is 30 minutes late and hasn’t texted you. What do you say?",
  options: [
    { text: "You’re always late. It’s so annoying.", score: 0, type: "too harsh", explanation: "Uses 'always' + direct criticism. Escalates conflict." },

    { text: "Hey, I’ve been waiting for a bit—is everything okay?", score: 1, type: "appropriate", explanation: "Uses softener ('a bit') + indirect concern. Polite and non-accusatory." },

    { text: "You’re late.", score: 0.5, type: "acceptable", explanation: "Clear, but no softener or question. More direct." },

    { text: "Whatever.", score: 0, type: "dismissive", explanation: "Avoids communication." }
  ]
},

  {
  text: "You want your teacher to check one of your answers. What do you say?",
  options: [
    { text: "Check this.", score: 0, type: "too direct", explanation: "Command. No modal or softener." },

    { text: "I was wondering if you could double-check this answer for me?", score: 1, type: "appropriate", explanation: "Uses intro phrase + modal ('could'). Very polite request." },

    { text: "Can you check this?", score: 0.5, type: "acceptable", explanation: "Uses modal ('can'), but less formal/softened." },

    { text: "This is wrong, right?", score: 0, type: "problematic", explanation: "Pushes the teacher. Sounds leading or insecure." }
  ]
},

  {
  text: "Your food arrives, but it is cold. What do you say?",
  options: [
    { text: "This is cold. Take it back.", score: 0, type: "too direct", explanation: "Blunt statement + command. No softening." },

    { text: "Actually, I think this is a little cold. Could I get a new one?", score: 1, type: "appropriate", explanation: "Uses softener ('I think', 'a little') + modal ('could')." },

    { text: "This is kind of cold.", score: 0.5, type: "acceptable", explanation: "Uses softener ('kind of'), but no request." },

    { text: "Never mind.", score: 0, type: "avoidance", explanation: "Avoids the issue. No communication." }
  ]
},

  {
  text: "A classmate keeps interrupting you while you're speaking. What do you say?",
  options: [
    { text: "Stop interrupting me.", score: 0, type: "too direct", explanation: "Direct command. No softener." },

    { text: "Hey, could I finish what I was saying?", score: 1, type: "appropriate", explanation: "Uses modal ('could'). Assertive but not rude." },

    { text: "Let me talk.", score: 0.5, type: "acceptable", explanation: "Clear, but no softener. Very direct." },

    { text: "You never listen.", score: 0, type: "too harsh", explanation: "Uses 'never'. Overgeneralization and criticism." }
  ]
},

  {
  text: "The classroom is very cold. What do you say to your teacher?",
  options: [
    { text: "It's cold. Turn on the heat.", score: 0, type: "too direct", explanation: "Command. No mitigation." },

    { text: "I'm sorry, but the room is a bit cold. Could we turn on the heat?", score: 1, type: "appropriate", explanation: "Uses softener ('a bit') + modal ('could') + apology." },

    { text: "It's kind of cold.", score: 0.5, type: "acceptable", explanation: "Uses softener, but no request." },

    { text: "This room is freezing.", score: 0, type: "too strong", explanation: "Exaggeration + no request." }
  ]
}, 

  {
  text: "A classmate in your group is not contributing. What do you say?",
  options: [
    { text: "You’re not doing anything.", score: 0, type: "too direct", explanation: "Direct accusation. Confrontational." },

    { text: "Hey, could we divide the work a bit differently so everyone has a part?", score: 1, type: "appropriate", explanation: "Uses modal ('could') + softener ('a bit'). Indirect and collaborative." },

    { text: "We need more help.", score: 0.5, type: "acceptable", explanation: "Indirect, but not very specific." },

    { text: "You never help.", score: 0, type: "too harsh", explanation: "Uses 'never'. Overgeneralization." }
  ]
}, 

  {
  text: "Your friend is talking loudly during a movie. What do you say?",
  options: [
    { text: "Be quiet.", score: 0, type: "too direct", explanation: "Command. No softener." },

    { text: "Hey, could you lower your voice a bit?", score: 1, type: "appropriate", explanation: "Uses modal ('could') + softener ('a bit')." },

    { text: "You’re very loud.", score: 0.5, type: "acceptable", explanation: "Clear, but no softener or request." },

    { text: "You’re ruining this.", score: 0, type: "too harsh", explanation: "Blames the person. Escalates." }
  ]
},

  {
  text: "You need to email your teacher because your assignment is late. What do you say?",
  options: [
    { text: "I'm submitting it late.", score: 0, type: "too blunt", explanation: "No apology or mitigation." },

    { text: "I'm sorry for the delay. I was wondering if I could still submit the assignment.", score: 1, type: "appropriate", explanation: "Uses apology + intro phrase + modal. Very appropriate." },

    { text: "Can I still send it?", score: 0.5, type: "acceptable", explanation: "Uses modal ('can'), but lacks apology and formality." },

    { text: "This deadline was unfair.", score: 0, type: "confrontational", explanation: "Criticizes authority. Inappropriate tone." }
  ]
},

  {
  text: "You receive a bill that seems too high. What do you say?",
  options: [
    { text: "This is wrong.", score: 0, type: "too direct", explanation: "Blunt statement. No softener." },

    { text: "Excuse me, I think there might be a mistake on the bill.", score: 1, type: "appropriate", explanation: "Uses softeners ('I think', 'might'). Polite correction." },

    { text: "This seems high.", score: 0.5, type: "acceptable", explanation: "Uses softener ('seems'), but no clear request." },

    { text: "You overcharged me.", score: 0, type: "accusatory", explanation: "Direct accusation. Confrontational." }
  ]
}
];


/* ========= GAME ========= */

let remainingQuestions = allQuestions.slice();
let currentQuestion = null;

/* ========= HELPERS ========= */

function shuffleArray(array) {
  let shuffled = array.slice();
  for (let i = shuffled.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}


function updateScoreboard() {
  let container = document.getElementById("scoreboard");
  container.innerHTML = "";

  teams.forEach((team, index) => {
    let div = document.createElement("div");
    div.className = "team-box";

    // Highlight current team
    if (index === currentTeamIndex) {
      div.classList.add("active-team");
    }

    div.innerHTML = `
      <div class="team-name">${team.name}</div>
      <div class="team-score">${team.score}</div>
    `;

    container.appendChild(div);
  });
}

/* ========= ROUND ========= */

function nextRound() {

if (currentRound > totalRounds) {
  showRankingScreen();
  return;
}

  answered = false;
  
let nextBtn = document.getElementById("nextBtn");

nextBtn.disabled = true;
nextBtn.style.opacity = "0.5";
nextBtn.style.cursor = "not-allowed";
  
  setTheme("purple");

  // ✅ correct team rotation logic
  if (!firstRound) {
    currentTeamIndex++;
    if (currentTeamIndex >= teams.length) {
      currentTeamIndex = 0;
    }
  } else {
    firstRound = false;
  }

  let index = Math.floor(Math.random() * remainingQuestions.length);
  currentQuestion = remainingQuestions[index];

  document.getElementById("situation").innerText = currentQuestion.text;

  let optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";

  let shuffledOptions = shuffleArray(currentQuestion.options);

  shuffledOptions.forEach(option => {
    let btn = document.createElement("button");
    btn.className = "option";
    btn.innerText = option.text;

    btn.onclick = function (event) {
  handleAnswer(option, event);
};

    optionsDiv.appendChild(btn);
  });




  let feedbackBox = document.getElementById("feedback");

feedbackBox.innerText = "Discuss and choose an answer.";
feedbackBox.style.color = "#666";
feedbackBox.style.cursor = "default"; 
feedbackBox.onclick = null;


  updateScoreboard(); // ✅ keeps highlight in sync


  updateRoundDisplay();
}


/* ========= ANSWER ========= */

function handleAnswer(option, event) {
  if (answered) return;

  answered = true;

  // click animation on selected option
let clickedBtn = event.target;
  clickedBtn.classList.add("selected");

clickedBtn.style.transform = "scale(0.92)";

setTimeout(() => {
  clickedBtn.style.transform = "scale(1)";
}, 120);

  clickedBtn.style.filter = "brightness(0.95)";

  

  document.querySelectorAll(".option").forEach(btn => {
    btn.disabled = true;
  });

  teams[currentTeamIndex].score += option.score;

  let feedbackText = "[" + option.type.toUpperCase() + "]\n" + option.explanation;

  // ALWAYS remove question after answering
remainingQuestions = remainingQuestions.filter(q => q !== currentQuestion);

if (option.score === 1) {
  updateScoreboard();
  setTheme("green");
  feedbackText = "✅ " + feedbackText;

} else if (option.score === 0.5) {
  updateScoreboard();
  setTheme("yellow");
  feedbackText = "🟡 " + feedbackText;

} else {
  updateScoreboard();
  setTheme("red");
  feedbackText = "❌ " + feedbackText;
}

  pendingFeedback = feedbackText;
feedbackRevealed = false;

let feedbackBox = document.getElementById("feedback");

feedbackBox.innerText = "Click here to reveal feedback.";
feedbackBox.style.color = "#666";

feedbackBox.style.cursor = "pointer";   
feedbackBox.onclick = revealFeedback;  
feedbackBox.classList.add("clickable");


  updateScoreboard();

let nextBtn = document.getElementById("nextBtn");

nextBtn.disabled = false;
nextBtn.style.opacity = "1";
nextBtn.style.cursor = "pointer";

  // track rounds AFTER a team finishes answering
if (currentTeamIndex === teams.length - 1) {
  currentRound++;
}
}

/* ========= RESTART ========= */

function restartGame() {
  setTheme("purple");

  teams.forEach(team => team.score = 0);

  remainingQuestions = allQuestions.slice();
  currentTeamIndex = 0;
  currentRound = 1;
  firstRound = true;

  // hide everything properly
  document.getElementById("game").style.display = "none";
  document.getElementById("ranking").style.display = "none";
  document.getElementById("setup").style.display = "block";

  // reset ranking UI
  document.getElementById("rankingList").innerHTML = "";

  updateScoreboard();
}
/* ========= INIT ========= */

window.onload = function () {
  generateNameInputs();
  updateRoundOptions();
};


/* ========= HOW MANY ROUNDS ========= */
function updateRoundOptions() {
  let teamCount = parseInt(document.getElementById("teamCount").value);
  let totalQuestions = allQuestions.length;

  let maxRounds = Math.floor(totalQuestions / teamCount);

  let select = document.getElementById("roundCount");
  select.innerHTML = "";

  for (let i = 1; i <= maxRounds; i++) {
    let option = document.createElement("option");
    option.value = i;
    option.text = i + " round" + (i > 1 ? "s" : "");
    select.appendChild(option);
  }
}

/* ========= ROUND DISPLAY ========= */

function updateRoundDisplay() {
  document.getElementById("roundDisplay").innerText =
    "Round " + currentRound + " of " + totalRounds;
}

/* ========= THEME COLORS ========= */

function setTheme(color) {
  const body = document.body;
  const box = document.querySelector(".game-box");
  const dialogue = document.querySelector(".dialogue-box");
  const buttons = document.querySelectorAll(".option");
 const nextBtn = document.getElementById("nextBtn");
  const active = document.querySelector(".active-team");

  let colors = {
    purple: { border: "#8c7ae6", bg: "#f4f1ff", button: "#dcd6ff" },
    green:  { border: "#2ecc71", bg: "#eafaf1", button: "#d5f5e3" },
    yellow: { border: "#f1c40f", bg: "#fff9e6", button: "#fff3cd" },
    red:    { border: "#ff8a8a", bg: "#ffe0e0", button: "#ffd6d6" }
  };

  let c = colors[color];

  // 🌈 BACKGROUND (whole page)
  body.style.backgroundColor = c.bg;

  // 🎮 main box
  box.style.borderColor = c.border;
  box.style.boxShadow = `6px 6px 0px ${c.border}`;

  // 💬 question box
  dialogue.style.borderColor = c.border;

  // 🎯 options
  buttons.forEach(btn => {
    btn.style.backgroundColor = c.button;
    btn.style.borderColor = c.border;
  });

  // ▶️ next button
  if (nextBtn) {
    nextBtn.style.backgroundColor = c.button;
    nextBtn.style.borderColor = c.border;
  }

  // 🧑‍🤝‍🧑 active team
// 🎯 force active team styling AFTER render
setTimeout(() => {
  const active = document.querySelector(".active-team");
  if (active) {
    active.style.border = `2px solid ${c.border}`;
    active.style.backgroundColor = c.bg;
  }
}, 0);

  // 🏆 scoreboard boxes (important!)
  document.querySelectorAll(".team-box").forEach(box => {
    box.style.borderColor = "#ccc"; // reset first
  });

  if (active) {
    active.style.borderColor = c.border;
  }

  //THEME ANIMATIONS
box.classList.remove("theme-flash");
void box.offsetWidth;
box.classList.add("theme-flash");
  
}

//REVEAL FEEDBACK ON CLICK

function revealFeedback() {
  if (feedbackRevealed) return;

  let feedbackBox = document.getElementById("feedback");

  feedbackBox.innerText = pendingFeedback;
  feedbackBox.style.color = "#000";

  feedbackRevealed = true;

  feedbackBox.style.cursor = "default";
feedbackBox.onclick = null;
  feedbackBox.classList.remove("clickable");
}

//RANKING SCREEN

/* ========= RANKING SCREEN ========= */

let ranking = [];
let revealIndex = 0;

function showRankingScreen() {
  setTheme("purple");

  document.getElementById("game").style.display = "none";
  document.getElementById("ranking").style.display = "block";

  let container = document.getElementById("rankingList");
  container.innerHTML = "";

  ranking = [...teams].sort((a, b) => {
  if (b.score !== a.score) return b.score - a.score;
  return a.name.localeCompare(b.name); // tie breaker
});

  revealIndex = ranking.length - 1;

 container.innerHTML = `
  <button id="revealBtn">Click to reveal ranking</button>
`;

  // ✅ USE GLOBAL variable
  rankingActive = true;

  document.getElementById("revealBtn").onclick = function () {
  if (!rankingActive) return;

  // remove button after first click
  this.remove();

  revealNextRank();
};
}

function revealNextRank() {
  let container = document.getElementById("rankingList");

  let hint = document.querySelector(".reveal-hint");
  if (hint) hint.remove();

  if (revealIndex === 0) {
  // next reveal will be winner, so prepare button AFTER
}


 let currentScore = ranking[revealIndex].score;
  let originalRanking = [...ranking];

// get ALL teams with this score
let group = ranking.filter(t => t.score === currentScore);

// remove them from ranking so they aren't reused
ranking = ranking.filter(t => t.score !== currentScore);

// update revealIndex properly
revealIndex = ranking.length - 1;

// determine position
let higherScores = originalRanking.filter(t => t.score > currentScore).length;
let position = higherScores + 1;

// render ALL teams in group
group.forEach(team => {
  let div = document.createElement("div");
  div.className = "rank-card reveal";

  let display = "";

  if (position === 1) display = "🥇";
  else if (position === 2) display = "🥈";
  else if (position === 3) display = "🥉";
  else display = position + (position === 4 ? "th" : "th");

  if (group.length > 1) display += " (tie)";

  div.innerHTML = `
    <div class="rank-emoji">${display}</div>
    <div class="rank-name">${team.name}</div>
    <div class="rank-score">${team.score} pts</div>
  `;

  // medal styling
  if (position === 1) {
  div.classList.add("winner", "gold");
  div.style.background = "#fff7cc";
  div.style.borderColor = "#e1b700";
}
else if (position === 2) {
  div.classList.add("silver");
  div.style.background = "#f2f2f2";
  div.style.borderColor = "#aaa";
}
else if (position === 3) {
  div.classList.add("bronze");
  div.style.background = "#f8e1d4";
  div.style.borderColor = "#c97c4a";
}

  container.prepend(div);

  div.onclick = function () {
  if (!rankingActive) return;

  div.onclick = null;

  setTimeout(() => {
    revealNextRank();
  }, position === 1 ? 1200 : 700);
};

  
});

// 🎉 winner effects (only once)
if (position === 1) {
  setTimeout(() => launchConfetti(), 400);

  setTimeout(() => {
    if (!document.getElementById("playAgainBtn")) {
      let btn = document.createElement("button");
      btn.id = "playAgainBtn";
      btn.innerText = "Restart Game";
      btn.onclick = restartGame;
      btn.style.marginTop = "20px";

      container.appendChild(btn);
    }
  }, 600);
}
}

function getRankEmoji(index, total) {
  if (index === 0) return "🥇";
  if (index === 1) return "🥈";
  if (index === 2) return "🥉";
  if (index === 3) return "🎖️";
  if (index === 4) return "👏";
  return "⭐";
}


//CONFETTI FOR WINNER
function launchConfetti() {
  for (let i = 0; i < 40; i++) {
    let confetti = document.createElement("div");
    confetti.className = "confetti";

    confetti.style.left = Math.random() * 100 + "%";
    confetti.style.animationDuration = (Math.random() * 1 + 1) + "s";

    document.body.appendChild(confetti);

    setTimeout(() => confetti.remove(), 2000);
  }
}
