/* ==========================================================================
   FERNANDES CONSTRUTORA - THREE.JS 3D ARCHITECTURAL EXPERIENCE
   High-performance parametric 3D building, lighting & interactive shaders
   ========================================================================== */

(function () {
  'use strict';

  // Configurações e Estado
  const state = {
    mode: 'night', // 'blueprint' | 'day' | 'night'
    mouseX: 0,
    mouseY: 0,
    targetRotationX: 0,
    targetRotationY: 0,
    scrollY: 0,
    targetScrollY: 0,
    isDragging: false,
    previousMousePosition: { x: 0, y: 0 }
  };

  const container = document.getElementById('hero-canvas-container');
  if (!container) return;

  // 1. Criação da Cena, Câmera e Renderizador
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x080a0e, 0.025);

  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(18, 12, 28);

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  container.appendChild(renderer.domElement);

  // 2. Grupo Principal da Maquete Arquitetônica
  const architectureGroup = new THREE.Group();
  scene.add(architectureGroup);

  // Materiais por Modo
  const materials = {
    // Modo Noturno / Luxo
    night: {
      concrete: new THREE.MeshStandardMaterial({
        color: 0x181e28,
        roughness: 0.6,
        metalness: 0.2
      }),
      concreteDark: new THREE.MeshStandardMaterial({
        color: 0x0f141d,
        roughness: 0.8,
        metalness: 0.1
      }),
      goldAccent: new THREE.MeshStandardMaterial({
        color: 0xd4af37,
        metalness: 0.85,
        roughness: 0.25,
        emissive: 0x554010,
        emissiveIntensity: 0.3
      }),
      glass: new THREE.MeshPhysicalMaterial({
        color: 0x4a9eff,
        transparent: true,
        opacity: 0.65,
        roughness: 0.1,
        metalness: 0.1,
        transmission: 0.7,
        ior: 1.5,
        emissive: 0x112d4e,
        emissiveIntensity: 0.4
      }),
      warmWindow: new THREE.MeshStandardMaterial({
        color: 0xffe29a,
        emissive: 0xffb830,
        emissiveIntensity: 1.6,
        roughness: 0.2
      }),
      ground: new THREE.MeshStandardMaterial({
        color: 0x0a0d13,
        roughness: 0.9,
        metalness: 0.05
      }),
      water: new THREE.MeshStandardMaterial({
        color: 0x002244,
        roughness: 0.1,
        metalness: 0.8
      })
    },
    // Modo Blueprint
    blueprint: {
      wireframeCyan: new THREE.MeshBasicMaterial({
        color: 0x00f0ff,
        wireframe: true,
        transparent: true,
        opacity: 0.85
      }),
      wireframeGold: new THREE.MeshBasicMaterial({
        color: 0xd4af37,
        wireframe: true,
        transparent: true,
        opacity: 0.95
      }),
      wireframeSubtle: new THREE.MeshBasicMaterial({
        color: 0x1a4b75,
        wireframe: true,
        transparent: true,
        opacity: 0.4
      })
    },
    // Modo Diurno
    day: {
      concrete: new THREE.MeshStandardMaterial({
        color: 0xe2e8f0,
        roughness: 0.4,
        metalness: 0.1
      }),
      concreteDark: new THREE.MeshStandardMaterial({
        color: 0x64748b,
        roughness: 0.5,
        metalness: 0.15
      }),
      goldAccent: new THREE.MeshStandardMaterial({
        color: 0xd4af37,
        metalness: 0.9,
        roughness: 0.2
      }),
      glass: new THREE.MeshPhysicalMaterial({
        color: 0x90cdf4,
        transparent: true,
        opacity: 0.5,
        roughness: 0.05,
        metalness: 0.1,
        transmission: 0.85,
        ior: 1.5
      }),
      warmWindow: new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.1
      }),
      ground: new THREE.MeshStandardMaterial({
        color: 0x334155,
        roughness: 0.8
      }),
      water: new THREE.MeshStandardMaterial({
        color: 0x0284c7,
        roughness: 0.1,
        metalness: 0.6
      })
    }
  };

  // 3. Iluminação
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xfffaed, 2.2);
  dirLight.position.set(25, 40, 20);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.width = 2048;
  dirLight.shadow.mapSize.height = 2048;
  dirLight.shadow.camera.near = 0.5;
  dirLight.shadow.camera.far = 100;
  dirLight.shadow.camera.left = -25;
  dirLight.shadow.camera.right = 25;
  dirLight.shadow.camera.top = 25;
  dirLight.shadow.camera.bottom = -25;
  dirLight.shadow.bias = -0.0005;
  scene.add(dirLight);

  // Luzes pontuais arquitetônicas (Spots nos alicerces e sacadas)
  const spotLight1 = new THREE.SpotLight(0xd4af37, 3, 30, Math.PI / 4, 0.5);
  spotLight1.position.set(0, 0.2, 10);
  spotLight1.target.position.set(0, 8, 0);
  scene.add(spotLight1);
  scene.add(spotLight1.target);

  const spotLight2 = new THREE.PointLight(0x00c896, 1.5, 20);
  spotLight2.position.set(-6, 2, 6);
  scene.add(spotLight2);

  // 4. Construção Paramétrica da Maquete do Edifício
  const buildingMeshes = [];

  function createArchitecturalBuilding() {
    // Base e Espelho d'Água
    const groundGeo = new THREE.CylinderGeometry(18, 19, 0.6, 64);
    const groundMesh = new THREE.Mesh(groundGeo, materials.night.ground);
    groundMesh.position.y = -0.3;
    groundMesh.receiveShadow = true;
    architectureGroup.add(groundMesh);
    buildingMeshes.push({ mesh: groundMesh, type: 'ground' });

    // Espelho d'água frontal
    const poolGeo = new THREE.BoxGeometry(10, 0.2, 4);
    const poolMesh = new THREE.Mesh(poolGeo, materials.night.water);
    poolMesh.position.set(0, 0.05, 7);
    poolMesh.receiveShadow = true;
    architectureGroup.add(poolMesh);
    buildingMeshes.push({ mesh: poolMesh, type: 'water' });

    // Torre Principal (Bloco A - Volume Superior)
    const towerAGeo = new THREE.BoxGeometry(6, 16, 7);
    const towerAMesh = new THREE.Mesh(towerAGeo, materials.night.concrete);
    towerAMesh.position.set(-1.5, 8, -0.5);
    towerAMesh.castShadow = true;
    towerAMesh.receiveShadow = true;
    architectureGroup.add(towerAMesh);
    buildingMeshes.push({ mesh: towerAMesh, type: 'concrete' });

    // Torre Secundária em Balanço (Bloco B)
    const towerBGeo = new THREE.BoxGeometry(7, 11, 6);
    const towerBMesh = new THREE.Mesh(towerBGeo, materials.night.concreteDark);
    towerBMesh.position.set(2.5, 5.5, 1);
    towerBMesh.castShadow = true;
    towerBMesh.receiveShadow = true;
    architectureGroup.add(towerBMesh);
    buildingMeshes.push({ mesh: towerBMesh, type: 'concreteDark' });

    // Sacadas e Balanços Esculturais (7 andares)
    for (let i = 1; i <= 7; i++) {
      const balconyGeo = new THREE.BoxGeometry(5.5, 0.25, 2.2);
      const balconyMesh = new THREE.Mesh(balconyGeo, materials.night.goldAccent);
      balconyMesh.position.set(2.5, i * 1.6, 4.2);
      balconyMesh.castShadow = true;
      architectureGroup.add(balconyMesh);
      buildingMeshes.push({ mesh: balconyMesh, type: 'goldAccent' });

      // Guarda-corpo de Vidro
      const railingGeo = new THREE.BoxGeometry(5.4, 0.7, 0.08);
      const railingMesh = new THREE.Mesh(railingGeo, materials.night.glass);
      railingMesh.position.set(2.5, i * 1.6 + 0.45, 5.25);
      architectureGroup.add(railingMesh);
      buildingMeshes.push({ mesh: railingMesh, type: 'glass' });

      // Janelas Iluminadas no Interior
      const windowGeo = new THREE.PlaneGeometry(1.6, 1.0);
      const windowMesh = new THREE.Mesh(windowGeo, (i % 2 === 0) ? materials.night.warmWindow : materials.night.glass);
      windowMesh.position.set(1.5 + (i % 2) * 1.8, i * 1.6 + 0.6, 4.02);
      architectureGroup.add(windowMesh);
      buildingMeshes.push({ mesh: windowMesh, type: (i % 2 === 0) ? 'warmWindow' : 'glass' });
    }

    // Fachada de Vidro Contínua (Cortina de Vidro) no Bloco A
    const curtainGlassGeo = new THREE.BoxGeometry(4.2, 14, 0.2);
    const curtainGlassMesh = new THREE.Mesh(curtainGlassGeo, materials.night.glass);
    curtainGlassMesh.position.set(-1.5, 8, 3.05);
    architectureGroup.add(curtainGlassMesh);
    buildingMeshes.push({ mesh: curtainGlassMesh, type: 'glass' });

    // Brises Verticais em Ouro Arquitetônico
    for (let b = -2; b <= 2; b++) {
      const briseGeo = new THREE.BoxGeometry(0.12, 14, 0.6);
      const briseMesh = new THREE.Mesh(briseGeo, materials.night.goldAccent);
      briseMesh.position.set(-1.5 + b * 0.9, 8, 3.25);
      briseMesh.castShadow = true;
      architectureGroup.add(briseMesh);
      buildingMeshes.push({ mesh: briseMesh, type: 'goldAccent' });
    }

    // Rooftop Lounge & Pérgola Contemporânea
    const pergolaBeamGeo = new THREE.BoxGeometry(6.4, 0.2, 7.4);
    const pergolaMesh = new THREE.Mesh(pergolaBeamGeo, materials.night.goldAccent);
    pergolaMesh.position.set(-1.5, 16.2, -0.5);
    architectureGroup.add(pergolaMesh);
    buildingMeshes.push({ mesh: pergolaMesh, type: 'goldAccent' });

    // Pilares de Sustentação da Pérgola
    const pilar1 = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 2.5), materials.night.goldAccent);
    pilar1.position.set(-4.2, 15, 2.8);
    architectureGroup.add(pilar1);
    buildingMeshes.push({ mesh: pilar1, type: 'goldAccent' });

    const pilar2 = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 2.5), materials.night.goldAccent);
    pilar2.position.set(1.2, 15, 2.8);
    architectureGroup.add(pilar2);
    buildingMeshes.push({ mesh: pilar2, type: 'goldAccent' });

    // Hall de Entrada Monumental com Pé Direito Duplo
    const hallGeo = new THREE.BoxGeometry(8, 2.8, 4);
    const hallMesh = new THREE.Mesh(hallGeo, materials.night.glass);
    hallMesh.position.set(0.5, 1.4, 4);
    architectureGroup.add(hallMesh);
    buildingMeshes.push({ mesh: hallMesh, type: 'glass' });
  }

  createArchitecturalBuilding();

  // 5. Partículas Douradas Flutuantes (Gold Dust / Star Field)
  const particlesCount = 450;
  const particleGeo = new THREE.BufferGeometry();
  const particlePos = new Float32Array(particlesCount * 3);
  const particleScales = new Float32Array(particlesCount);

  for (let i = 0; i < particlesCount; i++) {
    particlePos[i * 3] = (Math.random() - 0.5) * 50;
    particlePos[i * 3 + 1] = Math.random() * 35;
    particlePos[i * 3 + 2] = (Math.random() - 0.5) * 50;
    particleScales[i] = Math.random() * 2 + 1;
  }

  particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
  particleGeo.setAttribute('scale', new THREE.BufferAttribute(particleScales, 1));

  const particleMat = new THREE.PointsMaterial({
    color: 0xd4af37,
    size: 0.15,
    transparent: true,
    opacity: 0.75,
    blending: THREE.AdditiveBlending
  });

  const particlesSystem = new THREE.Points(particleGeo, particleMat);
  scene.add(particlesSystem);

  // 6. Alternância de Modos (Blueprint / Day / Night)
  window.setThreeRenderMode = function (newMode) {
    if (!['blueprint', 'day', 'night'].includes(newMode)) return;
    state.mode = newMode;

    if (newMode === 'blueprint') {
      scene.background = new THREE.Color(0x050a12);
      scene.fog.color.setHex(0x050a12);
      ambientLight.intensity = 0.8;
      dirLight.intensity = 0.5;
      particleMat.color.setHex(0x00f0ff);

      buildingMeshes.forEach(item => {
        if (item.type === 'goldAccent' || item.type === 'warmWindow') {
          item.mesh.material = materials.blueprint.wireframeGold;
        } else if (item.type === 'glass') {
          item.mesh.material = materials.blueprint.wireframeCyan;
        } else {
          item.mesh.material = materials.blueprint.wireframeSubtle;
        }
      });
    } else if (newMode === 'day') {
      scene.background = new THREE.Color(0x1a2434);
      scene.fog.color.setHex(0x1a2434);
      ambientLight.intensity = 1.2;
      dirLight.intensity = 3.2;
      dirLight.color.setHex(0xffffff);
      particleMat.color.setHex(0xffffff);
      particleMat.opacity = 0.3;

      buildingMeshes.forEach(item => {
        if (materials.day[item.type]) {
          item.mesh.material = materials.day[item.type];
        }
      });
    } else {
      // Night Luxury Mode
      scene.background = null;
      scene.fog.color.setHex(0x080a0e);
      ambientLight.intensity = 0.4;
      dirLight.intensity = 2.0;
      dirLight.color.setHex(0xfffaed);
      particleMat.color.setHex(0xd4af37);
      particleMat.opacity = 0.75;

      buildingMeshes.forEach(item => {
        if (materials.night[item.type]) {
          item.mesh.material = materials.night[item.type];
        }
      });
    }
  };

  // 7. Eventos de Mouse e Parallax
  window.addEventListener('mousemove', e => {
    state.mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    state.mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    state.targetRotationY = state.mouseX * 0.35;
    state.targetRotationX = state.mouseY * 0.2;
  });

  window.addEventListener('scroll', () => {
    state.targetScrollY = window.scrollY;
  });

  // Interação Drag no Canvas
  container.addEventListener('mousedown', e => {
    state.isDragging = true;
    state.previousMousePosition = { x: e.clientX, y: e.clientY };
  });

  window.addEventListener('mouseup', () => {
    state.isDragging = false;
  });

  container.addEventListener('mousemove', e => {
    if (!state.isDragging) return;
    const deltaX = e.clientX - state.previousMousePosition.x;
    architectureGroup.rotation.y += deltaX * 0.006;
    state.previousMousePosition = { x: e.clientX, y: e.clientY };
  });

  // Redimensionamento de Janela
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });

  // 8. Loop de Renderização e Animação
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    // Rotação suave contínua + Lerp de Parallax do Mouse
    if (!state.isDragging) {
      architectureGroup.rotation.y += 0.0018;
      architectureGroup.rotation.y += (state.targetRotationY - architectureGroup.rotation.y * 0.1) * 0.02;
    }

    // Efeito de Scroll Parallax no Three.js
    const scrollFactor = window.scrollY * 0.003;
    camera.position.y = 12 + Math.sin(scrollFactor) * 2;
    camera.lookAt(0, 7, 0);

    // Ondulação das partículas douradas
    const positions = particleGeo.attributes.position.array;
    for (let i = 0; i < particlesCount; i++) {
      positions[i * 3 + 1] += Math.sin(elapsedTime + i) * 0.015;
      if (positions[i * 3 + 1] > 35) positions[i * 3 + 1] = 0;
    }
    particleGeo.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
  }

  animate();
})();
