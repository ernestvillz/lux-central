/* ============================================================
   LUX CENTRAL — app logic
   ============================================================ */

const money = n => '$' + Number(n).toLocaleString('en-US');

/* ---------------- transparent nav on scroll ---------------- */
(function(){
  const nav = document.getElementById('siteNav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('solid', window.scrollY > 60);
  });
})();

/* ---------------- HERO 3D SCENE ---------------- */
(function(){
  const canvas = document.getElementById('hero-canvas');
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, window.innerWidth/window.innerHeight, 0.1, 100);
  camera.position.set(0.5, 1.5, 8);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  setupSceneLighting(scene);
  const car = buildCar('sedan', CARS[0].color);
  car.rotation.y = 0.55;
  scene.add(car);

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  let t = 0;
  function animate(){
    requestAnimationFrame(animate);
    t += 0.005;
    car.rotation.y = 0.55 + Math.sin(t) * 0.22;
    car.position.y = Math.sin(t * 1.6) * 0.04;
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('scroll', () => {
    const p = Math.min(window.scrollY / window.innerHeight, 1);
    car.position.z = -2.5 * p;
    camera.position.y = 1.5 + p * 1.2;
    document.querySelector('.hero-content').style.opacity = 1 - p * 1.4;
    document.querySelector('.hero-content').style.transform = `translateY(${-p*50}px)`;
  });
})();

/* ---------------- COLLECTION GRID ---------------- */
const BODY_ICON_CLASS = {
  sedan: 'silhouette-sedan', suv: 'silhouette-suv', coupe: 'silhouette-coupe',
  ev: 'silhouette-ev', convertible: 'silhouette-convertible'
};

function renderGrid() {
  const grid = document.getElementById('carGrid');
  grid.innerHTML = '';
  CARS.forEach(car => {
    const card = document.createElement('div');
    card.className = 'car-card';
    card.dataset.id = car.id;
    card.innerHTML = `
      <div class="car-card-visual ${BODY_ICON_CLASS[car.bodyType]}"></div>
      <div class="car-card-info">
        <div class="car-card-cat">${car.category}</div>
        <h3>${car.name}</h3>
        <div class="car-card-price">${money(car.price)}</div>
      </div>
      <div class="car-card-cue">View in 3D →</div>
    `;
    // subtle CSS-3D tilt following the cursor
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(700px) rotateY(${px*10}deg) rotateX(${-py*10}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    card.addEventListener('click', () => openDetail(car, card));
    grid.appendChild(card);
  });

  // populate the visit form's model dropdown too
  const select = document.getElementById('visitModelSelect');
  CARS.forEach(car => {
    const opt = document.createElement('option');
    opt.textContent = `${car.name} — ${car.category}`;
    select.appendChild(opt);
  });
}
renderGrid();

/* ---------------- DETAIL / FULL VIEW ---------------- */
let detailRenderer = null, detailScene = null, detailCamera = null, detailCar = null;
let dragState = { active: false, lastX: 0, rotY: 0.5 };

function initDetailScene() {
  const canvas = document.getElementById('detail-canvas');
  detailScene = new THREE.Scene();
  detailCamera = new THREE.PerspectiveCamera(32, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
  detailCamera.position.set(0.6, 1.3, 7.5);

  detailRenderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  detailRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  resizeDetailCanvas();

  setupSceneLighting(detailScene);

  canvas.addEventListener('pointerdown', e => { dragState.active = true; dragState.lastX = e.clientX; });
  window.addEventListener('pointerup', () => dragState.active = false);
  window.addEventListener('pointermove', e => {
    if (!dragState.active) return;
    const dx = e.clientX - dragState.lastX;
    dragState.lastX = e.clientX;
    dragState.rotY += dx * 0.008;
  });

  function animate(){
    requestAnimationFrame(animate);
    if (detailCar) detailCar.rotation.y += (dragState.rotY - detailCar.rotation.y) * 0.12;
    detailRenderer.render(detailScene, detailCamera);
  }
  animate();
}

function resizeDetailCanvas() {
  const canvas = document.getElementById('detail-canvas');
  const w = canvas.clientWidth, h = canvas.clientHeight;
  if (!w || !h || !detailRenderer) return;
  detailRenderer.setSize(w, h, false);
  detailCamera.aspect = w / h;
  detailCamera.updateProjectionMatrix();
}
window.addEventListener('resize', resizeDetailCanvas);

function loadCarIntoDetail(car) {
  if (detailCar) detailScene.remove(detailCar);
  detailCar = buildCar(car.bodyType, car.color);
  dragState.rotY = 0.5;
  detailCar.rotation.y = 0.5;
  detailScene.add(detailCar);
}

function renderSpecs(specs) {
  const wrap = document.getElementById('detailSpecs');
  wrap.innerHTML = '';
  Object.entries(specs).forEach(([label, val]) => {
    const item = document.createElement('div');
    item.className = 'spec-item';
    item.innerHTML = `<span class="spec-label">${label}</span><span class="spec-val">${val}</span>`;
    wrap.appendChild(item);
  });
}

function openDetail(car, cardEl) {
  const overlay = document.getElementById('detailOverlay');
  const rect = cardEl.getBoundingClientRect();

  document.getElementById('detailCategory').textContent = car.category.toUpperCase();
  document.getElementById('detailName').textContent = car.name;
  document.getElementById('detailDesc').textContent = car.desc;
  document.getElementById('detailPrice').textContent = money(car.price) + ' MSRP';
  renderSpecs(car.specs);
  document.getElementById('buyConfirm').classList.remove('show');
  document.getElementById('buyBtn').textContent = 'Reserve this vehicle';

  overlay.style.display = 'flex';
  if (!detailRenderer) initDetailScene();

  // FLIP-style enlarge animation from the clicked card's position
  const inner = overlay.querySelector('.detail-inner');
  gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.25 });
  gsap.fromTo(inner,
    { x: rect.left - window.innerWidth/2 + rect.width/2, y: rect.top - window.innerHeight/2 + rect.height/2, scale: 0.3, opacity: 0 },
    { x: 0, y: 0, scale: 1, opacity: 1, duration: 0.55, ease: 'power3.out',
      onComplete: () => { resizeDetailCanvas(); loadCarIntoDetail(car); }
    }
  );
  document.body.style.overflow = 'hidden';
}

function closeDetail() {
  const overlay = document.getElementById('detailOverlay');
  gsap.to(overlay, {
    opacity: 0, duration: 0.25,
    onComplete: () => { overlay.style.display = 'none'; document.body.style.overflow = ''; }
  });
}

document.getElementById('closeDetail').addEventListener('click', closeDetail);
document.getElementById('closeDetailBtn').addEventListener('click', closeDetail);
document.getElementById('detailOverlay').addEventListener('click', e => {
  if (e.target.id === 'detailOverlay') closeDetail();
});

document.getElementById('buyBtn').addEventListener('click', () => {
  const confirmEl = document.getElementById('buyConfirm');
  confirmEl.classList.add('show');
  document.getElementById('buyBtn').textContent = 'Reservation sent ✓';
});
