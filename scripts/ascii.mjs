// Generates src/ascii-portrait.js from public/images/profile-picture.png (transparent cutout; its alpha
// channel is the mask) or, if that is missing, public/images/profile-picture.jpg (flat grey background is
// flood-filled away). If neither exists, a neutral silhouette placeholder is rendered instead.
//
// Usage: npm run ascii
//   npm run ascii -- --cols 60 --tolerance 40 --gamma 0.9
//   --cols N        max width in characters (default 60; auto-reduced so rows <= --max-rows)
//   --max-rows N    max height in characters (default 36)
//   --tolerance N   (jpg fallback only) how close to the background colour counts as background (0-255, default 30)
//   --gamma N       <1 brightens, >1 darkens midtones (default 0.9)
//   --zoom N        crop in on the head, >1 enlarges the face (default 1.5)
//   --eq N          0-1 histogram equalisation strength (default 0.6)
//   --floor N       0-1 minimum glyph density for the figure (default 0.22)
//   --clahe N       local contrast (default 5)
//   --keep-bg       don't remove the flat background
import sharp from 'sharp'
import { existsSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const arg = (name, def) => {
  const i = process.argv.indexOf(`--${name}`)
  return i > -1 ? Number(process.argv[i + 1]) : def
}
const COLS_MAX = arg('cols', 70)
const TOL = arg('tolerance', 30)
const GAMMA = arg('gamma', 1.2)
const KEEP_BG = process.argv.includes('--keep-bg')
const EQ = arg('eq', 0.6) // 0 = linear contrast stretch, 1 = full histogram equalisation
const FLOOR = arg('floor', 0.2)
const SS = 4 // supersampling per character cell
const CHAR_ASPECT = 1.83 // glyph height / width for the CSS font-size & line-height used
// dark -> bright; on the dark theme brighter pixels get denser glyphs
const RAMP = ' .,:;-=+*#%@' // index 0 (blank) is reserved for removed background

const pngUrl = new URL('../public/images/profile-picture.png', import.meta.url)
const jpgUrl = new URL('../public/images/profile-picture.jpg', import.meta.url)
const photoUrl = existsSync(pngUrl) ? pngUrl : jpgUrl
const photoName = photoUrl === pngUrl ? 'public/images/profile-picture.png' : 'public/images/profile-picture.jpg'
const outUrl = new URL('../src/ascii-portrait.js', import.meta.url)
const hasPhoto = existsSync(photoUrl)

const silhouette = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400">
  <rect width="400" height="400" fill="#000"/>
  <defs><radialGradient id="g" cx="50%" cy="40%" r="60%"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#777"/></radialGradient></defs>
  <ellipse cx="200" cy="150" rx="78" ry="95" fill="url(#g)"/>
  <path d="M60 400 C60 300 120 262 200 262 C280 262 340 300 340 400 Z" fill="url(#g)"/>
  <rect x="172" y="225" width="56" height="50" fill="#bbb"/>
</svg>`)

const src = hasPhoto ? sharp(fileURLToPath(photoUrl)).rotate() : sharp(silhouette)
const meta = await src.clone().metadata()
// a PNG with real transparency: use its alpha channel as the foreground mask
let useAlpha = false
if (hasPhoto && meta.hasAlpha) {
  const { data: al } = await src.clone().ensureAlpha().extractChannel(3).raw().toBuffer({ resolveWithObject: true })
  useAlpha = al.some((v) => v < 250)
}
const FLAT = { background: '#000000' } // transparent areas become black before luminance is computed
const MAX_ROWS = arg('max-rows', 40)

// --- pass 1: find the foreground bounding box (flat background removed) so the figure fills the character grid
async function foregroundBox(img) {
  if (useAlpha) {
    const N = 200
    const { data, info } = await img.clone().ensureAlpha().extractChannel(3).resize(N, N, { fit: 'inside' }).raw().toBuffer({ resolveWithObject: true })
    let x0 = info.width, y0 = info.height, x1 = -1, y1 = -1
    for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) if (data[y * info.width + x] > 128) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y) }
    if (x1 < 0) return null
    return { left: x0 / info.width, top: y0 / info.height, right: (x1 + 1) / info.width, bottom: (y1 + 1) / info.height }
  }
  const N = 200
  const { data, info } = await img.clone().resize(N, N, { fit: 'inside' }).removeAlpha().raw().toBuffer({ resolveWithObject: true })
  const w = info.width, h = info.height
  const bgm = floodBackground(data, w, h)
  let x0 = w, y0 = h, x1 = -1, y1 = -1
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (!bgm[y * w + x]) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y) }
  if (x1 < 0) return null
  const pad = 2
  return { left: Math.max(0, x0 - pad) / w, top: Math.max(0, y0 - pad) / h, right: Math.min(w, x1 + 1 + pad) / w, bottom: Math.min(h, y1 + 1 + pad) / h }
}

function floodBackground(data, W, H) {
  const bg = new Uint8Array(W * H)
  const samples = []
  for (let x = 0; x < W; x += 2) for (let y = 0; y < 4; y++) samples.push(y * W + x)
  const mean = [0, 1, 2].map((c) => samples.reduce((s, p) => s + data[p * 3 + c], 0) / samples.length)
  const dist = (p) => Math.hypot(data[p * 3] - mean[0], data[p * 3 + 1] - mean[1], data[p * 3 + 2] - mean[2])
  const stack = []
  const push = (p) => { if (!bg[p] && dist(p) < TOL) { bg[p] = 1; stack.push(p) } }
  for (let x = 0; x < W; x++) { push(x); push((H - 1) * W + x) }
  for (let y = 0; y < H; y++) { push(y * W); push(y * W + W - 1) }
  while (stack.length) {
    const p = stack.pop(), x = p % W, y = (p / W) | 0
    if (x > 0) push(p - 1)
    if (x < W - 1) push(p + 1)
    if (y > 0) push(p - W)
    if (y < H - 1) push(p + W)
  }
  return bg
}

let srcImg = src
let cropMeta = meta
if (hasPhoto && !KEEP_BG) {
  const box = await foregroundBox(src)
  if (box) {
    const left = Math.round(box.left * meta.width), top = Math.round(box.top * meta.height)
    const width = Math.round((box.right - box.left) * meta.width), height = Math.round((box.bottom - box.top) * meta.height)
    const buf = await src.clone().extract({ left, top, width, height }).png().toBuffer()
    srcImg = sharp(buf)
    cropMeta = { width, height }
  }
}
// optional zoom into the centre-top of the figure (e.g. --zoom 1.3 to enlarge the face)
const ZOOM = arg('zoom', 1.5)
if (ZOOM > 1) {
  const w = Math.round(cropMeta.width / ZOOM), h = Math.round(cropMeta.height / ZOOM)
  const left = Math.round((cropMeta.width - w) / 2), top = Math.round((cropMeta.height - h) * arg('top-bias', 0))
  srcImg = sharp(await srcImg.clone().extract({ left, top, width: w, height: h }).png().toBuffer())
  cropMeta = { width: w, height: h }
}
const aspect = cropMeta.height / cropMeta.width
const COLS = Math.min(COLS_MAX, Math.floor((MAX_ROWS * CHAR_ASPECT) / aspect))
const rows = Math.max(1, Math.round((COLS * aspect) / CHAR_ASPECT))
const W = COLS * SS
const H = rows * SS

const { data } = await srcImg
  .clone()
  .resize(W, H, { fit: 'fill', kernel: 'lanczos3' })
  .flatten(FLAT)
  .raw()
  .toBuffer({ resolveWithObject: true })

// luminance with local contrast enhancement (CLAHE) so eyes, brows, beard and collar stay readable
const { data: gray } = await srcImg
  .clone()
  .resize(W, H, { fit: 'fill', kernel: 'lanczos3' })
  .flatten(FLAT)
  .grayscale()
  .clahe({ width: Math.round(W / 6), height: Math.round(H / 6), maxSlope: arg('clahe', 5) })
  .sharpen({ sigma: 1.2 })
  .raw()
  .toBuffer({ resolveWithObject: true })
const lum = new Float32Array(W * H)
for (let i = 0; i < W * H; i++) lum[i] = gray[i]

let bg = new Uint8Array(W * H)
if (useAlpha) {
  const { data: al } = await srcImg.clone().ensureAlpha().extractChannel(3).resize(W, H, { fit: 'fill', kernel: 'lanczos3' }).raw().toBuffer({ resolveWithObject: true })
  for (let i = 0; i < W * H; i++) bg[i] = al[i] < 110 ? 1 : 0
} else if (hasPhoto && !KEEP_BG) bg = floodBackground(data, W, H)

if (process.argv.includes('--debug')) {
  const out = Buffer.alloc(W * H)
  for (let i = 0; i < W * H; i++) out[i] = bg[i] ? 0 : lum[i]
  await sharp(out, { raw: { width: W, height: H, channels: 1 } }).png().toFile('/tmp/pp/dbg.png')
}
// --- per-cell average luminance over foreground pixels
const cells = []
let lo = 255
let hi = 0
for (let cy = 0; cy < rows; cy++) {
  for (let cx = 0; cx < COLS; cx++) {
    let sum = 0
    let n = 0
    for (let y = 0; y < SS; y++)
      for (let x = 0; x < SS; x++) {
        const p = (cy * SS + y) * W + cx * SS + x
        if (!bg[p]) { sum += lum[p]; n++ }
      }
    if (n < (SS * SS) / 2) cells.push(-1)
    else {
      const v = sum / n
      cells.push(v)
      lo = Math.min(lo, v)
      hi = Math.max(hi, v)
    }
  }
}

// --- stretch contrast over the foreground only (percentile clip), apply gamma, map to ramp
const fg = cells.filter((v) => v >= 0).sort((a, b) => a - b)
const fgSorted = fg
const p = (q) => fg[Math.floor(q * (fg.length - 1))]
const a = p(0.02)
const b = p(0.98)
let art = ''
for (let cy = 0; cy < rows; cy++) {
  let line = ''
  for (let cx = 0; cx < COLS; cx++) {
    const v = cells[cy * COLS + cx]
    if (v < 0) { line += ' '; continue }
    let t = Math.min(1, Math.max(0, (v - a) / (b - a || 1)))
    // blend linear stretch with histogram equalisation so facial detail survives
    const rank = fgSorted.indexOf(v) / (fgSorted.length - 1)
    t = Math.pow((1 - EQ) * t + EQ * rank, GAMMA)
    t = FLOOR + (1 - FLOOR) * t // dark areas (hair, suit) still get visible glyphs so the silhouette reads
    // reserve the blank glyph for the background: foreground starts at index 1
    line += RAMP[1 + Math.min(RAMP.length - 2, Math.floor(t * (RAMP.length - 1)))]
  }
  art += line.replace(/\s+$/, '') + '\n'
}
art = art.replace(/\n+$/, '')

writeFileSync(
  outUrl,
  `// Generated by scripts/ascii.mjs from ${hasPhoto ? photoName : 'a built-in placeholder silhouette (no photo found)'}. Do not edit by hand.\nexport const asciiPortrait = ${JSON.stringify(art)}\nexport const hasPhoto = ${hasPhoto}\n`,
)
console.log(art)
console.log(`\n${COLS}x${rows} chars from ${hasPhoto ? 'photo' : 'placeholder silhouette'}`)
