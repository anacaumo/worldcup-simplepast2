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
  text: "Qual destas frases está escrita corretamente no simple past?",
  options: [
    { text: "The players studyed the opponents.", score: 0, type: "Wrong", explanation: "'Study' termina em consoante + y. O correto é 'studied'." },

    { text: "The players studied the opponents.", score: 1, type: "Correct", explanation: "Correto! 'Study' vira 'studied' no Simple Past." },

    { text: "The players studyd the opponents.", score: 0, type: "Wrong", explanation: "Falta trocar o 'y' por 'i'. O correto é 'studied'." },

    { text: "The players studying the opponents.", score: 0, type: "Wrong", explanation: "'Studying' não está no Simple Past. A resposta correta era 'studied'." }
  ]
},

 {
  text: "Complete a frase no simple past: 'The coach ________ the plan.'",
  options: [
    { text: "changed", score: 1, type: "Correct", explanation: "Correto! Como 'change' já termina em 'e', acrescentamos apenas '-d'." },

    { text: "changeed", score: 0, type: "Wrong", explanation: "Não adicionamos '-ed' completo quando o verbo já termina em 'e'. O correto é 'changed'." },

    { text: "changged", score: 0, type: "Wrong", explanation: "Está sobrando letras. O correto é 'changed'." },

    { text: "change", score: 0, type: "Wrong", explanation: "'Change' está no presente. A resposta correta era 'changed'." }
  ]
},

 {
  text: "Qual destas palavras foi escrita corretamente no Simple Past?",
  options: [
    { text: "stoped", score: 0, type: "Wrong", explanation: "Em 'stop' dobramos a última consoante. O correto é 'stopped'." },

    { text: "stopped", score: 1, type: "Correct", explanation: "Correto! 'Stop' segue a regra de dobrar a última consoante antes de acrescentar '-ed'." },

    { text: "stop", score: 0, type: "Wrong", explanation: "'Stop' está no presente." },

    { text: "stoping", score: 0, type: "Wrong", explanation: "'Stoping' não está no Simple Past. A resposta correta era 'stopped'." }
  ]
},

 {
  text: "Observe a frase: 'The fans cried after the final.' O verbo 'cried' significa:",
  options: [
    { text: "tentaram", score: 0, type: "Wrong", explanation: "'Tried' significa tentaram. A resposta correta era 'choraram'." },

    { text: "comemoraram", score: 0, type: "Wrong", explanation: "'Celebrated' significa comemoraram. A resposta correta era 'choraram'." },

    { text: "choraram", score: 1, type: "Correct", explanation: "Correto! 'Cried' é o passado do verbo 'cry'." },

    { text: "gritaram", score: 0, type: "Wrong", explanation: "'Cried' significa choraram. A resposta correta era 'choraram'." }
  ]
},

  {
  text: "Qual destas frases está INCORRETA?",
  options: [
    { text: "The referee stopped the game.", score: 0, type: "Wrong", explanation: "Essa frase está correta." },

    { text: "The goalkeeper dropped the ball.", score: 0, type: "Wrong", explanation: "Essa frase está correta." },

    { text: "The coach planned the training.", score: 0, type: "Wrong", explanation: "Essa frase está correta." },

    { text: "The players win the match yesterday.", score: 1, type: "Correct", explanation: "Isso! O correto seria 'won'." }
  ]
},

  {
  text: "Qual destes verbos é IRREGULAR?",
  options: [
    { text: "changed", score: 0, type: "Wrong", explanation: "'Changed' é um verbo regular." },

    { text: "planned", score: 0, type: "Wrong", explanation: "'Planned' é um verbo regular." },

    { text: "took", score: 1, type: "Correct", explanation: "Correto! 'Took' é o passado irregular do verbo 'take'." },

    { text: "believed", score: 0, type: "Wrong", explanation: "'Believed' é um verbo regular." }
  ]
},

  {
  text: "Observe a frase: 'The coach believed in the team.' O verbo 'believed' significa:",
  options: [
    { text: "mudou", score: 0, type: "Wrong", explanation: "'Changed' significa mudou. A resposta correta era 'acreditou'." },

    { text: "acreditou", score: 1, type: "Correct", explanation: "Correto! 'Believed' é o passado do verbo 'believe' e significa 'acreditou'." },

    { text: "planejou", score: 0, type: "Wrong", explanation: "'Planned' significa planejou. A resposta correta era 'acreditou'." },

    { text: "venceu", score: 0, type: "Wrong", explanation: "'Won' significa venceu. A resposta correta era 'acreditou'." }
  ]
},

  
  {
  text: "Complete a frase no simple past: 'The players ________ water during the break.'",
  options: [
    { text: "drinked", score: 0, type: "Wrong", explanation: "'Drink' é um verbo irregular. O correto é 'drank'." },

    { text: "drank", score: 1, type: "Correct", explanation: "Correto! 'Drank' é o Simple Past do verbo 'drink'." },

    { text: "drinks", score: 0, type: "Wrong", explanation: "'Drinks' está no presente. A resposta correta era 'drank'." },

    { text: "drinking", score: 0, type: "Wrong", explanation: "'Drinking' indica uma ação em andamento. A resposta correta era 'drank'." }
  ]
},

{
  text: "Qual destas frases usa corretamente o verbo 'SAY' no simple past?",
  options: [
    { text: "The referee say the goal wasn't valid.", score: 0, type: "Wrong", explanation: "O correto seria 'said'." },

    { text: "The referee said the goal wasn't valid.", score: 1, type: "Correct", explanation: "Correto! 'Said' é o passado do verbo 'say'." },

    { text: "The referee sayed the goal wasn't valid.", score: 0, type: "Wrong", explanation: "'Sayed' não existe. O correto é 'said'." },

    { text: "The referee sayd the goal wasn't valid.", score: 0, type: "Wrong", explanation: "'Sayd' não existe. O correto é 'said'." }
  ]
},

 {
  text: "Observe a frase: 'The children enjoyed the game.' Qual palavra é um verbo no Simple Past?",
  options: [
    { text: "children", score: 0, type: "Wrong", explanation: "'Children' significa crianças. Não é o verbo." },

    { text: "game", score: 0, type: "Wrong", explanation: "'Game' significa jogo. Não está no Simple Past." },

    { text: "enjoyed", score: 1, type: "Correct", explanation: "Correto! 'Enjoyed' é o verbo no Simple Past." },

    { text: "the", score: 0, type: "Wrong", explanation: "'The' é apenas um artigo. A resposta correta era 'enjoyed'." }
  ]
},

 {
  text: "Qual destas palavras completa corretamente a frase no simple past? 'Vini Jr. ________ the ball from the defender.'",
  options: [
    { text: "taked", score: 0, type: "Wrong", explanation: "'Take' é irregular. O correto é 'took'." },

    { text: "took", score: 1, type: "Correct", explanation: "Correto! 'Took' é o passado do verbo 'take'." },

    { text: "takes", score: 0, type: "Wrong", explanation: "'Takes' está no presente." },

    { text: "taking", score: 0, type: "Wrong", explanation: "'Taking' indica uma ação em andamento." }
  ]
},

  
{
  text: "Observe a frase: 'The referee said the goal wasn't valid.' O verbo 'said' significa:",
  options: [
    { text: "parou", score: 0, type: "Wrong", explanation: "'Stopped' significa parou." },

    { text: "mudou", score: 0, type: "Wrong", explanation: "'Changed' significa mudou." },

    { text: "disse", score: 1, type: "Correct", explanation: "Correto! 'Said' é o passado do verbo 'say'." },

    { text: "venceu", score: 0, type: "Wrong", explanation: "'Won' significa venceu." }
  ]
},
  
{
  text: "Qual destas palavras foi escrita corretamente no simple past?",
  options: [
    { text: "cryed", score: 0, type: "Wrong", explanation: "'Cry' termina em consoante + y. O correto é 'cried'." },

    { text: "cried", score: 1, type: "Correct", explanation: "Correto! 'Cry' vira 'cried' no Simple Past." },

    { text: "cryd", score: 0, type: "Wrong", explanation: "Está faltando a letra 'i'." },

    { text: "cry", score: 0, type: "Wrong", explanation: "'Crying' não está no Simple Past." }
  ]
},

  {
  text: "Complete a frase no simple past: 'The reporter ________ a question.'",
  options: [
    { text: "asked", score: 1, type: "Correct", explanation: "Correto! 'Asked' é o Simple Past do verbo 'ask'." },

    { text: "askd", score: 0, type: "Wrong", explanation: "Está faltando a letra 'e'. O correto é 'asked'." },

    { text: "askked", score: 0, type: "Wrong", explanation: "'Askked' não existe. A resposta correta era 'asked'." },

    { text: "ask", score: 0, type: "Wrong", explanation: "'Asking' indica uma ação em andamento. A resposta correta era 'asked'." }
  ]
},

  {
  text: "Qual destas palavras significa 'adversários'?",
  options: [
    { text: "children", score: 0, type: "Wrong", explanation: "'Children' significa crianças." },

    { text: "opponents", score: 1, type: "Correct", explanation: "Correto! 'Opponents' significa adversários." },

    { text: "reporters", score: 0, type: "Wrong", explanation: "'Reporters' significa repórteres." },

    { text: "defenders", score: 0, type: "Wrong", explanation: "'Defenders' significa zagueiros." }
  ]
},

  {
  text: "Na frase 'The players tried their best.', qual palavra está no Simple Past?",
  options: [
    { text: "players", score: 0, type: "Wrong", explanation: "'Players' significa jogadores." },

    { text: "best", score: 0, type: "Wrong", explanation: "'Best' significa melhor." },

    { text: "tried", score: 1, type: "Correct", explanation: "Correto! 'Tried' é o verbo no Simple Past." },

    { text: "their", score: 0, type: "Wrong", explanation: "'Their' significa deles. Não é o verbo." }
  ]
},

  {
  text: "Observe a frase: 'The coach changed the plan.' Como sabemos que ela está falando do passado?",
  options: [
    { text: "Porque aparece a palavra 'coach'.", score: 0, type: "Wrong", explanation: "'Coach' significa treinador. Não indica tempo." },

    { text: "Porque o verbo está em 'changed'.", score: 1, type: "Correct", explanation: "Correto! 'Changed' está no Simple Past." },

    { text: "Porque aparece a palavra 'plan'.", score: 0, type: "Wrong", explanation: "'Plan' significa plano. Não indica tempo." },

    { text: "Porque aparece a palavra 'the'.", score: 0, type: "Wrong", explanation: "'The' é apenas um artigo." }
  ]
},

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
