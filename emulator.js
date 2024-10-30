// emulator.js

// Define canvas and 2D context for the display
const canvas = document.getElementById("screen");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

// Screen dimensions for GBA
const SCREEN_WIDTH = 240;
const SCREEN_HEIGHT = 160;

// Memory buffer to represent the GBA screen
const screenBuffer = new Uint32Array(SCREEN_WIDTH * SCREEN_HEIGHT);

// Global variables
let romData = null;
let isRunning = false;

// Function to load ROM into memory
function loadROM() {
  const fileInput = document.getElementById("fileInput");
  fileInput.click();
}

// Function to handle file selection for ROM
function handleFileSelect(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      romData = new Uint8Array(e.target.result); // Load ROM as byte array
      startEmulator();
    };
    reader.readAsArrayBuffer(file);
  }
}

// Main emulator start function
function startEmulator() {
  if (!romData) {
    console.log("No ROM loaded");
    return;
  }
  isRunning = true;
  console.log("Emulator started with ROM size:", romData.length);
  emulatorLoop(); // Start the main loop
}

// Main emulator loop
function emulatorLoop() {
  if (!isRunning) return;

  // This is where the CPU, memory, and display emulation would go
  cpuCycle();
  updateDisplay();

  // Loop with a requestAnimationFrame for smoother rendering
  requestAnimationFrame(emulatorLoop);
}

// Placeholder for CPU cycle (ARM CPU emulation goes here)
function cpuCycle() {
  // Placeholder - In a full emulator, this would fetch, decode, and execute instructions
  // For now, we can just simulate changing some screen pixels
  for (let i = 0; i < screenBuffer.length; i++) {
    screenBuffer[i] = Math.random() * 0xffffff; // Random colors as placeholder
  }
}

// Update the display
function updateDisplay() {
  // Create an ImageData object from the screenBuffer
  const imageData = ctx.createImageData(SCREEN_WIDTH, SCREEN_HEIGHT);
  for (let i = 0; i < screenBuffer.length; i++) {
    const color = screenBuffer[i];
    imageData.data[i * 4] = (color >> 16) & 0xff; // Red
    imageData.data[i * 4 + 1] = (color >> 8) & 0xff; // Green
    imageData.data[i * 4 + 2] = color & 0xff; // Blue
    imageData.data[i * 4 + 3] = 0xff; // Alpha
  }

  // Draw the ImageData to the canvas
  ctx.putImageData(imageData, 0, 0);
}

// Control buttons (just a simple structure for start/pause)
document.addEventListener("keydown", function (event) {
  switch (event.key) {
    case "Enter":
      isRunning = !isRunning;
      if (isRunning) {
        emulatorLoop();
      }
      break;
    case "Escape":
      isRunning = false;
      break;
  }
});
