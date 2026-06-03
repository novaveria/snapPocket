/* =========================================================
       SNAPPOCKET — Demo Interaktif
       Camera → Capture → Keychain Preview → Order
    ========================================================= */

let stream = null;

const state = {
  product: 'standard',
  chain: 'silver',
  sticker: 'y2k',
  beads: 'colorful',
};

const STICKERS = {
  y2k: [
    { emoji: '✨', top: '6px',  left: '6px',   size: '1.5rem', r: '-12deg' },
    { emoji: '⭐', top: '6px',  right: '6px',  size: '1.2rem', r: '10deg'  },
    { emoji: '💫', bottom: '48px', left: '8px', size: '1.3rem', r: '-5deg'  },
    { emoji: '💎', bottom: '48px', right: '8px',size: '1rem',  r: '15deg'  },
    { emoji: '🌟', top: '42%', left: '42%',    size: '1rem',  r: '-8deg', transform: 'translate(-50%,-50%)' },
  ],
  cute: [
    { emoji: '🌸', top: '6px',  left: '6px',   size: '1.5rem', r: '-10deg' },
    { emoji: '🎀', top: '6px',  right: '6px',  size: '1.2rem', r: '8deg'   },
    { emoji: '🐣', bottom: '48px', left: '8px', size: '1.3rem', r: '-6deg'  },
    { emoji: '🍓', bottom: '48px', right: '8px',size: '1rem',  r: '18deg'  },
    { emoji: '🌷', top: '42%', left: '42%',    size: '0.9rem', r: '-5deg', transform: 'translate(-50%,-50%)' },
  ],
};

const BEAD_COLORS = {
  colorful: ['#FF6B6B','#FFD93D','#6BCB77','#4D96FF','#FF6BD6','#C77DFF','#FF9F40','#2EC4B6','#F72585','#4CC9F0'],
  pastel:   ['#FFB3BA','#FFD9A0','#FFFFC5','#B3EEC5','#B3D9FF','#D9B3FF','#FFB3E6','#B3FFED','#FFDDD2','#E0C3FC'],
};

/* ───────────────────────────────────────────
   CAMERA
─────────────────────────────────────────── */
async function startCamera() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 960 } },
      audio: false,
    });
    const video = document.getElementById('videoEl');
    video.srcObject = stream;
    document.getElementById('permissionState').style.display = 'none';
    document.getElementById('cameraView').style.display = 'flex';
  } catch (_) {
    document.getElementById('permissionState').style.display = 'none';
    document.getElementById('errorState').style.display = 'block';
  }
}

function capturePhoto() {
  const video = document.getElementById('videoEl');
  const canvas = document.createElement('canvas');
  canvas.width  = video.videoWidth  || 640;
  canvas.height = video.videoHeight || 480;

  const ctx = canvas.getContext('2d');
  /* Mirror horizontally so selfie looks natural */
  ctx.save();
  ctx.scale(-1, 1);
  ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
  ctx.restore();

  /* Stop camera stream */
  if (stream) stream.getTracks().forEach(t => t.stop());
  stream = null;

  /* Put photo into preview */
  document.getElementById('previewPhoto').src = canvas.toDataURL('image/jpeg', 0.92);

  /* Switch screens */
  document.getElementById('step1').style.display = 'none';
  document.getElementById('step2').style.display = 'flex';

  setStep(2);
  updateVisual();
}

function retakePhoto() {
  document.getElementById('step2').style.display = 'none';
  document.getElementById('step1').style.display = 'flex';
  document.getElementById('cameraView').style.display = 'none';
  document.getElementById('permissionState').style.display = 'block';
  setStep(1);
  startCamera();
}

/* ───────────────────────────────────────────
   STEP INDICATOR
─────────────────────────────────────────── */
function setStep(n) {
  [1, 2, 3].forEach(i => {
    const el = document.getElementById(`step${i}-ind`);
    if (el) el.classList.toggle('active', i <= n);
  });
}

/* ───────────────────────────────────────────
   PRODUCT / OPTION SELECTION
─────────────────────────────────────────── */
function selectProduct(product) {
  state.product = product;

  document.querySelectorAll('.product-option-card').forEach(c =>
    c.classList.toggle('active', c.dataset.product === product)
  );

  const hasSticker = product === 'sticker' || product === 'premium';
  const hasBeads   = product === 'beads'   || product === 'premium';

  document.getElementById('stickerOptions').style.display = hasSticker ? 'block' : 'none';
  document.getElementById('beadsOptions').style.display   = hasBeads   ? 'block' : 'none';

  updateVisual();
}

function selectChain(chain) {
  state.chain = chain;
  document.querySelectorAll('[data-chain]').forEach(b =>
    b.classList.toggle('selected', b.dataset.chain === chain)
  );
  updateVisual();
}

function selectSticker(sticker) {
  state.sticker = sticker;
  document.querySelectorAll('[data-sticker]').forEach(b =>
    b.classList.toggle('selected', b.dataset.sticker === sticker)
  );
  updateVisual();
}

function selectBeads(beads) {
  state.beads = beads;
  document.querySelectorAll('[data-beads]').forEach(b =>
    b.classList.toggle('selected', b.dataset.beads === beads)
  );
  updateVisual();
}

/* ───────────────────────────────────────────
   VISUAL UPDATE
─────────────────────────────────────────── */
function updateVisual() {
  const hasSticker = state.product === 'sticker' || state.product === 'premium';
  const hasBeads   = state.product === 'beads'   || state.product === 'premium';

  /* Chain color */
  const ring  = document.getElementById('kcRing');
  const chain = document.getElementById('kcChain');
  ring.classList.toggle('gold',  state.chain === 'gold');
  chain.classList.toggle('gold', state.chain === 'gold');

  /* Stickers */
  const stickerEl = document.getElementById('kcStickers');
  if (hasSticker) {
    stickerEl.style.display = 'block';
    renderStickers(stickerEl);
  } else {
    stickerEl.style.display = 'none';
    stickerEl.innerHTML = '';
  }

  /* Beads */
  const beadsEl = document.getElementById('kcBeads');
  if (hasBeads) {
    beadsEl.style.display = 'flex';
    renderBeads(beadsEl);
  } else {
    beadsEl.style.display = 'none';
    beadsEl.innerHTML = '';
  }
}

function renderStickers(container) {
  container.innerHTML = '';
  const list = STICKERS[state.sticker] || STICKERS.y2k;

  list.forEach((s, i) => {
    const el = document.createElement('span');
    el.className = 'kc-sticker';
    el.textContent = s.emoji;
    el.style.cssText = `
      font-size: ${s.size};
      ${s.top    !== undefined ? `top:${s.top};`       : ''}
      ${s.bottom !== undefined ? `bottom:${s.bottom};` : ''}
      ${s.left   !== undefined ? `left:${s.left};`     : ''}
      ${s.right  !== undefined ? `right:${s.right};`   : ''}
      --r: ${s.r};
      transform: ${s.transform ? s.transform + ' rotate('+s.r+')' : 'rotate('+s.r+')'};
      animation-delay: ${i * 0.05}s;
    `;
    container.appendChild(el);
  });
}

function renderBeads(container) {
  container.innerHTML = '';
  const colors = BEAD_COLORS[state.beads] || BEAD_COLORS.colorful;

  for (let i = 0; i < 10; i++) {
    const bead = document.createElement('div');
    bead.className = 'kc-bead';
    bead.style.background = colors[i % colors.length];
    bead.style.animationDelay = `${i * 0.04}s`;
    container.appendChild(bead);
  }
}

/* ───────────────────────────────────────────
   ORDER
─────────────────────────────────────────── */
function goToOrder() {
  window.location.href = 'index.html#shop';
}
