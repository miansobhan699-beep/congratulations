// Mobile navigation
document.querySelectorAll('.menu-toggle').forEach(btn => btn.addEventListener('click', () => {
  const nav = btn.parentElement.querySelector('nav');
  nav.classList.toggle('open');
  btn.textContent = nav.classList.contains('open') ? '✕' : '☰';
}));

// A soft original chime sequence, only after the visitor taps Music.
let audioCtx = null, musicPlaying = false, musicInterval = null;
const musicBtn = document.getElementById('musicBtn');
if (musicBtn) musicBtn.addEventListener('click', () => {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) { musicBtn.textContent = 'Audio unavailable'; return; }
  if (musicPlaying) {
    clearInterval(musicInterval); musicPlaying = false;
    if (audioCtx) audioCtx.suspend();
    musicBtn.textContent = '♫ Music'; return;
  }
  audioCtx = audioCtx || new AudioContext(); audioCtx.resume();
  musicPlaying = true; musicBtn.textContent = '♫ Music on';
  const notes = [523.25, 659.25, 783.99, 659.25]; let n = 0;
  const chime = () => {
    if (!musicPlaying) return;
    const osc = audioCtx.createOscillator(), gain = audioCtx.createGain();
    osc.type = 'sine'; osc.frequency.value = notes[n++ % notes.length];
    gain.gain.setValueAtTime(.0001, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(.035, audioCtx.currentTime + .08);
    gain.gain.exponentialRampToValueAtTime(.0001, audioCtx.currentTime + .9);
    osc.connect(gain); gain.connect(audioCtx.destination); osc.start(); osc.stop(audioCtx.currentTime + 1);
  };
  chime(); musicInterval = setInterval(chime, 1150);
});

// Session-only photo gallery
const photoInput = document.getElementById('photoUpload');
if (photoInput) photoInput.addEventListener('change', e => {
  const grid = document.getElementById('memoryGrid');
  [...e.target.files].forEach(file => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const tile = document.createElement('div'); tile.className = 'memory-tile photo-added';
      const img = document.createElement('img'); img.src = ev.target.result; img.alt = 'A photo memory of baby Ali';
      const label = document.createElement('b'); label.textContent = 'A precious memory';
      tile.append(img, label); grid.prepend(tile);
    };
    reader.readAsDataURL(file);
  });
  photoInput.value = '';
});

// Gift opening surprise
const openGift = document.getElementById('openGift');
if (openGift) openGift.addEventListener('click', () => {
  document.getElementById('giftBox').classList.add('open');
  document.getElementById('wishReveal').classList.add('show');
  openGift.textContent = '♡ Surprise opened!';
  launchConfetti();
  document.getElementById('wishReveal').scrollIntoView({behavior:'smooth', block:'center'});
});

function launchConfetti() {
  const symbols = ['✦','✧','♡','💙','⭐'];
  for (let i=0;i<42;i++) {
    const item = document.createElement('span'); item.textContent = symbols[Math.floor(Math.random()*symbols.length)];
    item.style.cssText = `position:fixed;z-index:99;left:${Math.random()*100}vw;top:-25px;color:${['#6aa9dc','#e7bd67','#fff'][i%3]};font-size:${12+Math.random()*18}px;pointer-events:none;transition:transform ${2+Math.random()*2}s ease,opacity 3s`;
    document.body.appendChild(item);
    requestAnimationFrame(()=>{item.style.transform=`translateY(${innerHeight+60}px) rotate(${Math.random()*650-300}deg)`;item.style.opacity='0';});
    setTimeout(()=>item.remove(),4300);
  }
}

// Tiny ambient stars
const stars = document.querySelector('.stars');
if (stars) for(let i=0;i<30;i++){
  const s=document.createElement('i');s.textContent=i%3===0?'✦':'·';
  s.style.cssText=`position:absolute;left:${Math.random()*100}%;top:${Math.random()*100}%;font-style:normal;color:#fff;font-size:${10+Math.random()*13}px;opacity:${.25+Math.random()*.45};animation:twinkle ${2+Math.random()*4}s infinite alternate`;
  stars.appendChild(s);
}
