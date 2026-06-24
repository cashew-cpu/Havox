![Havox Header](https://img.shields.io/badge/Havox-Aim%20Assist-blue?style=for-the-badge)

# Havox - Minecraft Bedrock Aim Assist

An external aim assist tool for **Minecraft Bedrock Edition** that nudges your crosshair toward nearby players with each click.

## Features

✅ **Toggle On/Off** - Press Left Shift to enable/disable  
✅ **Per-Click Nudging** - One nudge per left mouse click  
✅ **Player Detection** - Simple proximity heuristic to find nearby players  
✅ **4-Block Range** - Detects targets within ~80 pixels  
✅ **5-Pixel Nudge** - Subtle but noticeable crosshair adjustment  
✅ **Smooth Operation** - Low-latency mouse control  

## Requirements

- **Node.js** (v14 or higher)
- **Windows, macOS, or Linux**
- **Minecraft Bedrock Edition** running

## Installation

1. Clone this repository:
```bash
git clone https://github.com/cashew-cpu/Havox.git
cd Havox
```

2. Install dependencies:
```bash
npm install
```

## Usage

1. Start the aim assist:
```bash
npm start
```

2. **Focus your Minecraft Bedrock window**

3. **Press Left Shift** to toggle aim assist on/off (you'll see a console message)

4. **Click on enemies** - The tool will nudge your crosshair toward the nearest player within 4 blocks

5. **Press Left Shift again** to disable when you're done

## Controls

| Key | Action |
|-----|--------|
| **Left Shift** | Toggle aim assist on/off |
| **Left Click** | Nudge crosshair toward nearest player (when enabled) |

## How It Works

1. **Keyboard Monitoring** - Listens for Left Shift key press to toggle
2. **Mouse Listening** - Detects left mouse button clicks
3. **Screenshot Capture** - Takes a quick screenshot to analyze pixels
4. **Player Detection** - Uses proximity heuristic to find players near crosshair:
   - Scans for skin tones and clothing colors
   - Clusters nearby pixels into entities
   - Returns closest player to crosshair
5. **Mouse Nudge** - Moves your cursor 5 pixels toward the detected player

## Configuration

Edit `index.js` to customize:

```javascript
// Change nudge strength (pixels)
aimAssist.nudgeStrength = 5;

// Modify scan radius (pixels from crosshair)
targetDetector.scanRadius = 80;

// Adjust detection sensitivity
targetDetector.entityColorThreshold = 50;
```

## Limitations

- **Detection Accuracy** - Relies on pixel analysis; may miss players in certain lighting
- **Platform Support** - Keyboard/mouse listening varies by OS
- **Bedrock Only** - Designed specifically for Bedrock Edition
- **Not a Mod** - Operates at OS level, not game level

## Troubleshooting

### Aim assist not triggering
- Ensure Minecraft window is in focus
- Check that Left Shift toggle shows "ENABLED" in console
- Verify left mouse button clicks are registering

### Mouse not responding
- Try restarting the program
- Ensure no other input hooks are interfering
- Check that robotjs is properly installed: `npm install robotjs`

### No targets detected
- Players must be within 4 blocks and visible on screen
- Lighting conditions affect detection accuracy
- Try getting closer to the target

## Disclaimer

This tool is for **single-player practice** and **private servers**. Using aim assist on **public multiplayer servers** may violate their terms of service. Use responsibly!

## Contributing

Found a bug or have an improvement? Feel free to open an issue or pull request!

## License

MIT - Feel free to use and modify for personal projects

---

**Made by cashew-cpu** | *Precision aiming, one click at a time*
