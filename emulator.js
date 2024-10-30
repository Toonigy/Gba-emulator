// emulator.js

// Canvas setup for display
const canvas = document.getElementById("screen");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

const SCREEN_WIDTH = 240;
const SCREEN_HEIGHT = 160;

// Screen buffer for graphics output
const screenBuffer = new Uint32Array(SCREEN_WIDTH * SCREEN_HEIGHT);

// Global variables
let isRunning = false;
let romLoaded = false;

// Load ROM file
function loadROM() {
  const fileInput = document.getElementById("fileInput");
  fileInput.click();
}

// Handle ROM file selection
function handleFileSelect(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const romData = new Uint8Array(e.target.result); // Load ROM as Uint8Array
      initializeMemory(romData); // Initialize memory with ROM data from memory.js
      romLoaded = true; // Mark ROM as loaded
      startEmulator();
    };
    reader.readAsArrayBuffer(file);
  }
}

// Start the emulator
function startEmulator() {
  if (!romLoaded) {
    console.log("No ROM loaded");
    return;
  }
  isRunning = true;
  emulatorLoop(); // Start the main emulator loop
}

// Main emulator loop
function emulatorLoop() {
  if (!isRunning) return;

  // Run a CPU cycle and update display
  cpuCycle();
  updateDisplay();

  // Request next frame
  requestAnimationFrame(emulatorLoop);
}

// CPU cycle (placeholder logic using memory read/write)
function cpuCycle() {
  // Example: Read from VRAM and write to RAM for demonstration
  const exampleValue = readMemory(0x06000000); // Read from VRAM in memory.js
  writeMemory(0x02000000, exampleValue); // Write to RAM in memory.js

  // Placeholder: Fill screen buffer with example value
  for (let i = 0; i < screenBuffer.length; i++) {
    screenBuffer[i] = exampleValue | (exampleValue << 8) | (exampleValue << 16);
  }
}

// Update display based on screen buffer content
function updateDisplay() {
  const imageData = ctx.createImageData(SCREEN_WIDTH, SCREEN_HEIGHT);
  for (let i = 0; i < screenBuffer.length; i++) {
    const color = screenBuffer[i];
    imageData.data[i * 4] = (color >> 16) & 0xff;    // Red
    imageData.data[i * 4 + 1] = (color >> 8) & 0xff; // Green
    imageData.data[i * 4 + 2] = color & 0xff;        // Blue
    imageData.data[i * 4 + 3] = 0xff;                // Alpha
  }
  ctx.putImageData(imageData, 0, 0);
}

// Control buttons to start/stop emulator
document.addEventListener("keydown", function (event) {
  switch (event.key) {
    case "Enter":
      isRunning = !isRunning;
      if (isRunning) emulatorLoop();
      break;
    case "Escape":
      isRunning = false;
      break;
  }
});
