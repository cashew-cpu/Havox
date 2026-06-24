const os = require('os');

/**
 * Aim Assist: Handles mouse nudging toward targets
 */

class AimAssist {
  constructor() {
    this.nudgeStrength = 5; // pixels per nudge
    this.smoothing = 0.8; // Smoothing factor (0-1, lower = smoother)
  }

  /**
   * Get current mouse position (cross-platform)
   * @returns {Object} - {x, y} position
   */
  getMousePos() {
    // Use system commands to get mouse position
    // This is a fallback implementation
    // For production, use native mouse tracking
    return { x: 0, y: 0 };
  }

  /**
   * Nudge mouse toward target
   * @param {Object} currentPos - Current mouse position {x, y}
   * @param {Object} target - Target position {x, y}
   * @param {Number} nudgePixels - How many pixels to nudge (default 5)
   */
  nudgeTowardTarget(currentPos, target, nudgePixels = 5) {
    try {
      // Calculate direction vector
      const dx = target.x - currentPos.x;
      const dy = target.y - currentPos.y;

      // Calculate distance
      const distance = Math.hypot(dx, dy);

      if (distance === 0) return; // Already on target

      // Normalize direction
      const normX = dx / distance;
      const normY = dy / distance;

      // Calculate nudge amount (limited to nudgePixels)
      const nudgeDistance = Math.min(nudgePixels, distance);
      const newX = currentPos.x + normX * nudgeDistance;
      const newY = currentPos.y + normY * nudgeDistance;

      // Move mouse using system command
      this.moveMouseSystem(Math.round(newX), Math.round(newY));

    } catch (error) {
      console.error('[HAVOX] Error during nudge:', error.message);
    }
  }

  /**
   * Move mouse using system commands
   */
  moveMouseSystem(x, y) {
    const { execSync } = require('child_process');
    
    try {
      if (process.platform === 'win32') {
        // Windows: Use PowerShell to move mouse
        const ps = `Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.Cursor]::Position = New-Object System.Drawing.Point(${x}, ${y})`;
        execSync(`powershell -Command "${ps}"`, { stdio: 'ignore' });
      } else if (process.platform === 'darwin') {
        // macOS: Use osascript
        execSync(`osascript -e 'tell application "System Events" to set position of cursor to {${x}, ${y}}'`, { stdio: 'ignore' });
      } else if (process.platform === 'linux') {
        // Linux: Use xdotool
        execSync(`xdotool mousemove ${x} ${y}`, { stdio: 'ignore' });
      }
    } catch (error) {
      // Silently fail - system commands may not work in all environments
    }
  }

  /**
   * Alternative: Smooth tracking (for future enhancement)
   */
  smoothTrackToTarget(currentPos, target, speed = 2) {
    const dx = target.x - currentPos.x;
    const dy = target.y - currentPos.y;

    const newX = currentPos.x + dx * this.smoothing;
    const newY = currentPos.y + dy * this.smoothing;

    this.moveMouseSystem(Math.round(newX), Math.round(newY));
  }
}

module.exports = { AimAssist };
