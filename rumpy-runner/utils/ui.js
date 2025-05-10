// utils/ui.js

export class UI {
  constructor(game) {
    this.game = game;
    this.scoreForm = document.getElementById("score-form");
    this.playerNameInput = document.getElementById("player-name");
    this.scoresList = document.getElementById("scores-list");
    this.scoresUl = document.getElementById("scores-ul");
    this.startButton = document.getElementById("start-button");

    this.setupListeners();
  }

  setupListeners() {
    document.getElementById("save-score").onclick = () => this.saveScore();
    document.getElementById("cancel-score").onclick = () => this.cancelScore();
    document.getElementById("view-scores").onclick = () => this.showScores();
    document.getElementById("close-scores").onclick = () => this.hideScores();
    document.getElementById("reset-game").onclick = () => this.game.resetGame?.();
    this.startButton.onclick = () => this.startGame();

    this.playerNameInput.addEventListener("keydown", (e) => {
      if (e.code === "Enter") {
        e.preventDefault();
        this.saveScore();
      }
    });
  }

  startGame() {
    this.startButton.style.display = "none";
    this.game.started = true;
    this.game.isPaused = false;
  }

  showScoreForm() {
    this.scoreForm.style.display = "block";
  }

  saveScore() {
    const name = this.playerNameInput.value.trim();
    if (!name) return alert("Ingresa tu nombre.");

    const scores = JSON.parse(localStorage.getItem("scores")) || [];
    scores.push({ name, score: this.game.score });
    scores.sort((a, b) => b.score - a.score);
    localStorage.setItem("scores", JSON.stringify(scores.slice(0, 10)));

    this.scoreForm.style.display = "none";
    this.game.resetGame?.();
  }

  cancelScore() {
    this.scoreForm.style.display = "none";
    this.game.resetGame?.();
  }

  showScores() {
    const scores = JSON.parse(localStorage.getItem("scores")) || [];
    this.scoresUl.innerHTML = scores.length ? "" : "<li>No hay puntuaciones guardadas.</li>";
    scores.forEach((s, i) => {
      const li = document.createElement("li");
      li.textContent = `${i + 1}. ${s.name}: ${s.score}`;
      this.scoresUl.appendChild(li);
    });
    this.scoresList.style.display = "block";
  }

  hideScores() {
    this.scoresList.style.display = "none";
  }
}
