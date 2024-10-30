// emulator.js

// Canvas setup for display
const canvas = document.getElementById("screen");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

const SCREEN_WIDTH = 240;
const SCREEN_HEIGHT = 160;

// Create a screen buffer
const screenBuffer = new Uint32Array(SCREEN_WIDTH * SCREEN_HEIGHT);

// Memory setup
const MEMORY_SIZE = 0x02000000; // GBA has up to 32 MB addressable memory
let memory = new Uint8Array(MEMORY_SIZE);

// Global variables
let romData = null;
let isRunning = false;

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
      romData = new Uint8Array(e.target.result); // Load ROM into Uint8Array
      initializeMemory();
      startEmulator();
    };
    reader.readAsArrayBuffer(file);
  }
}

// Initialize memory with the loaded ROM
function initializeMemory() {
  if (romData) {
    // Load ROM into memory starting at 0x08000000 (GBA ROM region start)
    memory.set(romData, 0x08000000);
    console.log("ROM loaded into memory");
  }
}

// Start the emulator
function startEmulator() {
  if (!romData) {
    console.log("No ROM loaded");
    return;
  }
  isRunning = true;
  emulatorLoop();
}

// Main emulator loop
function emulatorLoop() {
  if (!isRunning) return;

  // Placeholder CPU cycle and graphics update
  cpuCycle();
  updateDisplay();

  // Loop with requestAnimationFrame
  requestAnimationFrame(emulatorLoop);
}

// Placeholder for CPU emulation
function cpuCycle() {
  // This is where CPU emulation would happen.
  // For now, just display ROM data as colors (very simplified)
  for (let i = 0; i < screenBuffer.length && i < romData.length; i++) {
    const color = romData[i] | (romData[i + 1] << 8) | (romData[i + 2] << 16);
    screenBuffer[i] = color;
  }
}

// Update display function
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

// Control buttons (simple start/pause)
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
