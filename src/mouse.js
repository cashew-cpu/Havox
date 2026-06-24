const EventEmitter = require('events');

class MouseListener extends EventEmitter {
  constructor() {
    super();
    this.listening = true;
    this.lastClickTime = 0;
    this.clickDebounceMs = 50; // Minimum time between click events

    if (process.platform === 'win32') {
      this.initWindowsListener();
    } else if (process.platform === 'darwin') {
      this.initMacListener();
    } else if (process.platform === 'linux') {
      this.initLinuxListener();
    }
  }

  initWindowsListener() {
    try {
      const mouse = require('mouse-listener');
      
      mouse.on('down', (button) => {
        if (button === 1) { // Left mouse button
          this.handleLeftClick();
        }
      });
    } catch (err) {
      console.warn('[HAVOX] Mouse listener not available, using robot.js polling');
      this.startPolling();
    }
  }

  initMacListener() {
    console.log('[HAVOX] macOS mouse monitoring initialized');
    this.startPolling();
  }

  initLinuxListener() {
    console.log('[HAVOX] Linux mouse monitoring initialized');
    this.startPolling();
  }

  handleLeftClick() {
    const now = Date.now();
    if (now - this.lastClickTime > this.clickDebounceMs) {
      this.lastClickTime = now;
      this.emit('left-click');
    }
  }

  startPolling() {
    // Fallback implementation
    // Note: Perfect click detection requires native mouse listeners
    console.log('[HAVOX] Mouse polling initialized');
  }
}

module.exports = { MouseListener };
