

const portfolioData = {
  sun: {
    name: "About Me",
    color: 0xfdb813,
    content: `
      <h2>☀️ About Me — Shalin Mishra</h2>
      <p>I am a developer passionate about real-world impactful projects:
      Web Dev, Flutter, Android, and FinTech.</p>

      <h3>Core Values</h3>
      <ul>
        <li>🚀 Continuous Learning</li>
        <li>💡 Creative Problem Solving</li>
        <li>🤝 Collaboration</li>
      </ul>
    `
  },

  planets: [
    {
      label: "Tech Skills",
      name: "Tech Skills",
      color: 0x4a90e2,
      size: 0.9,
      distance: 7,
      speed: 0.3,
      content: `
        <h2>🛠️ Technical Skills</h2>

        <h3>Web</h3>
        <ul>
          <li>JS / TS</li>
          <li>React, Node</li>
          <li>WebRTC, Three.js</li>
          <li>Firebase + Firestore</li>
        </ul>

        <h3>Mobile</h3>
        <ul>
          <li>Flutter (Dart)</li>
          <li>Android</li>
          <li>React Native</li>
        </ul>

        <h3>Tools</h3>
        <ul>
          <li>Git</li>
          <li>GCP & AWS</li>
          <li>Figma</li>
        </ul>
      `
    },

    {
      label: "Projects",
      name: "Projects",
      color: 0xe94b3c,
      size: 0.75,
      distance: 10,
      speed: 0.22,
      content: `
        <h2>🚀 Projects</h2>

        <h3>📡 Disaster Management System</h3>
        <ul>
          <li>WebRTC audio/data</li>
          <li>Firebase signaling</li>
        </ul>

        <h3> MyYojna</h3>
        <p>Platform to discover government schemes.</p>

        <h3> FinTech Mini Tools</h3>
        <p>Dashboards, finance utilities.</p>

        <h3> 3D Portfolio</h3>
        <p>This website!</p>
      `
    },

    {
      label: "Interests",
      name: "Interests",
      color: 0x6cc24a,
      size: 0.65,
      distance: 13,
      speed: 0.16,
      content: `
        <h2> Interests</h2>
        <ul>
          <li>Astronomy</li>
          <li>UI/UX</li>
          <li>Mobile Dev</li>
          <li>Finance</li>
          <li>Gaming</li>
          <li>Chess</li>
        </ul>

        <h3>Learning</h3>
        <p>WebGL shaders & animations.</p>
      `
    },

    {
      label: "Experience",
      name: "Experience",
      color: 0xf39c12,
      size: 0.7,
      distance: 16,
      speed: 0.14,
      content: `
        <h2> Experience</h2>

        <h3>Frontend Developer</h3>
        <ul>
          <li>React + Flutter apps</li>
          <li>Firebase integrations</li>
          <li>WebRTC experiments</li>
        </ul>

        <h3>Self Projects</h3>
        <ul>
          <li>Mobile apps</li>
          <li>FinTech tools</li>
        </ul>
      `
    },

    {
      label: "Contact",
      name: "Contact",
      color: 0x9b59b6,
      size: 0.6,
      distance: 19,
      speed: 0.1,
      content: `
        <h2> Contact</h2>

        <ul>
          <li>📧 mishrashalin599@gmail.com</li>
          <li>💼 linkedin.com/in/shalin-mishra-327423352</li>
          <li>🐙 github.com/Shalin1204</li>
        </ul>
      `
    }
  ]
};

/* 3.JS SETUP */

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  innerWidth / innerHeight,
  0.1,
  1000
);

// Camera positioned to see tilted plane better
camera.position.set(0, 12, 25);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById("canvas"),
  antialias: true
});
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(devicePixelRatio);

scene.add(new THREE.AmbientLight(0xffffff, 0.35));
const sunLight = new THREE.PointLight(0xffffff, 2, 150);
scene.add(sunLight);

/* 
   STARFIELD
*/

function createStars() {
  const geo = new THREE.BufferGeometry();
  const count = 2000;
  const pos = new Float32Array(count * 3);

  for (let i = 0; i < count * 3; i++) {
    pos[i] = (Math.random() - 0.5) * 300;
  }

  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  const mat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.6 });
  scene.add(new THREE.Points(geo, mat));
}
createStars();

/* SUN */

const sunGeo = new THREE.SphereGeometry(2.4, 32, 32);
const sunMat = new THREE.MeshBasicMaterial({
  color: portfolioData.sun.color
});
const sun = new THREE.Mesh(sunGeo, sunMat);
sun.userData = { data: portfolioData.sun };
scene.add(sun);

// Sun glow
const sunGlowGeo = new THREE.SphereGeometry(2.7, 32, 32);
const sunGlowMat = new THREE.MeshBasicMaterial({
  color: 0xffa500,
  transparent: true,
  opacity: 0.2,
  side: THREE.BackSide
});
const sunGlow = new THREE.Mesh(sunGlowGeo, sunGlowMat);
scene.add(sunGlow);

/*
   PLANETS WITH ORBITS*/

function makeTexture(hex) {
  const c = document.createElement("canvas");
  c.width = c.height = 512;
  const ctx = c.getContext("2d");

  ctx.fillStyle = hex;
  ctx.fillRect(0, 0, 512, 512);

  for (let i = 0; i < 40; i++) {
    ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.2})`;
    ctx.beginPath();
    ctx.arc(
      Math.random() * 512,
      Math.random() * 512,
      Math.random() * 50,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }

  return new THREE.CanvasTexture(c);
}

const planets = [];
const labelsContainer = document.getElementById("labels-container");
const TILT_ANGLE = Math.PI / 12; // 15 degrees tilt to prevent overlap

portfolioData.planets.forEach((p, i) => {
  // Planet mesh
  const geo = new THREE.SphereGeometry(p.size, 48, 48);
  const texture = makeTexture(`#${p.color.toString(16).padStart(6, "0")}`);

  const mat = new THREE.MeshStandardMaterial({
    map: texture,
    roughness: 0.7,
    metalness: 0.1,
    emissive: p.color,
    emissiveIntensity: 0.05
  });

  const mesh = new THREE.Mesh(geo, mat);
  mesh.userData = { data: p };
  scene.add(mesh);

  // Planet glow
  const glowGeo = new THREE.SphereGeometry(p.size * 1.15, 32, 32);
  const glowMat = new THREE.MeshBasicMaterial({
    color: p.color,
    transparent: true,
    opacity: 0.15,
    side: THREE.BackSide
  });
  const glow = new THREE.Mesh(glowGeo, glowMat);
  mesh.add(glow);

  // Orbit line (tilted)
  const orbitGeo = new THREE.BufferGeometry();
  const orbitPoints = [];
  const segments = 128;
  
  for (let j = 0; j <= segments; j++) {
    const angle = (j / segments) * Math.PI * 2;
    const x = Math.cos(angle) * p.distance;
    const y = Math.sin(angle) * p.distance * Math.sin(TILT_ANGLE);
    const z = Math.sin(angle) * p.distance * Math.cos(TILT_ANGLE);
    orbitPoints.push(x, y, z);
  }
  
  orbitGeo.setAttribute("position", new THREE.Float32BufferAttribute(orbitPoints, 3));
  const orbitMat = new THREE.LineBasicMaterial({
    color: p.color,
    transparent: true,
    opacity: 0.4
  });
  const orbitLine = new THREE.Line(orbitGeo, orbitMat);
  scene.add(orbitLine);

  // Label element
  const label = document.createElement("div");
  label.className = "planet-label";
  label.innerText = p.label;
  labelsContainer.appendChild(label);

  planets.push({
    mesh,
    distance: p.distance,
    speed: p.speed,
    angle: (i / portfolioData.planets.length) * Math.PI * 2,
    label,
    originalScale: 1
  });
});

/* 
   CAMERA CONTROLS
*/

let isDragging = false;
let prevX = 0;

window.addEventListener("mousedown", e => {
  isDragging = true;
  prevX = e.clientX;
});

window.addEventListener("mouseup", () => {
  isDragging = false;
});

window.addEventListener("mousemove", e => {
  if (isDragging) {
    const dx = e.clientX - prevX;
    camera.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), dx * 0.0027);
    camera.lookAt(0, 0, 0);
    prevX = e.clientX;
  }
});

window.addEventListener("wheel", e => {
  const zoomFactor = 1 + e.deltaY * 0.0013;
  camera.position.multiplyScalar(zoomFactor);
  camera.position.clampLength(10, 50);
});

/* 
   HOVER & CLICK INTERACTION
*/

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let hoveredPlanet = null;

// Map labels to page section IDs for navigation
const sectionMap = {
  "About Me": "about",
  "Tech Skills": "skills",
  "Projects": "projects",
  "Interests": "interests",
  "Experience": "experience",
  "Contact": "contact"
};

window.addEventListener("mousemove", e => {
  if (!isDragging) {
    mouse.x = (e.clientX / innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const hits = raycaster.intersectObjects([sun, ...planets.map(p => p.mesh)]);

    if (hits.length > 0) {
      document.body.style.cursor = "pointer";
      hoveredPlanet = hits[0].object;
    } else {
      document.body.style.cursor = "default";
      hoveredPlanet = null;
    }
  }
});

window.addEventListener("click", event => {
  if (isDragging) return;

  mouse.x = (event.clientX / innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const hits = raycaster.intersectObjects([sun, ...planets.map(p => p.mesh)]);

  if (hits.length) {
    const obj = hits[0].object;
    const label = obj.userData.data?.label || obj.userData.data?.name;
    const sectionId = sectionMap[label];

    if (sectionId) {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else {
      showPanel(obj.userData.data);
    }
  }
});

/* 
   PANEL FUNCTIONS
*/

function showPanel(data) {
  const panel = document.getElementById("infoPanel");
  document.getElementById("panelContent").innerHTML = data.content;
  panel.classList.add("active");
}

function closePanel() {
  document.getElementById("infoPanel").classList.remove("active");
}

/* 
   ANIMATION + LABEL TRACKING
 */

function animate() {
  requestAnimationFrame(animate);

  sun.rotation.y += 0.003;
  sunGlow.rotation.y -= 0.002;

  planets.forEach(p => {
    p.angle += p.speed * 0.006;

    // Position on tilted orbit
    const x = Math.cos(p.angle) * p.distance;
    const y = Math.sin(p.angle) * p.distance * Math.sin(TILT_ANGLE);
    const z = Math.sin(p.angle) * p.distance * Math.cos(TILT_ANGLE);

    p.mesh.position.set(x, y, z);
    p.mesh.rotation.y += 0.01;

    // Hover scale effect
    if (hoveredPlanet === p.mesh) {
      p.mesh.scale.lerp(new THREE.Vector3(1.3, 1.3, 1.3), 0.1);
    } else {
      p.mesh.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
    }

    // Project label position
    const vector = p.mesh.position.clone();
    vector.project(camera);

    const sx = (vector.x * 0.5 + 0.5) * innerWidth;
    const sy = (-vector.y * 0.5 + 0.5) * innerHeight;

    p.label.style.left = `${sx}px`;
    p.label.style.top = `${sy + 25}px`; // Below planet
    
    // Hide label if behind camera
    p.label.style.opacity = vector.z < 1 ? "1" : "0";
  });

  renderer.render(scene, camera);
}

animate();

/* 
   RESIZE
*/

window.addEventListener("resize", () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});
