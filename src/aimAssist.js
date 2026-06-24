const robot = require('robotjs');

/**
 * Aim Assist: Handles mouse nudging toward targets
 */

class AimAssist {
  constructor() {
    this.nudgeStrength = 5; // pixels per nudge
    this.smoothing = 0.8; // Smoothing factor (0-1, lower = smoother)
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

      // Move mouse smoothly
      robot.moveMouse(Math.round(newX), Math.round(newY));

    } catch (error) {
      console.error('[HAVOX] Error during nudge:', error.message);
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

    robot.moveMouse(Math.round(newX), Math.round(newY));
  }
}

module.exports = { AimAssist };
