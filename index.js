const screenshot = require('screenshot-desktop');
const Jimp = require('jimp');
const { KeyboardListener } = require('./src/keyboard');
const { MouseListener } = require('./src/mouse');
const { TargetDetector } = require('./src/detector');
const { AimAssist } = require('./src/aimAssist');

let aimAssistEnabled = false;
let targetDetector = new TargetDetector();
let aimAssist = new AimAssist();

// Initialize keyboard listener for Left Shift toggle
const keyboard = new KeyboardListener();
keyboard.on('left-shift', () => {
  aimAssistEnabled = !aimAssistEnabled;
  console.log(`[HAVOX] Aim Assist ${aimAssistEnabled ? 'ENABLED' : 'DISABLED'}`);
});

// Initialize mouse listener for left click
const mouse = new MouseListener();
mouse.on('left-click', async () => {
  if (!aimAssistEnabled) return;

  try {
    // Get current mouse position (crosshair center)
    const currentPos = aimAssist.getMousePos();
    
    // Capture screenshot
    const img = await screenshot({ format: 'png' });
    const jimpImg = await Jimp.read(img);

    // Detect nearest player target near crosshair
    const target = targetDetector.findNearestPlayer(jimpImg, currentPos);

    if (target) {
      // Nudge mouse 5 pixels toward target
      aimAssist.nudgeTowardTarget(currentPos, target, 5);
      console.log(`[HAVOX] Nudged toward player at (${Math.round(target.x)}, ${Math.round(target.y)})`);
    } else {
      console.log('[HAVOX] No player target detected');
    }
  } catch (error) {
    console.error('[HAVOX] Error during aim assist:', error.message);
  }
});

console.log('╔════════════════════════════════════╗');
console.log('║         HAVOX - Aim Assist         ║');
console.log('║    Minecraft Bedrock Edition       ║');
console.log('╠════════════════════════════════════╣');
console.log('║  Left Shift: Toggle Aim Assist     ║');
console.log('║  Left Click: Nudge toward player   ║');
console.log('║  Range: 4 blocks (~80 pixels)      ║');
console.log('║  Nudge: 5 pixels per click         ║');
console.log('╚════════════════════════════════════╝');
console.log('');
console.log('Ready to assist! Make sure Minecraft is in focus.');
console.log('Press Left Shift to toggle, then click to aim assist.\n');
