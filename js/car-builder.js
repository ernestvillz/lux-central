/* ============================================================
   LUX CENTRAL — procedural car builder
   Builds a stylized low-poly luxury car in Three.js, varying
   silhouette by bodyType so each model reads as distinct.
   ============================================================ */

const BODY_CONFIG = {
  sedan:       { length: 4.2, bodyH: 0.54, cabinH: 0.5,  cabinLen: 2.0, wheelR: 0.5,  rideY: -0.34, roof: true  },
  suv:         { length: 4.0, bodyH: 0.86, cabinH: 0.68, cabinLen: 2.3, wheelR: 0.6,  rideY: -0.18, roof: true  },
  coupe:       { length: 4.3, bodyH: 0.46, cabinH: 0.4,  cabinLen: 1.7, wheelR: 0.48, rideY: -0.4,  roof: true  },
  ev:          { length: 4.15,bodyH: 0.5,  cabinH: 0.46, cabinLen: 2.0, wheelR: 0.52, rideY: -0.36, roof: true  },
  convertible: { length: 4.3, bodyH: 0.46, cabinH: 0.4,  cabinLen: 1.7, wheelR: 0.48, rideY: -0.4,  roof: false }
};

function buildCar(bodyType, colorHex) {
  const cfg = BODY_CONFIG[bodyType] || BODY_CONFIG.sedan;
  const group = new THREE.Group();

  const bodyMat  = new THREE.MeshStandardMaterial({ color: colorHex, metalness: 0.75, roughness: 0.25 });
  const chromeMat= new THREE.MeshStandardMaterial({ color: 0xd7dbe2, metalness: 0.95, roughness: 0.15 });
  const glassMat = new THREE.MeshStandardMaterial({ color: 0x0c1018, metalness: 0.3, roughness: 0.08, transparent: true, opacity: 0.88 });
  const wheelMat = new THREE.MeshStandardMaterial({ color: 0x0a0b0d, metalness: 0.4, roughness: 0.55 });
  const rimMat   = new THREE.MeshStandardMaterial({ color: 0xc7cdd8, metalness: 0.95, roughness: 0.2 });
  const headMat  = new THREE.MeshStandardMaterial({ color: 0xf4f7ff, emissive: 0xffffff, emissiveIntensity: 1.4 });
  const tailMat  = new THREE.MeshStandardMaterial({ color: 0xd94b4b, emissive: 0xb42b2b, emissiveIntensity: 1.1 });

  // lower body
  const lower = new THREE.Mesh(new THREE.BoxGeometry(cfg.length, cfg.bodyH, 1.86), bodyMat);
  lower.position.y = cfg.rideY;
  group.add(lower);

  // chrome beltline trim
  const trim = new THREE.Mesh(new THREE.BoxGeometry(cfg.length - 0.1, 0.04, 1.9), chromeMat);
  trim.position.y = cfg.rideY + cfg.bodyH/2;
  group.add(trim);

  // cabin (roof) — skipped for convertible
  if (cfg.roof) {
    const cabin = new THREE.Mesh(new THREE.BoxGeometry(cfg.cabinLen, cfg.cabinH, 1.68), bodyMat);
    cabin.position.set(-0.1, cfg.rideY + cfg.bodyH/2 + cfg.cabinH/2, 0);
    group.add(cabin);

    const wF = new THREE.Mesh(new THREE.BoxGeometry(0.9, cfg.cabinH*0.9, 1.6), glassMat);
    wF.position.set(cfg.cabinLen/2 + 0.35, cfg.rideY + cfg.bodyH/2 + cfg.cabinH/2, 0);
    wF.rotation.z = -0.36;
    group.add(wF);

    const wR = new THREE.Mesh(new THREE.BoxGeometry(0.9, cfg.cabinH*0.9, 1.6), glassMat);
    wR.position.set(-cfg.cabinLen/2 - 0.35, cfg.rideY + cfg.bodyH/2 + cfg.cabinH/2, 0);
    wR.rotation.z = 0.32;
    group.add(wR);
  } else {
    // convertible: just an angled windshield + low interior tub
    const windshield = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.42, 1.5), glassMat);
    windshield.position.set(0.55, cfg.rideY + cfg.bodyH/2 + 0.22, 0);
    windshield.rotation.z = -0.5;
    group.add(windshield);

    const tub = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.16, 1.5), new THREE.MeshStandardMaterial({color:0x15171c, roughness:0.6}));
    tub.position.set(-0.2, cfg.rideY + cfg.bodyH/2 + 0.08, 0);
    group.add(tub);
  }

  // headlights / taillights — EV gets a light bar instead
  if (bodyType === 'ev') {
    const headBar = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.08, 1.7), headMat);
    headBar.position.set(cfg.length/2 - 0.02, cfg.rideY + 0.05, 0);
    group.add(headBar);
    const tailBar = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.08, 1.7), tailMat);
    tailBar.position.set(-cfg.length/2 + 0.02, cfg.rideY + 0.05, 0);
    group.add(tailBar);
  } else {
    [[cfg.length/2 - 0.03, headMat], [-cfg.length/2 + 0.03, tailMat]].forEach(([x, mat]) => {
      [0.66, -0.66].forEach(z => {
        const light = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.14, 0.26), mat);
        light.position.set(x, cfg.rideY + 0.02, z);
        group.add(light);
      });
    });
  }

  // wheels
  const wheelGeo = new THREE.CylinderGeometry(cfg.wheelR, cfg.wheelR, 0.34, 22);
  const rimGeo = new THREE.CylinderGeometry(cfg.wheelR*0.55, cfg.wheelR*0.55, 0.36, 16);
  const axleX = cfg.length/2 - cfg.wheelR - 0.28;
  [[axleX, 0.98], [axleX, -0.98], [-axleX, 0.98], [-axleX, -0.98]].forEach(([x, z]) => {
    const wheel = new THREE.Mesh(wheelGeo, wheelMat);
    wheel.rotation.x = Math.PI/2; wheel.rotation.z = Math.PI/2;
    wheel.position.set(x, cfg.rideY - cfg.bodyH/2 + cfg.wheelR - 0.05, z);
    group.add(wheel);
    const rim = new THREE.Mesh(rimGeo, rimMat);
    rim.rotation.x = Math.PI/2; rim.rotation.z = Math.PI/2;
    rim.position.copy(wheel.position);
    group.add(rim);
  });

  return group;
}

/* Reusable scene setup: lights + ground grid, shared by hero + detail canvases */
function setupSceneLighting(scene) {
  scene.add(new THREE.AmbientLight(0x2c3550, 1.1));
  const key = new THREE.DirectionalLight(0xffffff, 0.9);
  key.position.set(3, 6, 4);
  scene.add(key);
  const rimWhite = new THREE.PointLight(0xdfe6f5, 1.8, 20);
  rimWhite.position.set(-4, 3, -3);
  scene.add(rimWhite);
  const rimNavy = new THREE.PointLight(0x3a5ba8, 1.4, 20);
  rimNavy.position.set(4, 2, 3);
  scene.add(rimNavy);

  const grid = new THREE.GridHelper(60, 60, 0x39435c, 0x1a2033);
  grid.position.y = -1.15;
  scene.add(grid);
}
