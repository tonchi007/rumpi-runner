// utils/input.js

export class InputHandler {
  constructor() {
    this.keys = new Set();
    this.jumpCallback = null;
    this.resetCallback = null;
    this.saveCallback = null;
    this.cancelCallback = null;
    this.pauseCallback = null;

    window.addEventListener("keydown", (e) => this.handleKeyDown(e));
    window.addEventListener("touchstart", () => this.handleJump());
  }

  handleKeyDown(event) {
    switch (event.code) {
      case "Space":
        this.handleJump();
        break;
      case "KeyR":
        if (this.resetCallback) this.resetCallback();
        break;
      case "Enter":
        if (this.saveCallback) this.saveCallback();
        break;
      case "Escape":
        if (this.cancelCallback) this.cancelCallback();
        break;
      case "KeyP":
        if (this.pauseCallback) this.pauseCallback();
        break;
    }
  }

  handleJump() {
    if (this.jumpCallback) this.jumpCallback();
  }

  onJump(callback) {
    this.jumpCallback = callback;
  }

  onReset(callback) {
    this.resetCallback = callback;
  }

  onSave(callback) {
    this.saveCallback = callback;
  }

  onCancel(callback) {
    this.cancelCallback = callback;
  }

  onPause(callback) {
    this.pauseCallback = callback;
  }
}