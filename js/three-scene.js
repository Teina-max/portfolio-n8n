/**
 * Three.js Scene - Portfolio n8n Style
 * =====================================
 * Handles: 3D Webhook node, zoom révélateur effect, floating skills
 *
 * @version 2.0 - Zoom Révélateur
 */

class N8NScene {
  constructor(container) {
    this.container = container;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.webhookNode = null;
    this.floatingSkills = [];
    this.lights = [];
    this.isEnabled = true;
    this.scrollProgress = 0;
    this.clock = new THREE.Clock();

    // Check for reduced motion preference
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Disable on mobile for performance (will use CSS fallback)
    this.isMobile = window.innerWidth < 768;

    if (this.prefersReducedMotion || this.isMobile) {
      this.isEnabled = false;
      return;
    }

    this.init();
  }

  init() {
    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = null; // Transparent

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.z = 8;

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x000000, 0);

    this.container.appendChild(this.renderer.domElement);

    // Mark Three.js as active
    document.body.classList.add('three-active');

    // Lights
    this.setupLights();

    // Create webhook node
    this.createWebhookNode();

    // Create floating skills (will appear after zoom)
    this.createFloatingSkills();

    // Dissolve particles disabled
    // this.createDissolveParticles();

    // Event listeners
    window.addEventListener('resize', () => this.onResize());

    // Start render loop
    this.animate();
  }

  setupLights() {
    // Ambient light
    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambient);
    this.lights.push(ambient);

    // Main directional light
    const directional = new THREE.DirectionalLight(0xffffff, 0.8);
    directional.position.set(5, 5, 5);
    this.scene.add(directional);
    this.lights.push(directional);

    // Accent light (n8n orange tint)
    const accent = new THREE.PointLight(0xFF6D5A, 0.5, 20);
    accent.position.set(-3, 2, 4);
    this.scene.add(accent);
    this.lights.push(accent);

    // Back light for depth
    const backLight = new THREE.PointLight(0x4ECDC4, 0.3, 30);
    backLight.position.set(0, 0, -10);
    this.scene.add(backLight);
    this.lights.push(backLight);
  }

  // Create text texture from canvas
  createTextTexture(text, options = {}) {
    const {
      fontSize = 48,
      fontFamily = 'Inter, Arial, sans-serif',
      color = '#ffffff',
      backgroundColor = null,
      width = 512,
      height = 128,
      align = 'left',
      paddingLeft = 20
    } = options;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    if (backgroundColor) {
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, width, height);
    } else {
      ctx.clearRect(0, 0, width, height);
    }

    ctx.font = `500 ${fontSize}px ${fontFamily}`;
    ctx.fillStyle = color;
    ctx.textBaseline = 'middle';

    if (align === 'center') {
      ctx.textAlign = 'center';
      ctx.fillText(text, width / 2, height / 2);
    } else {
      ctx.textAlign = 'left';
      ctx.fillText(text, paddingLeft, height / 2);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }

  // Create webhook icon texture
  createIconTexture() {
    const size = 128;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, size, size);
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();

    const centerX = size / 2;
    const centerY = size / 2;
    const scale = size * 0.35;

    // Lightning bolt shape
    ctx.moveTo(centerX + scale * 0.1, centerY - scale * 0.9);
    ctx.lineTo(centerX - scale * 0.4, centerY + scale * 0.1);
    ctx.lineTo(centerX - scale * 0.05, centerY + scale * 0.1);
    ctx.lineTo(centerX - scale * 0.15, centerY + scale * 0.9);
    ctx.lineTo(centerX + scale * 0.35, centerY - scale * 0.1);
    ctx.lineTo(centerX + scale * 0.05, centerY - scale * 0.1);
    ctx.closePath();
    ctx.fill();

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }

  // Helper to create rounded rectangle shape
  createRoundedRectShape(width, height, radius) {
    const shape = new THREE.Shape();
    const x = -width / 2;
    const y = -height / 2;

    shape.moveTo(x + radius, y);
    shape.lineTo(x + width - radius, y);
    shape.quadraticCurveTo(x + width, y, x + width, y + radius);
    shape.lineTo(x + width, y + height - radius);
    shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    shape.lineTo(x + radius, y + height);
    shape.quadraticCurveTo(x, y + height, x, y + height - radius);
    shape.lineTo(x, y + radius);
    shape.quadraticCurveTo(x, y, x + radius, y);

    return shape;
  }

  createWebhookNode() {
    this.webhookNode = new THREE.Group();

    const nodeWidth = 5;
    const nodeHeight = 3;
    const headerHeight = 0.8;
    const cornerRadius = 0.25;

    // Main body with rounded corners
    const bodyShape = this.createRoundedRectShape(nodeWidth, nodeHeight, cornerRadius);
    const extrudeSettings = { depth: 0.3, bevelEnabled: false };
    const bodyGeometry = new THREE.ExtrudeGeometry(bodyShape, extrudeSettings);
    bodyGeometry.center();

    // Custom shader material for dissolve effect
    this.nodeMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      metalness: 0.1,
      roughness: 0.8,
      transparent: true,
      opacity: 1,
    });

    const body = new THREE.Mesh(bodyGeometry, this.nodeMaterial);
    body.rotation.x = Math.PI;
    this.webhookNode.add(body);

    // Header (orange top) - rounded top corners (bottom in shape due to rotation)
    const headerY = (nodeHeight / 2) - (headerHeight / 2);
    const headerShape = new THREE.Shape();
    const hx = -nodeWidth / 2;
    const hy = -headerHeight / 2;
    const hr = cornerRadius;

    // Start at bottom-left + radius (will be top-left after rotation)
    headerShape.moveTo(hx + hr, hy);
    // Bottom-left corner rounded
    headerShape.quadraticCurveTo(hx, hy, hx, hy + hr);
    // Left side up
    headerShape.lineTo(hx, hy + headerHeight);
    // Top edge (straight - joins with body)
    headerShape.lineTo(hx + nodeWidth, hy + headerHeight);
    // Right side down
    headerShape.lineTo(hx + nodeWidth, hy + hr);
    // Bottom-right corner rounded
    headerShape.quadraticCurveTo(hx + nodeWidth, hy, hx + nodeWidth - hr, hy);
    // Bottom edge back to start
    headerShape.lineTo(hx + hr, hy);

    const headerExtrudeSettings = { depth: 0.32, bevelEnabled: false };
    const headerGeometry = new THREE.ExtrudeGeometry(headerShape, headerExtrudeSettings);
    headerGeometry.center();

    this.headerMaterial = new THREE.MeshStandardMaterial({
      color: 0xFF6D5A,
      metalness: 0.2,
      roughness: 0.6,
      emissive: 0xFF6D5A,
      emissiveIntensity: 0.15,
      transparent: true,
      opacity: 1,
    });

    const header = new THREE.Mesh(headerGeometry, this.headerMaterial);
    header.rotation.x = Math.PI;
    header.position.y = headerY;
    header.position.z = 0.02;
    this.webhookNode.add(header);

    // Header text
    const headerTextTexture = this.createTextTexture('Webhook', {
      fontSize: 48,
      color: '#ffffff',
      width: 512,
      height: 100,
      paddingLeft: 80
    });
    const headerTextGeometry = new THREE.PlaneGeometry(nodeWidth * 0.9, headerHeight * 0.8);
    this.headerTextMaterial = new THREE.MeshBasicMaterial({
      map: headerTextTexture,
      transparent: true,
      depthWrite: false,
      opacity: 1,
    });
    const headerText = new THREE.Mesh(headerTextGeometry, this.headerTextMaterial);
    headerText.position.set(0, headerY, 0.2);
    this.webhookNode.add(headerText);

    // Icon
    const iconTexture = this.createIconTexture();
    const iconGeometry = new THREE.PlaneGeometry(0.55, 0.55);
    this.iconMaterial = new THREE.MeshBasicMaterial({
      map: iconTexture,
      transparent: true,
      depthWrite: false,
      opacity: 1,
    });
    const icon = new THREE.Mesh(iconGeometry, this.iconMaterial);
    icon.position.set(-nodeWidth / 2 + 0.55, headerY, 0.22);
    this.webhookNode.add(icon);

    // Content - Method field
    const methodTexture = this.createTextTexture('Method          GET', {
      fontSize: 36,
      color: '#cccccc',
      width: 512,
      height: 70,
      paddingLeft: 40
    });
    const methodGeometry = new THREE.PlaneGeometry(nodeWidth * 0.9, 0.6);
    this.methodMaterial = new THREE.MeshBasicMaterial({
      map: methodTexture,
      transparent: true,
      depthWrite: false,
      opacity: 1,
    });
    const methodText = new THREE.Mesh(methodGeometry, this.methodMaterial);
    methodText.position.set(0, 0.2, 0.18);
    this.webhookNode.add(methodText);

    // Content - Path field
    const pathTexture = this.createTextTexture('Path            /teina', {
      fontSize: 36,
      color: '#cccccc',
      width: 512,
      height: 70,
      paddingLeft: 40
    });
    const pathGeometry = new THREE.PlaneGeometry(nodeWidth * 0.9, 0.6);
    this.pathMaterial = new THREE.MeshBasicMaterial({
      map: pathTexture,
      transparent: true,
      depthWrite: false,
      opacity: 1,
    });
    const pathText = new THREE.Mesh(pathGeometry, this.pathMaterial);
    pathText.position.set(0, -0.5, 0.18);
    this.webhookNode.add(pathText);

    // Connectors
    const connectorGeometry = new THREE.CircleGeometry(0.18, 16);
    this.connectorMaterial = new THREE.MeshBasicMaterial({
      color: 0x555555,
      transparent: true,
      opacity: 1,
    });
    const connector = new THREE.Mesh(connectorGeometry, this.connectorMaterial.clone());
    connector.position.set(nodeWidth / 2 + 0.1, 0, 0.2);
    this.webhookNode.add(connector);

    const inputConnector = new THREE.Mesh(connectorGeometry.clone(), this.connectorMaterial.clone());
    inputConnector.position.set(-nodeWidth / 2 - 0.1, 0, 0.2);
    this.webhookNode.add(inputConnector);

    // Edge glow
    const edgesGeometry = new THREE.EdgesGeometry(bodyGeometry);
    this.edgesMaterial = new THREE.LineBasicMaterial({
      color: 0x333333,
      linewidth: 1,
      transparent: true,
      opacity: 1,
    });
    const edges = new THREE.LineSegments(edgesGeometry, this.edgesMaterial);
    this.webhookNode.add(edges);

    // Initial rotation
    this.webhookNode.rotation.x = -0.1;
    this.webhookNode.rotation.y = 0.05;

    this.scene.add(this.webhookNode);

    // Store all materials for dissolve effect
    this.allNodeMaterials = [
      this.nodeMaterial,
      this.headerMaterial,
      this.headerTextMaterial,
      this.iconMaterial,
      this.methodMaterial,
      this.pathMaterial,
      this.connectorMaterial,
      this.edgesMaterial,
    ];
  }

  createFloatingSkills() {
    // Skills configuration with Cloudinary SVG logos
    const skillsConfig = [
      {
        label: 'n8n',
        logo: 'https://res.cloudinary.com/dttleawx6/image/upload/v1769287654/webhook_dxqtct.svg',
        color: 0xFF6D5A,
        pos: [-4, 2, -5]
      },
      {
        label: 'Supabase',
        logo: 'https://res.cloudinary.com/dttleawx6/image/upload/v1769287656/supabase_nruncw.svg',
        color: 0x3ECF8E,
        pos: [4, 1.5, -6]
      },
      {
        label: 'OpenAI',
        logo: 'https://res.cloudinary.com/dttleawx6/image/upload/v1769287656/openAi_tsx74r.svg',
        color: 0x9B59B6,
        pos: [-3, -1, -4]
      },
      {
        label: 'Code',
        logo: 'https://res.cloudinary.com/dttleawx6/image/upload/v1769287655/code_fd7vx3.svg',
        color: 0x3498DB,
        pos: [3, -1.5, -5]
      },
      {
        label: 'Cron',
        logo: 'https://res.cloudinary.com/dttleawx6/image/upload/v1769287656/cron_evanat.svg',
        color: 0xFF6D5A,
        pos: [0, 2.5, -7]
      },
      {
        label: 'HTTP',
        logo: 'https://res.cloudinary.com/dttleawx6/image/upload/v1769287655/httprequest_rst7qw.svg',
        color: 0xE74C3C,
        pos: [-2, 0, -8]
      },
      {
        label: 'Merge',
        logo: 'https://res.cloudinary.com/dttleawx6/image/upload/v1769287657/merge_umcsrt.svg',
        color: 0xF39C12,
        pos: [2, 0.5, -9]
      },
      {
        label: 'Telegram',
        logo: 'https://res.cloudinary.com/dttleawx6/image/upload/v1769287655/telegram_w69bqd.svg',
        color: 0x0088CC,
        pos: [-1, -2, -6]
      },
    ];

    this.skillsGroup = new THREE.Group();
    this.skillsGroup.visible = false;

    // Texture loader
    const textureLoader = new THREE.TextureLoader();

    skillsConfig.forEach((skill) => {
      const skillGroup = new THREE.Group();

      // Create glow ring behind the logo (n8n grey style)
      const ringGeometry = new THREE.RingGeometry(0.5, 0.7, 32);
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: 0x333333,
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
      });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.position.z = -0.05;
      skillGroup.add(ring);

      // Create plane for the logo
      const planeGeometry = new THREE.PlaneGeometry(1, 1);
      const planeMaterial = new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
        depthWrite: false,
      });

      // Load SVG texture
      textureLoader.load(skill.logo, (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        planeMaterial.map = texture;
        planeMaterial.needsUpdate = true;
      });

      const plane = new THREE.Mesh(planeGeometry, planeMaterial);
      skillGroup.add(plane);

      // Create label below
      const labelTexture = this.createTextTexture(skill.label, {
        fontSize: 28,
        color: '#ffffff',
        width: 200,
        height: 50,
        align: 'center'
      });
      const labelGeometry = new THREE.PlaneGeometry(1.2, 0.3);
      const labelMaterial = new THREE.MeshBasicMaterial({
        map: labelTexture,
        transparent: true,
        opacity: 0,
        depthWrite: false,
      });
      const label = new THREE.Mesh(labelGeometry, labelMaterial);
      label.position.y = -0.75;
      skillGroup.add(label);

      skillGroup.position.set(...skill.pos);
      skillGroup.userData = {
        basePos: [...skill.pos],
        phase: Math.random() * Math.PI * 2,
        speed: 0.5 + Math.random() * 0.5,
        materials: [ringMaterial, planeMaterial, labelMaterial],
      };

      this.skillsGroup.add(skillGroup);
      this.floatingSkills.push(skillGroup);
    });

    this.scene.add(this.skillsGroup);
  }

  createDissolveParticles() {
    // Particles for dissolve/reveal effect
    const particleCount = 150;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    const color1 = new THREE.Color(0xFF6D5A); // Orange
    const color2 = new THREE.Color(0x4ECDC4); // Teal

    for (let i = 0; i < particleCount; i++) {
      // Spread around the node area
      const angle = Math.random() * Math.PI * 2;
      const radius = 1 + Math.random() * 4;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 4;
      positions[i * 3 + 2] = -Math.random() * 20;

      // Random color between orange and teal
      const mixRatio = Math.random();
      const mixedColor = color1.clone().lerp(color2, mixRatio);
      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;

      sizes[i] = Math.random() * 0.1 + 0.02;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.08,
      transparent: true,
      opacity: 0,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });

    this.dissolveParticles = new THREE.Points(particleGeometry, particleMaterial);
    this.scene.add(this.dissolveParticles);
  }

  // Main scroll update - called from ScrollAnimations
  updateScroll(progress) {
    if (!this.isEnabled || !this.webhookNode) return;

    this.scrollProgress = progress;

    // Phase 1: 0-50% - Zoom into the node
    // Phase 2: 50-80% - Dissolve the node, reveal skills
    // Phase 3: 80-100% - Skills fully visible, camera settles

    if (progress <= 0.5) {
      // Phase 1: Zoom in
      this.updatePhase1(progress / 0.5);
    } else if (progress <= 0.8) {
      // Phase 2: Dissolve
      this.updatePhase2((progress - 0.5) / 0.3);
    } else {
      // Phase 3: Skills world
      this.updatePhase3((progress - 0.8) / 0.2);
    }
  }

  updatePhase1(t) {
    // t goes from 0 to 1 during phase 1

    // Camera zooms forward
    this.camera.position.z = 8 - (t * 6); // 8 → 2

    // Node scales up slightly and rotates
    const scale = 1 + t * 0.3;
    this.webhookNode.scale.set(scale, scale, scale);
    this.webhookNode.rotation.y = 0.05 + t * 0.1;
    this.webhookNode.rotation.x = -0.1 + t * 0.05;

    // Node fully visible
    this.setNodeOpacity(1);

    // Particles disabled

    // Skills hidden
    this.skillsGroup.visible = false;
  }

  updatePhase2(t) {
    // t goes from 0 to 1 during phase 2

    // Camera continues forward
    this.camera.position.z = 2 - (t * 4); // 2 → -2

    // Node dissolves (fade out + scale up)
    const nodeOpacity = 1 - t;
    const nodeScale = 1.3 + t * 2;

    this.webhookNode.scale.set(nodeScale, nodeScale, nodeScale);
    this.setNodeOpacity(nodeOpacity);

    // Particles disabled

    // Skills start appearing
    this.skillsGroup.visible = true;
    const skillsOpacity = t;
    this.floatingSkills.forEach(skill => {
      skill.userData.materials.forEach(mat => {
        mat.opacity = skillsOpacity;
      });
    });
  }

  updatePhase3(t) {
    // t goes from 0 to 1 during phase 3

    // Camera settles
    this.camera.position.z = -2 - (t * 2); // -2 → -4

    // Node fully dissolved
    this.webhookNode.visible = false;

    // Particles disabled

    // Skills fully visible and floating
    this.floatingSkills.forEach(skill => {
      skill.userData.materials.forEach(mat => {
        mat.opacity = 1;
      });
    });
  }

  setNodeOpacity(opacity) {
    this.allNodeMaterials.forEach(material => {
      if (material && material.opacity !== undefined) {
        material.opacity = opacity;
      }
    });
    this.webhookNode.visible = opacity > 0.01;
  }

  animate() {
    if (!this.isEnabled) return;

    requestAnimationFrame(() => this.animate());

    const time = this.clock.getElapsedTime();

    // Animate floating skills
    if (this.skillsGroup.visible) {
      this.floatingSkills.forEach((skill, i) => {
        const { basePos, phase, speed } = skill.userData;

        // Gentle floating motion
        skill.position.x = basePos[0] + Math.sin(time * speed + phase) * 0.3;
        skill.position.y = basePos[1] + Math.cos(time * speed * 0.7 + phase) * 0.2;
        skill.position.z = basePos[2] + Math.sin(time * speed * 0.5 + phase) * 0.15;

        // Gentle rotation
        skill.rotation.y = Math.sin(time * 0.5 + phase) * 0.2;
      });
    }

    // Particles disabled

    // Idle animation for webhook node
    if (this.webhookNode.visible && this.scrollProgress < 0.1) {
      this.webhookNode.position.y = Math.sin(time) * 0.1;
    }

    this.renderer.render(this.scene, this.camera);
  }

  onResize() {
    if (!this.isEnabled) return;

    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  destroy() {
    if (this.renderer) {
      this.renderer.dispose();
      this.container.removeChild(this.renderer.domElement);
    }
    window.removeEventListener('resize', this.onResize);
  }
}

// Export for use
window.N8NScene = N8NScene;
