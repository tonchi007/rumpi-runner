// js/game.js

import { preloadAssets } from "../utils/preload.js";
import { InputHandler } from "../utils/input.js";
import { UI } from "../utils/ui.js";

const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

export class Game {
  constructor() {
    this.scale = 1;
    this.baseWidth = 2556;
    this.baseHeight = 1179;

    this.canvas = canvas;
    this.ctx = ctx;
    this.score = 0;
    this.isPaused = false;
    this.isGameOver = false;
    this.started = false;

    this.obstacles = [];
    this.decoratives = [];

    this.lastFrameTime = 0;
    this.images = {};
    this.sounds = {};

    this.signX = 0;
    this.signY = 0;

    this.input = new InputHandler();
    this.ui = new UI(this);
  }

  async init() {
    this.images = await preloadAssets("images");
    this.sounds = await preloadAssets("sounds");
    this.resize();
    this.setupPlayer();
    this.setupDecoratives();
    this.signX = this.canvas.width;
    this.signY = this.canvas.height - 720 * this.scale;
    this.started = true;
    this.loop(0);
  }

  resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const ratio = this.baseWidth / this.baseHeight;
    this.scale = (w / h > ratio ? h / this.baseHeight : w / this.baseWidth);
    if (w < 768) this.scale *= 1.5;
    this.canvas.width = this.baseWidth * this.scale;
    this.canvas.height = this.baseHeight * this.scale;
  }

  setupPlayer() {
    const s = this.scale;
    this.player = {
      x: 100 * s,
      y: canvas.height - 200 * s,
      w: 150 * s,
      h: 150 * s,
      dy: 0,
      gravity: 0.5 * s,
      jumpPower: -15 * s,
      grounded: false,
      jumps: 0,
      maxJumps: 2,
    };
  }

  setupDecoratives() {
    const s = this.scale;
    this.decoratives = [
      { img: this.images["cloud1.png"], x: canvas.width, y: 400 * s, speed: 2 * s },
      { img: this.images["cloud2.png"], x: canvas.width + 300 * s, y: 550 * s, speed: 3 * s },
      { img: this.images["cloud3.png"], x: canvas.width + 600 * s, y: 750 * s, speed: 1.5 * s },
    ];
  }

  update(deltaTime) {
    if (this.isPaused || this.isGameOver || !this.started) return;

    const p = this.player;

    this.input.onJump(() => {
      if (p.jumps < p.maxJumps) {
        p.dy = p.jumpPower;
        p.grounded = false;
        p.jumps++;
        this.sounds["jump.wav"].play();
      }
    });

    p.y += p.dy;
    p.dy += p.gravity;

    const groundY = this.canvas.height - 200 * this.scale;
    if (p.y >= groundY) {
      p.y = groundY;
      p.dy = 0;
      p.grounded = true;
      p.jumps = 0;
    }

    const signW = 600 * this.scale;
    this.signX -= 3 * this.scale;
    if (this.signX + signW < 0) this.signX = this.canvas.width;

    this.score += 1;
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.decoratives.forEach(deco => {
      const w = 100 * this.scale;
      const h = 70 * this.scale;
      this.ctx.drawImage(deco.img, deco.x, deco.y, w, h);
      deco.x -= deco.speed;
      if (deco.x + w < 0) {
        deco.x = this.canvas.width;
        deco.y = (400 + Math.random() * 100) * this.scale;
      }
    });

    const signImg = this.images["plane.png"];
    const signW = 600 * this.scale;
    const signH = 140 * this.scale;
    this.ctx.drawImage(signImg, this.signX, this.signY, signW, signH);

    this.ctx.fillStyle = "white";
    const groundY = this.canvas.height - 60 * this.scale;
    this.ctx.fillRect(0, groundY, this.canvas.width, 10 * this.scale);

    const frame = Math.floor(Date.now() / 150) % 2;
    const playerImg = this.images[frame === 0 ? "RUMPI.png" : "RUMPI2.png"];
    const p = this.player;
    this.ctx.drawImage(playerImg, p.x, p.y, p.w, p.h);

    this.ctx.fillStyle = "white";
    this.ctx.font = `${40 * this.scale}px Arial`;
    this.ctx.fillText("Score: " + this.score, 100 * this.scale, 50 * this.scale);
  }

  loop(timestamp) {
    const deltaTime = timestamp - this.lastFrameTime;
    this.lastFrameTime = timestamp;

    this.update(deltaTime);
    this.draw();

    requestAnimationFrame(this.loop.bind(this));
  }
}

const game = new Game();
window.addEventListener("load", () => game.init());
window.addEventListener("resize", () => game.resize());
