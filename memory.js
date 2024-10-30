// memory.js

// GBA memory map constants
const ROM_START = 0x08000000;
const ROM_END = 0x0FFFFFFF;
const RAM_START = 0x02000000;
const RAM_END = 0x0203FFFF;
const VRAM_START = 0x06000000;
const VRAM_END = 0x06017FFF;
const IO_START = 0x04000000;
const IO_END = 0x040003FF;

// Initialize memory regions
let memory = new Uint8Array(0x02000000); // Full GBA addressable memory space

// Separate regions for simplified access
let ioRegisters = new Uint8Array(IO_END - IO_START + 1);
let ram = new Uint8Array(RAM_END - RAM_START + 1);
let vram = new Uint8Array(VRAM_END - VRAM_START + 1);
let rom = null; // ROM data is loaded externally

// Memory initialization function
function initializeMemory(romData) {
  if (!romData) {
    console.log("ROM data is required to initialize memory.");
    return;
  }
  // Assign the ROM data to the global ROM variable
  rom = romData;
  console.log("Memory initialized with ROM loaded.");
}

// Memory read function
function readMemory(address) {
  if (address >= RAM_START && address <= RAM_END) {
    return ram[address - RAM_START];
  } else if (address >= VRAM_START && address <= VRAM_END) {
    return vram[address - VRAM_START];
  } else if (address >= IO_START && address <= IO_END) {
    return ioRegisters[address - IO_START];
  } else if (address >= ROM_START && address <= ROM_END && rom) {
    return rom[address - ROM_START];
  } else {
    console.warn(`Memory read from invalid address: 0x${address.toString(16)}`);
    return 0; // Return default 0 for unmapped regions
  }
}

// Memory write function
function writeMemory(address, value) {
  if (address >= RAM_START && address <= RAM_END) {
    ram[address - RAM_START] = value;
  } else if (address >= VRAM_START && address <= VRAM_END) {
    vram[address - VRAM_START] = value;
  } else if (address >= IO_START && address <= IO_END) {
    ioRegisters[address - IO_START] = value;
  } else {
    console.warn(`Attempted to write to ROM or invalid address: 0x${address.toString(16)}`);
  }
}

// Reset memory and I/O regions (useful for restarting the emulator)
function resetMemory() {
  ram.fill(0);
  vram.fill(0);
  ioRegisters.fill(0);
  console.log("Memory reset.");
}
