import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

function createCRC32Table() {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c;
  }
  return table;
}

const crcTable = createCRC32Table();

function crc32(buf) {
  let crc = -1;
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ crcTable[(crc ^ buf[i]) & 0xff];
  }
  return (crc ^ -1) >>> 0;
}

function makeChunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);

  const crcData = Buffer.concat([typeBuf, data]);
  const crcVal = crc32(crcData);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crcVal, 0);

  return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
}

function generatePNG(width, height, isMaskable = false) {
  // Render an RGBA buffer: emerald background (#059669), ledger book in center, gold rupee circle
  const rawData = Buffer.alloc(height * (1 + width * 4));
  let offset = 0;

  const cx = width / 2;
  const cy = height / 2;
  const radius = width * 0.46;
  const bookW = width * 0.55;
  const bookH = height * 0.65;
  const bookLeft = cx - bookW / 2;
  const bookTop = cy - bookH / 2;
  const coinR = width * 0.16;

  for (let y = 0; y < height; y++) {
    rawData[offset++] = 0; // Filter byte: None
    for (let x = 0; x < width; x++) {
      let r = 5, g = 150, b = 105, a = 255; // #059669 emerald

      // Maskable border gradient or round corner for non-maskable
      const distFromCenter = Math.hypot(x - cx, y - cy);
      if (!isMaskable && distFromCenter > radius) {
        // Soft rounded corner background
        const cornerDist = Math.hypot(
          Math.max(0, Math.abs(x - cx) - width * 0.35),
          Math.max(0, Math.abs(y - cy) - height * 0.35)
        );
        if (cornerDist > width * 0.14) {
          a = 0;
        }
      }

      if (a > 0) {
        // Red ledger book
        if (x >= bookLeft && x <= bookLeft + bookW && y >= bookTop && y <= bookTop + bookH) {
          r = 185; g = 28; b = 28; // #b91c1c crimson book
          // Gold border stitched look
          const borderDist = Math.min(x - bookLeft, bookLeft + bookW - x, y - bookTop, bookTop + bookH - y);
          if (borderDist > 4 && borderDist < 8) {
            r = 251; g = 191; b = 36; // gold stitch
          }
          // Spine on left
          if (x < bookLeft + bookW * 0.16) {
            r = 127; g = 29; b = 29;
          }

          // Gold coin in middle
          const distCoin = Math.hypot(x - cx, y - (cy - height * 0.04));
          if (distCoin <= coinR) {
            r = 245; g = 158; b = 11; // Amber coin
            if (distCoin >= coinR - 3) {
              r = 254; g = 243; b = 199; // Light rim
            }
            // Rupee center accent lines
            const relY = y - (cy - height * 0.04);
            const relX = x - cx;
            if (Math.abs(relY) < coinR * 0.6 && Math.abs(relX) < coinR * 0.5) {
              // rupee bar
              if (Math.abs(relY + coinR * 0.25) < 3 || Math.abs(relY) < 3) {
                r = 120; g = 53; b = 15; // Dark amber ₹ bar
              }
            }
          }
        }
      }

      rawData[offset++] = r;
      rawData[offset++] = g;
      rawData[offset++] = b;
      rawData[offset++] = a;
    }
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  const compressedData = zlib.deflateSync(rawData);

  const pngHeader = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdrChunk = makeChunk('IHDR', ihdr);
  const idatChunk = makeChunk('IDAT', compressedData);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([pngHeader, ihdrChunk, idatChunk, iendChunk]);
}

const outDir = path.resolve('public');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

fs.writeFileSync(path.join(outDir, 'pwa-192x192.png'), generatePNG(192, 192, false));
fs.writeFileSync(path.join(outDir, 'pwa-512x512.png'), generatePNG(512, 512, false));
fs.writeFileSync(path.join(outDir, 'pwa-maskable-512x512.png'), generatePNG(512, 512, true));
fs.writeFileSync(path.join(outDir, 'apple-touch-icon.png'), generatePNG(180, 180, false));

console.log('Successfully generated all PWA PNG icons!');
