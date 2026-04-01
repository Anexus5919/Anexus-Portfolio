import * as THREE from 'three';

// ── Project Data ──
const projects = [
    {
        title: 'Secure Ephemeral Messaging',
        type: 'Personal Project',
        desc: 'Privacy-focused real-time chat with 2-participant rooms and auto-destructing messages via TTL-based eviction.',
        tags: ['Next.js 16', 'ElysiaJS', 'Upstash', 'Eden Treaty'],
        image: 'public/realtime_chat.png',
        github: 'https://github.com/Anexus5919/realtime-chat',
        live: 'https://realtime-chat-ivory-rho.vercel.app'
    },
    {
        title: 'Player Profile System',
        type: 'Internship Project',
        desc: 'Web app for athletes to create and showcase professional sports profiles with stats, achievements, and media.',
        tags: ['Next.js 16', 'MongoDB', 'React', 'Cloudinary'],
        image: 'public/player_profile.png',
        github: 'https://github.com/Anexus5919/player-profile-system',
        live: 'https://player-profile-system.vercel.app'
    },
    {
        title: 'Foodie - Food Delivery App',
        type: 'StackHack 3.0',
        desc: 'End-to-end food ordering with AI-assisted ordering and real-time tracking across multiple states.',
        tags: ['Next.js 15', 'AI Integration', 'Real-time Tracking'],
        image: 'public/foodie.png',
        github: 'https://github.com/Anexus5919/foodie',
        live: 'https://foodie-three-sigma.vercel.app'
    },
    {
        title: 'RoamIQ - Trip Planner',
        type: 'Gradguide Internship',
        desc: 'Intelligent travel itinerary generator with 100% real locations using local Llama 3 models.',
        tags: ['Next.js 15', 'Llama 3', 'TomTom API', 'SerpAPI'],
        image: 'public/roamiq.png',
        github: 'https://github.com/Anexus5919/RoamIQ',
        live: 'https://roam-iq.vercel.app'
    },
    {
        title: 'EduSchedulAI',
        type: 'SIH 2025',
        desc: 'Smart academic scheduling aligned with NEP 2020 guidelines, featuring conflict-free schedule generation.',
        tags: ['Next.js 15', 'MongoDB', 'JWT', 'jsPDF'],
        image: 'public/eduschedule.png',
        github: 'https://github.com/Anexus5919/SIH_Prototype',
        live: 'https://sihvesit.vercel.app'
    },
    {
        title: 'Aimlabs - 3D Aim Trainer',
        type: 'Personal Project',
        desc: 'Web-based aim trainer with Three.js featuring multiple difficulty levels and performance tracking.',
        tags: ['Three.js', 'WebGL', 'Raycaster', 'Vite'],
        image: 'public/aimlabs.png',
        github: 'https://github.com/Anexus5919/Aimlabs',
        live: 'https://aimlabs-puce.vercel.app'
    },
    {
        title: 'Customizable 3D Cube',
        type: 'Personal Project',
        desc: 'Interactive 3D graphics with real-time customization via lil-gui debug panel and GSAP animations.',
        tags: ['Three.js', 'WebGL', 'GSAP', 'lil-gui'],
        image: 'public/customizable_cube.png',
        github: 'https://github.com/Anexus5919/Customizable-cube',
        live: 'https://customizable-cube.vercel.app'
    },
    {
        title: 'Student Management System',
        type: 'Personal Project',
        desc: 'Desktop app for managing student records with authentication, analytics, and report generation.',
        tags: ['Python', 'Tkinter', 'SQL'],
        image: 'public/student_management_system.png',
        github: 'https://github.com/Anexus5919/Student_Management_System',
        live: null
    }
];

// ── Detect theme for fog color ──
function getFogColor() {
    const theme = document.documentElement.getAttribute('data-theme');
    return theme === 'light' ? 0xffffff : 0x0a0a0b;
}

function getBgColor() {
    const theme = document.documentElement.getAttribute('data-theme');
    return theme === 'light' ? 0xffffff : 0x0a0a0b;
}

// ── Scene Setup ──
const canvas = document.getElementById('carousel-canvas');
if (!canvas) throw new Error('Carousel canvas not found');

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(getFogColor(), 8, 20);

const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
camera.position.set(0, 0, 14);

// ── Lighting ──
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

const mainLight = new THREE.DirectionalLight(0xffffff, 1.0);
mainLight.position.set(5, 5, 5);
scene.add(mainLight);

const fillLight = new THREE.DirectionalLight(0x6366f1, 0.3);
fillLight.position.set(-3, 2, -3);
scene.add(fillLight);

const rimLight = new THREE.PointLight(0xd946ef, 0.5, 25);
rimLight.position.set(0, 4, -6);
scene.add(rimLight);

// ── Canvas texture helpers ──
function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + ' ';
        if (ctx.measureText(testLine).width > maxWidth && i > 0) {
            ctx.fillText(line.trim(), x, y);
            line = words[i] + ' ';
            y += lineHeight;
        } else {
            line = testLine;
        }
    }
    ctx.fillText(line.trim(), x, y);
}

function createCardTexture(imageSrc, title, type) {
    return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';

        const buildTexture = (imgElement) => {
            const cvs = document.createElement('canvas');
            const w = 580;
            const h = 520;
            cvs.width = w;
            cvs.height = h;
            const ctx = cvs.getContext('2d');
            const r = 24;

            // Card background
            ctx.fillStyle = '#18181b';
            roundRect(ctx, 0, 0, w, h, r);
            ctx.fill();

            // Image area - takes up most of the card
            const imgH = 340;
            if (imgElement) {
                ctx.save();
                roundRect(ctx, 10, 10, w - 20, imgH, 18);
                ctx.clip();
                ctx.drawImage(imgElement, 10, 10, w - 20, imgH);
                ctx.restore();

                // Bottom gradient fade
                const grad = ctx.createLinearGradient(0, imgH - 60, 0, imgH + 10);
                grad.addColorStop(0, 'rgba(24, 24, 27, 0)');
                grad.addColorStop(1, 'rgba(24, 24, 27, 1)');
                ctx.fillStyle = grad;
                ctx.fillRect(10, imgH - 60, w - 20, 70);
            } else {
                const grad = ctx.createLinearGradient(0, 0, w, imgH);
                grad.addColorStop(0, '#1e1b4b');
                grad.addColorStop(1, '#312e81');
                ctx.save();
                roundRect(ctx, 10, 10, w - 20, imgH, 18);
                ctx.clip();
                ctx.fillStyle = grad;
                ctx.fillRect(10, 10, w - 20, imgH);
                ctx.restore();
            }

            // Title
            ctx.fillStyle = '#e4e4e7';
            ctx.font = 'bold 24px Inter, system-ui, sans-serif';
            wrapText(ctx, title, 20, imgH + 36, w - 40, 30);

            // Type badge
            const typeText = type.toUpperCase();
            ctx.font = '600 13px Inter, system-ui, sans-serif';
            const typeWidth = ctx.measureText(typeText).width + 18;
            const badgeY = imgH + 68;

            const gradient = ctx.createLinearGradient(20, badgeY - 10, 20 + typeWidth, badgeY + 8);
            gradient.addColorStop(0, '#6366f1');
            gradient.addColorStop(1, '#8b5cf6');
            ctx.fillStyle = gradient;
            roundRect(ctx, 20, badgeY - 12, typeWidth, 22, 5);
            ctx.fill();

            ctx.fillStyle = '#ffffff';
            ctx.fillText(typeText, 29, badgeY + 2);

            // Subtle border
            ctx.strokeStyle = 'rgba(99, 102, 241, 0.2)';
            ctx.lineWidth = 1.5;
            roundRect(ctx, 0.75, 0.75, w - 1.5, h - 1.5, r);
            ctx.stroke();

            const texture = new THREE.CanvasTexture(cvs);
            texture.colorSpace = THREE.SRGBColorSpace;
            resolve(texture);
        };

        img.onload = () => buildTexture(img);
        img.onerror = () => buildTexture(null);
        img.src = imageSrc;
    });
}

// ── Carousel ──
const carouselGroup = new THREE.Group();
carouselGroup.rotation.z = 0.08;
scene.add(carouselGroup);

const cardMeshes = [];
const RADIUS = 6.5;
const CARD_W = 2.8;
const CARD_H = 2.5;

async function initCards() {
    const texturePromises = projects.map((p) =>
        createCardTexture(p.image, p.title, p.type)
    );
    const textures = await Promise.all(texturePromises);

    for (let i = 0; i < projects.length; i++) {
        const angle = (i / projects.length) * Math.PI * 2;

        const geometry = new THREE.PlaneGeometry(CARD_W, CARD_H);
        const material = new THREE.MeshStandardMaterial({
            map: textures[i],
            side: THREE.DoubleSide,
            roughness: 0.35,
            metalness: 0.05,
            transparent: true
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = Math.sin(angle) * RADIUS;
        mesh.position.z = Math.cos(angle) * RADIUS;
        mesh.position.y = 0;

        // Face outward from center
        mesh.lookAt(0, 0, 0);
        mesh.rotateY(Math.PI);

        mesh.userData = { index: i, baseAngle: angle };
        cardMeshes.push(mesh);
        carouselGroup.add(mesh);
    }
}

// ── Scroll tracking ──
let scrollProgress = 0;
let targetRotation = 0;
let currentRotation = 0;

function updateScrollProgress() {
    const section = document.getElementById('projects');
    if (!section) return;

    const rect = section.getBoundingClientRect();
    const sectionHeight = section.offsetHeight - window.innerHeight;

    if (sectionHeight <= 0) return;

    const progress = Math.max(0, Math.min(1, -rect.top / sectionHeight));
    scrollProgress = progress;
    targetRotation = progress * Math.PI * 4;
}

window.addEventListener('scroll', updateScrollProgress, { passive: true });

// ── Mouse tracking ──
const mouse = { x: 0, y: 0 };
window.addEventListener('mousemove', (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
}, { passive: true });

// ── Raycaster & interaction ──
const raycaster = new THREE.Raycaster();
const mouseVec = new THREE.Vector2();
let hoveredCard = null;
let activeCard = null;

const infoPanel = document.getElementById('carousel-project-info');
const infoTitle = document.getElementById('carousel-info-title');
const infoType = document.getElementById('carousel-info-type');
const infoDesc = document.getElementById('carousel-info-desc');
const infoTags = document.getElementById('carousel-info-tags');
const infoLinks = document.getElementById('carousel-info-links');

function updateInfoPanel(index) {
    if (index === null) {
        infoPanel.classList.remove('visible');
        return;
    }
    const p = projects[index];
    infoTitle.textContent = p.title;
    infoType.textContent = p.type;
    infoDesc.textContent = p.desc;
    infoTags.innerHTML = p.tags.map(t => `<span class="tag">${t}</span>`).join('');

    let links = `<a href="${p.github}" target="_blank" rel="noopener">GitHub</a>`;
    if (p.live) {
        links += `<a href="${p.live}" target="_blank" rel="noopener">Live Demo</a>`;
    }
    infoLinks.innerHTML = links;
    infoPanel.classList.add('visible');
}

canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseVec.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouseVec.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
}, { passive: true });

canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseVec.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouseVec.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouseVec, camera);
    const intersects = raycaster.intersectObjects(cardMeshes);

    if (intersects.length > 0) {
        const idx = intersects[0].object.userData.index;
        activeCard = activeCard === idx ? null : idx;
        updateInfoPanel(activeCard);
    } else {
        activeCard = null;
        updateInfoPanel(null);
    }
});

// ── Lerp ──
function lerp(a, b, t) {
    return a + (b - a) * t;
}

// ── Resize ──
function handleResize() {
    const wrapper = canvas.parentElement;
    const w = wrapper.clientWidth;
    const h = wrapper.clientHeight;

    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
}

window.addEventListener('resize', handleResize);

// ── Theme observer ──
const themeObserver = new MutationObserver(() => {
    const fogColor = getFogColor();
    scene.fog.color.setHex(fogColor);
    renderer.setClearColor(fogColor, 0);
});
themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme']
});

// ── Animation ──
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);

    // Smooth rotation
    currentRotation = lerp(currentRotation, targetRotation, 0.06);
    carouselGroup.rotation.y = currentRotation;

    // Camera follows mouse
    camera.position.x = lerp(camera.position.x, mouse.x * 1.2, 0.03);
    camera.position.y = lerp(camera.position.y, mouse.y * 0.6, 0.03);
    camera.lookAt(0, 0, 0);

    // Raycaster hover detection
    raycaster.setFromCamera(mouseVec, camera);
    const intersects = raycaster.intersectObjects(cardMeshes);

    hoveredCard = intersects.length > 0 ? intersects[0].object.userData.index : null;
    canvas.style.cursor = hoveredCard !== null ? 'pointer' : 'default';

    // Card animations
    const elapsed = clock.getElapsedTime();
    cardMeshes.forEach((mesh, i) => {
        const isActive = hoveredCard === i || activeCard === i;
        const targetScale = isActive ? 1.1 : 1.0;
        mesh.scale.x = lerp(mesh.scale.x, targetScale, 0.1);
        mesh.scale.y = lerp(mesh.scale.y, targetScale, 0.1);

        // Floating bob
        mesh.position.y = Math.sin(elapsed * 0.6 + mesh.userData.baseAngle * 2) * 0.12;
    });

    // Show info
    if (activeCard !== null) {
        updateInfoPanel(activeCard);
    } else if (hoveredCard !== null) {
        updateInfoPanel(hoveredCard);
    } else {
        updateInfoPanel(null);
    }

    renderer.render(scene, camera);
}

// ── Init ──
initCards().then(() => {
    handleResize();
    animate();
});
