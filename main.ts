// tinyvm: a tiny stack VM for make.fun's tiny-stack-vm-01 bounty (ISA.md + vm.mjs).
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
const I = process.env.MAKEFUN_INPUT_DIR ?? '/input';
const O = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const E = new TextEncoder();
for (const id of readdirSync(I).sort()) {
  const r = run(readFileSync(join(I, id, 'program.bin')), readFileSync(join(I, id, 'input.bin')));
  mkdirSync(join(O, id), { recursive: true });
  writeFileSync(join(O, id, 'stdout.bin'), r[0]);
  writeFileSync(join(O, id, 'exit.txt'), r[1] + '\n');
}
function run(p, q) {
  const D = new Int32Array(256), C = new Int32Array(64), M = new Int32Array(256), o = new Uint8Array(65536);
  const T = '01146:;?        999999959995999 999             04400           58              4414';
  let s = 0, c = 0, l = 0, ip = 0, pc = 0, n = 0, t;
  const z = (x) => [o.slice(0, l), x];
  for (;;) {
    if (n == 1e6) return z(10);
    if (pc < 0 || pc >= p.length) return z(9);
    const op = p[pc];
    if (op > 83) return z(5);
    const v = T.charCodeAt(op) - 48;
    if (v < 0) return z(5);
    const m = op == 1 ? 1 : op == 2 ? 4 : op > 47 && op < 52 ? 2 : 0;
    if (pc + m >= p.length) return z(9);
    n++;
    const x = pc + 1 + m, u = v >> 2, w = v & 3;
    if (s < u) return z(2);
    if (s - u + w > 256) return z(3);
    pc = x;
    if (op > 47 && op < 51) {
      const r = ((p[x - 2] | (p[x - 1] << 8)) << 16) >> 16;
      if (op == 48 || (op == 49) == (D[--s] == 0)) pc = x + r;
      continue;
    }
    switch (op) {
      case 0: return z(0);
      case 1: D[s++] = (p[x - 1] << 24) >> 24; break;
      case 2: D[s++] = p.readInt32LE(x - 4); break;
      case 3: s--; break;
      case 4: D[s] = D[s - 1]; s++; break;
      case 5: t = D[s - 1]; D[s - 1] = D[s - 2]; D[s - 2] = t; break;
      case 6: D[s] = D[s - 2]; s++; break;
      case 7: t = D[s - 3]; D[s - 3] = D[s - 2]; D[s - 2] = D[s - 1]; D[s - 1] = t; break;
      case 23: D[s - 1] = -D[s - 1] | 0; break;
      case 27: D[s - 1] = ~D[s - 1]; break;
      case 51:
        if (c == 64) return z(7);
        C[c++] = x; pc = p[x - 2] | (p[x - 1] << 8); break;
      case 52:
        if (!c) return z(8);
        pc = C[--c]; break;
      case 64: {
        const a = D[s - 1];
        if (a < 0 || a > 255) return z(6);
        D[s - 1] = M[a]; break;
      }
      case 65: {
        const a = D[s - 1];
        if (a < 0 || a > 255) return z(6);
        s -= 2; M[a] = D[s]; break;
      }
      case 80: {
        const y = E.encode('' + D[s - 1]);
        if (l + y.length > 65536) return z(11);
        s--; o.set(y, l); l += y.length; break;
      }
      case 81:
        if (l + 1 > 65536) return z(11);
        o[l++] = D[--s] & 255; break;
      case 82: D[s++] = ip < q.length ? q[ip++] : -1; break;
      case 83: return z(D[--s] & 255);
      default: {
        const b = D[s - 1], a = D[s - 2];
        let r;
        if (op == 16) r = (a + b) | 0;
        else if (op == 17) r = (a - b) | 0;
        else if (op == 18) r = Math.imul(a, b);
        else if (op < 23) {
          if (!b) return z(4);
          r = op == 19 ? (a / b) | 0 : op == 20 ? (a % b) | 0 : op == 21 ? ((a >>> 0) / (b >>> 0)) | 0 : ((a >>> 0) % (b >>> 0)) | 0;
        }
        else if (op == 24) r = a & b;
        else if (op == 25) r = a | b;
        else if (op == 26) r = a ^ b;
        else if (op == 28) r = a << (b & 31);
        else if (op == 29) r = a >> (b & 31);
        else if (op == 30) r = (a >>> (b & 31)) | 0;
        else if (op == 32) r = a == b ? 1 : 0;
        else if (op == 33) r = a < b ? 1 : 0;
        else r = (a >>> 0) < (b >>> 0) ? 1 : 0;
        s -= 2; D[s++] = r;
      }
    }
  }
}
