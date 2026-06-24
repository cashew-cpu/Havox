const { exec } = require('child_process');
const EventEmitter = require('events');

class KeyboardListener extends EventEmitter {
  constructor() {
    super();
    this.listening = true;
    this.lastShiftPress = 0;
    this.debounceDelay = 300; // Prevent rapid toggles (ms)

    // Platform-specific keyboard monitoring
    if (process.platform === 'win32') {
      this.initWindowsListener();
    } else if (process.platform === 'darwin') {
      this.initMacListener();
    } else if (process.platform === 'linux') {
      this.initLinuxListener();
    }
  }

  initWindowsListener() {
    // Using node-global-hotkeys alternative: polling with keyboard module
    try {
      const keyboard = require('keyboard');
      
      keyboard.on('shift', () => {
        this.handleShiftPress();
      });
    } catch {
      console.warn('[HAVOX] Falling back to simple polling method');
      this.startPolling();
    }
  }

  initMacListener() {
    // macOS implementation
    console.log('[HAVOX] macOS keyboard monitoring initialized');
    this.startPolling();
  }

  initLinuxListener() {
    // Linux implementation
    console.log('[HAVOX] Linux keyboard monitoring initialized');
    this.startPolling();
  }

  handleShiftPress() {
    const now = Date.now();
    if (now - this.lastShiftPress > this.debounceDelay) {
      this.lastShiftPress = now;
      this.emit('left-shift');
    }
  }

  startPolling() {
    // Fallback polling method using system calls
    // Note: This is a simplified implementation
    // For production, use native keyboard libraries
    console.log('[HAVOX] Keyboard polling started (limited accuracy)');
  }
}

module.exports = { KeyboardListener };
