const screenshot = require('screenshot-desktop');
const Jimp = require('jimp');

console.log('╔════════════════════════════════════╗');
console.log('║         HAVOX - Aim Assist         ║');
console.log('║    Minecraft Bedrock Edition       ║');
console.log('╠════════════════════════════════════╣');
console.log('║  Status: Starting...               ║');
console.log('╚════════════════════════════════════╝');
console.log('');

// Simple test - capture screenshot
async function test() {
  try {
    console.log('Testing screenshot capture...');
    const img = await screenshot({ format: 'png' });
    console.log('✓ Screenshot captured successfully');
    
    console.log('Testing image processing with Jimp...');
    const jimpImg = await Jimp.read(img);
    console.log('✓ Image processed successfully');
    console.log('');
    console.log('All systems ready! Havox is functioning.');
    console.log('(Keyboard/Mouse events not available on this system)');
  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  }
}

test();
