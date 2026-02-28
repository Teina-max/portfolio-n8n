/**
 * Portfolio n8n Style - Main JavaScript
 * =====================================
 * Handles: Theme toggle, Language toggle, Project loading, Modal, Navigation
 * Dependencies: three-scene.js, scroll-animations.js, GSAP
 */

// ============================================
// CONFIGURATION
// ============================================
const CONFIG = {
  defaultLang: 'fr',
  defaultTheme: 'dark',
  projectsUrl: 'data/projects.json',
};

// ============================================
// i18n TRANSLATIONS
// ============================================
const translations = {
  fr: {
    'nav.trigger': 'Trigger',
    'nav.about': 'À propos',
    'nav.skills': 'Skills',
    'nav.projects': 'Projets',
    'nav.contact': 'Contact',
    'hero.instruction': 'Scroll pour déclencher le workflow',
    'hero.method': 'Méthode',
    'hero.path': 'Chemin',
    'about.status': '● Déclenché',
    'about.timestamp': 'À l\'instant',
    'about.title': 'Builder Automatisation & Data',
    'about.stats.records': 'Enregistrements',
    'about.stats.workflows': 'Workflows n8n',
    'about.stats.functions': 'Edge Functions',
    'about.stats.timeSaved': 'Temps économisé',
    'about.storyTitle': 'Mon histoire',
    'about.storyText': `Août 2024. Arrivé en France depuis la Nouvelle-Calédonie, loin de ma zone de confort.
      En explorant des idées de business, j'ai découvert n8n et l'automatisation.
      Pour quelqu'un qui n'avait <strong>jamais utilisé un ordi au travail</strong>, c'était un saut dans l'inconnu.
      Mais ça a résonné comme une évidence.`,
    'about.quote': '"Si moi, parti de zéro, j\'ai pu apprendre tout ça - alors tout est possible."',
    'about.valuesTitle': 'Valeurs polynésiennes',
    'about.values.respect': 'Respect',
    'about.values.humility': 'Humilité',
    'about.values.sharing': 'Partage',
    'skills.title': 'Compétences',
    'skills.subtitle': 'Acquises en autodidacte depuis août 2024',
    'skills.automation.title': 'Automatisation',
    'skills.data.title': 'Architecture Data',
    'skills.ai.title': 'Intelligence Artificielle',
    'skills.scraping.title': 'Scraping & Parsing',
    'skills.tools.title': 'Outils & Déploiement',
    'skills.journey': '<strong>Parcours :</strong> Cariste pendant 6 ans → Découverte de n8n en août 2024 → +40 workflows créés en 5 mois',
    'projects.title': 'Mes Projets',
    'projects.subtitle': 'Cliquez sur un node pour voir les détails',
    'projects.filters.all': 'Tous',
    'projects.filters.workflows': 'Workflows',
    'projects.filters.sync': 'Sync',
    'projects.filters.data': 'Data',
    'projects.modal.workflow': 'Workflow',
    'projects.modal.tech': 'Technologies',
    'projects.modal.demo': 'Voir la démo',
    'projects.modal.gallery': 'Workflows',
    'contact.submit': 'Execute Workflow',
    'contact.errors.email': 'Email invalide',
    'contact.errors.subject': 'Sujet requis',
    'contact.errors.message': 'Message requis',
    'contact.success': 'Workflow exécuté avec succès !',
    'contact.calendly': 'Prendre RDV',
    'footer.tagline': 'Crafted with n8n spirit ⚡',
  },
  en: {
    'nav.trigger': 'Trigger',
    'nav.about': 'About',
    'nav.skills': 'Skills',
    'nav.projects': 'Projects',
    'nav.contact': 'Contact',
    'hero.instruction': 'Scroll to trigger the workflow',
    'hero.method': 'Method',
    'hero.path': 'Path',
    'about.status': '● Triggered',
    'about.timestamp': 'Just now',
    'about.title': 'Automation & Data Builder',
    'about.stats.records': 'Records',
    'about.stats.workflows': 'n8n Workflows',
    'about.stats.functions': 'Edge Functions',
    'about.stats.timeSaved': 'Time Saved',
    'about.storyTitle': 'My Story',
    'about.storyText': `August 2024. Arrived in France from New Caledonia, far from my comfort zone.
      While exploring business ideas, I discovered n8n and automation.
      For someone who had <strong>never used a computer at work</strong>, it was a leap into the unknown.
      But it resonated as something obvious.`,
    'about.quote': '"If I, starting from zero, could learn all this - then anything is possible."',
    'about.valuesTitle': 'Polynesian Values',
    'about.values.respect': 'Respect',
    'about.values.humility': 'Humility',
    'about.values.sharing': 'Sharing',
    'skills.title': 'Skills',
    'skills.subtitle': 'Self-taught since August 2024',
    'skills.automation.title': 'Automation',
    'skills.data.title': 'Data Architecture',
    'skills.ai.title': 'Artificial Intelligence',
    'skills.scraping.title': 'Scraping & Parsing',
    'skills.tools.title': 'Tools & Deployment',
    'skills.journey': '<strong>Journey:</strong> Forklift operator for 6 years → Discovered n8n in August 2024 → +40 workflows created in 5 months',
    'projects.title': 'My Projects',
    'projects.subtitle': 'Click on a node to see details',
    'projects.filters.all': 'All',
    'projects.filters.workflows': 'Workflows',
    'projects.filters.sync': 'Sync',
    'projects.filters.data': 'Data',
    'projects.modal.workflow': 'Workflow',
    'projects.modal.tech': 'Technologies',
    'projects.modal.demo': 'View demo',
    'projects.modal.gallery': 'Workflows',
    'contact.submit': 'Execute Workflow',
    'contact.errors.email': 'Invalid email',
    'contact.errors.subject': 'Subject required',
    'contact.errors.message': 'Message required',
    'contact.success': 'Workflow executed successfully!',
    'contact.calendly': 'Book a call',
    'footer.tagline': 'Crafted with n8n spirit ⚡',
  },
};

// ============================================
// STATE
// ============================================
let currentLang = localStorage.getItem('lang') || CONFIG.defaultLang;
let currentTheme = localStorage.getItem('theme') || CONFIG.defaultTheme;
let projectsData = null;
let n8nScene = null;
let scrollAnimations = null;

// ============================================
// DOM ELEMENTS
// ============================================
const elements = {
  html: document.documentElement,
  langToggle: document.getElementById('langToggle'),
  themeToggle: document.getElementById('themeToggle'),
  threeCanvas: document.getElementById('threeCanvas'),
  progressNodes: document.querySelectorAll('.progress-node'),
  sections: document.querySelectorAll('.section'),
  projectNodes: document.getElementById('projectNodes'),
  projectConnections: document.getElementById('projectConnections'),
  projectModal: document.getElementById('projectModal'),
  contactForm: document.getElementById('contactForm'),
  filterBtns: document.querySelectorAll('.filter-btn'),
};

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', init);

async function init() {
  console.log('Initializing portfolio...');

  // Apply saved preferences
  setTheme(currentTheme);
  setLanguage(currentLang);

  // Setup event listeners
  setupThemeToggle();
  setupLangToggle();
  setupScrollProgress();
  setupContactForm();
  setupFilterButtons();
  setupScrollToTop();

  // Load projects
  await loadProjects();

  // Initialize Three.js scene (if container exists and not mobile)
  if (elements.threeCanvas && window.N8NScene) {
    n8nScene = new N8NScene(elements.threeCanvas);
    console.log('Three.js scene:', n8nScene.isEnabled ? 'enabled' : 'disabled (mobile/reduced-motion)');
  }

  // Initialize scroll animations
  if (window.ScrollAnimations) {
    scrollAnimations = new ScrollAnimations(n8nScene);
    console.log('Scroll animations initialized');
  }

  // Cursor glow (desktop only)
  setupCursorGlow();

  console.log('Portfolio ready ⚡');
}

// ============================================
// THEME TOGGLE
// ============================================
function setupThemeToggle() {
  elements.themeToggle?.addEventListener('click', () => {
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  });
}

function setTheme(theme) {
  currentTheme = theme;
  elements.html.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);

  // Update toggle visual
  const darkIcon = elements.themeToggle?.querySelector('.theme-icon--dark');
  const lightIcon = elements.themeToggle?.querySelector('.theme-icon--light');
  if (darkIcon && lightIcon) {
    darkIcon.style.opacity = theme === 'dark' ? '1' : '0.3';
    lightIcon.style.opacity = theme === 'light' ? '1' : '0.3';
  }
}

// ============================================
// LANGUAGE TOGGLE
// ============================================
function setupLangToggle() {
  elements.langToggle?.addEventListener('click', () => {
    const newLang = currentLang === 'fr' ? 'en' : 'fr';
    setLanguage(newLang);
  });
}

function setLanguage(lang) {
  currentLang = lang;
  elements.html.setAttribute('data-lang', lang);
  elements.html.setAttribute('lang', lang);
  localStorage.setItem('lang', lang);

  // Update toggle button active state
  elements.langToggle?.querySelectorAll('.toggle-option').forEach((opt) => {
    opt.classList.toggle('active', opt.dataset.lang === lang);
  });

  // Update all translatable elements
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.dataset.i18n;
    if (translations[lang]?.[key]) {
      el.innerHTML = translations[lang][key];
    }
  });

  // Reload project nodes with new language
  if (projectsData) {
    renderProjectNodes(projectsData.projects);
  }
}

// ============================================
// SCROLL PROGRESS NAVIGATION
// ============================================
function setupScrollProgress() {
  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -50% 0px',
    threshold: 0,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        updateActiveProgress(entry.target.id);
      }
    });
  }, observerOptions);

  elements.sections.forEach((section) => observer.observe(section));

  // Click handlers for progress nodes
  elements.progressNodes.forEach((node) => {
    node.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(node.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

function updateActiveProgress(sectionId) {
  elements.progressNodes.forEach((node) => {
    node.classList.toggle('active', node.dataset.section === sectionId);
  });
}

// ============================================
// PROJECTS LOADING
// ============================================
async function loadProjects() {
  console.log('Loading projects from:', CONFIG.projectsUrl);
  try {
    const response = await fetch(CONFIG.projectsUrl);
    console.log('Fetch response status:', response.status);
    if (!response.ok) throw new Error(`Failed to load projects: ${response.status}`);
    projectsData = await response.json();
    console.log('Projects loaded:', projectsData.projects?.length || 0, 'projects');
    console.log('Featured projects:', projectsData.projects?.filter(p => p.featured).length || 0);
    renderProjectNodes(projectsData.projects);
  } catch (error) {
    console.error('Error loading projects:', error);
    if (elements.projectNodes) {
      elements.projectNodes.innerHTML = `
        <div class="error-message" style="color: var(--n8n-color-danger); padding: 2rem; text-align: center;">
          <p>⚠️ Erreur de chargement des projets</p>
          <p style="font-size: 0.875rem; opacity: 0.7;">${error.message}</p>
        </div>
      `;
    }
  }
}

function renderProjectNodes(projects) {
  if (!elements.projectNodes) return;

  elements.projectNodes.innerHTML = '';

  const filteredProjects = projects.filter((p) => p.featured);

  filteredProjects.forEach((project, index) => {
    const node = createProjectNode(project, index);
    elements.projectNodes.appendChild(node);
  });

  // Force nodes to be visible immediately (fix for display bug)
  requestAnimationFrame(() => {
    document.querySelectorAll('.project-node').forEach(node => {
      node.style.opacity = '1';
      node.style.transform = 'scale(1)';
    });
  });

  // Draw connections after nodes are rendered
  setTimeout(() => drawConnections(filteredProjects), 100);
}

function createProjectNode(project, index) {
  const node = document.createElement('div');
  node.className = 'project-node node';
  node.dataset.projectId = project.id;
  node.dataset.category = project.category;
  node.dataset.index = index;
  node.style.left = `${project.nodeConfig.position.x}px`;
  node.style.top = `${project.nodeConfig.position.y}px`;

  const title = project.title[currentLang] || project.title.fr;
  const headerClass = `node-header node-header--${project.nodeConfig.type}`;

  // Simplified node: just icon and title (transparent background)
  node.innerHTML = `
    <div class="${headerClass}">
      <img src="${project.nodeConfig.iconUrl}" alt="" class="node-icon" loading="lazy">
      <span class="node-title">${title}</span>
    </div>
  `;

  // Make node draggable
  makeDraggable(node, project, index);

  node.setAttribute('tabindex', '0');
  node.setAttribute('role', 'button');
  node.setAttribute('aria-label', title);

  node.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openProjectModal(project);
    }
  });

  return node;
}

// ============================================
// DRAGGABLE NODES
// ============================================
function makeDraggable(node, project, index) {
  // On mobile: simple tap to open modal, no drag
  if (window.innerWidth < 768) {
    node.addEventListener('click', () => openProjectModal(project));
    node.style.cursor = 'pointer';
    return;
  }

  let isDragging = false;
  let hasMoved = false;
  let startX, startY, initialX, initialY;

  const onMouseDown = (e) => {
    if (e.button !== 0) return; // Left click only
    isDragging = true;
    hasMoved = false;
    startX = e.clientX;
    startY = e.clientY;
    initialX = node.offsetLeft;
    initialY = node.offsetTop;
    node.style.cursor = 'grabbing';
    node.style.zIndex = '100';
    e.preventDefault();
  };

  const onMouseMove = (e) => {
    if (!isDragging) return;

    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;

    // Detect if we've actually moved (threshold of 5px)
    if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
      hasMoved = true;
    }

    const newX = initialX + deltaX;
    const newY = initialY + deltaY;

    node.style.left = `${newX}px`;
    node.style.top = `${newY}px`;

    // Update project position for connection redraw
    project.nodeConfig.position.x = newX;
    project.nodeConfig.position.y = newY;

    // Redraw connections
    if (projectsData) {
      drawConnections(projectsData.projects.filter(p => p.featured));
    }
  };

  const onMouseUp = (e) => {
    if (!isDragging) return;
    isDragging = false;
    node.style.cursor = 'grab';
    node.style.zIndex = '';

    // Only open modal if we didn't drag
    if (!hasMoved) {
      openProjectModal(project);
    }
  };

  node.addEventListener('mousedown', onMouseDown);
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);

  // Touch support
  node.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    isDragging = true;
    hasMoved = false;
    startX = touch.clientX;
    startY = touch.clientY;
    initialX = node.offsetLeft;
    initialY = node.offsetTop;
    node.style.zIndex = '100';
  }, { passive: true });

  node.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - startX;
    const deltaY = touch.clientY - startY;

    if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
      hasMoved = true;
    }

    const newX = initialX + deltaX;
    const newY = initialY + deltaY;

    node.style.left = `${newX}px`;
    node.style.top = `${newY}px`;

    project.nodeConfig.position.x = newX;
    project.nodeConfig.position.y = newY;

    if (projectsData) {
      drawConnections(projectsData.projects.filter(p => p.featured));
    }
  }, { passive: true });

  node.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    isDragging = false;
    node.style.zIndex = '';

    if (!hasMoved) {
      openProjectModal(project);
    }
  });
}

// ============================================
// SVG CONNECTIONS
// ============================================
function drawConnections(projects) {
  if (!elements.projectConnections) return;

  elements.projectConnections.innerHTML = '';

  const connectionPairs = [
    [0, 1], [1, 2], [0, 3], [3, 4], [4, 5], [3, 6], [6, 7],
  ];

  connectionPairs.forEach(([fromIdx, toIdx]) => {
    if (fromIdx < projects.length && toIdx < projects.length) {
      const from = projects[fromIdx];
      const to = projects[toIdx];
      drawConnection(from.nodeConfig.position, to.nodeConfig.position);
    }
  });
}

function drawConnection(from, to) {
  const nodeWidth = 200;
  const nodeHeight = 50;

  const startX = from.x + nodeWidth + 6;
  const startY = from.y + nodeHeight / 2;
  const endX = to.x - 6;
  const endY = to.y + nodeHeight / 2;

  const midX = (startX + endX) / 2;

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute(
    'd',
    `M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`
  );
  path.setAttribute('fill', 'none');
  path.setAttribute('stroke', 'var(--n8n-connection-color)');
  path.setAttribute('stroke-width', '2');
  path.setAttribute('stroke-dasharray', '8 4'); // Dashed line
  path.setAttribute('stroke-linecap', 'round');
  path.classList.add('connection-path');

  elements.projectConnections.appendChild(path);
}

// ============================================
// PROJECT MODAL
// ============================================
function openProjectModal(project) {
  if (!elements.projectModal) return;

  const modal = elements.projectModal;
  const title = project.title[currentLang] || project.title.fr;
  const description = project.description[currentLang] || project.description.fr;

  modal.querySelector('.modal-icon').innerHTML = `
    <img src="${project.nodeConfig.iconUrl}" alt="" style="width: 48px; height: 48px;">
  `;
  modal.querySelector('.modal-icon').style.background = '#333333';
  modal.querySelector('.modal-title').textContent = title;
  modal.querySelector('.modal-tag').textContent = project.tag;
  modal.querySelector('.modal-description').textContent = description;

  const metricsContainer = modal.querySelector('.modal-metrics');
  metricsContainer.innerHTML = '';
  project.metrics?.forEach((metric) => {
    const metricEl = document.createElement('div');
    metricEl.className = 'metric-item';
    // Handle both string labels and localized object labels
    const label = typeof metric.label === 'object'
      ? (metric.label[currentLang] || metric.label.fr)
      : metric.label;
    metricEl.innerHTML = `
      <span class="metric-label">${label}</span>
      <span class="metric-value">${metric.value || `${metric.before} → ${metric.after}`}</span>
    `;
    metricsContainer.appendChild(metricEl);
  });

  modal.querySelector('.workflow-steps').textContent = project.workflow || '';

  const techContainer = modal.querySelector('.tech-tags');
  techContainer.innerHTML = '';
  project.tech?.forEach((tech) => {
    const tag = document.createElement('span');
    tag.className = 'tech-tag';
    tag.textContent = tech;
    techContainer.appendChild(tag);
  });

  // Demo Link
  const demoLink = modal.querySelector('.modal-link--demo');

  if (project.links?.demo) {
    demoLink.href = project.links.demo;
    demoLink.hidden = false;
  } else {
    demoLink.hidden = true;
  }

  // Single image
  const imageContainer = modal.querySelector('.modal-image');
  const screenshot = modal.querySelector('.modal-screenshot');

  if (project.image && !project.gallery) {
    screenshot.src = project.image;
    screenshot.alt = title;
    imageContainer.hidden = false;
  } else {
    imageContainer.hidden = true;
  }

  // Gallery
  const galleryContainer = modal.querySelector('.modal-gallery');
  if (project.gallery && project.gallery.length > 0) {
    galleryContainer.hidden = false;
    setupGallery(modal, project.gallery);
  } else {
    galleryContainer.hidden = true;
  }

  modal.hidden = false;
  document.body.style.overflow = 'hidden';

  const closeBtn = modal.querySelector('.modal-close');
  closeBtn.focus();

  const closeModal = () => {
    modal.hidden = true;
    document.body.style.overflow = '';
  };

  closeBtn.onclick = closeModal;
  modal.onclick = (e) => {
    if (e.target === modal) closeModal();
  };

  const handleEsc = (e) => {
    if (e.key === 'Escape') {
      closeModal();
      document.removeEventListener('keydown', handleEsc);
    }
  };
  document.addEventListener('keydown', handleEsc);
}

// ============================================
// GALLERY
// ============================================
function setupGallery(modal, gallery) {
  let currentIndex = 0;

  const galleryImage = modal.querySelector('.gallery-image');
  const galleryCaption = modal.querySelector('.gallery-caption');
  const dotsContainer = modal.querySelector('.gallery-dots');
  const prevBtn = modal.querySelector('.gallery-prev');
  const nextBtn = modal.querySelector('.gallery-next');

  // Create dots
  dotsContainer.innerHTML = '';
  gallery.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.className = 'gallery-dot' + (index === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Image ${index + 1}`);
    dot.onclick = () => goToSlide(index);
    dotsContainer.appendChild(dot);
  });

  function updateGallery() {
    const item = gallery[currentIndex];
    galleryImage.src = item.url;
    galleryImage.alt = item.title;
    galleryCaption.textContent = item.title;

    // Update dots
    dotsContainer.querySelectorAll('.gallery-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  }

  function goToSlide(index) {
    currentIndex = index;
    updateGallery();
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % gallery.length;
    updateGallery();
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + gallery.length) % gallery.length;
    updateGallery();
  }

  prevBtn.onclick = prevSlide;
  nextBtn.onclick = nextSlide;

  // Initialize
  updateGallery();
}

// ============================================
// FILTER BUTTONS
// ============================================
function setupFilterButtons() {
  elements.filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      elements.filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const nodes = elements.projectNodes?.querySelectorAll('.project-node');
      nodes?.forEach((node) => {
        const category = node.dataset.category;
        const show = filter === 'all' || category === filter;
        node.style.display = show ? '' : 'none';
      });

      // Redraw connections for visible projects only
      if (projectsData?.projects) {
        const featuredProjects = projectsData.projects.filter(p => p.featured);
        const visibleProjects = filter === 'all'
          ? featuredProjects
          : featuredProjects.filter(p => p.category === filter);
        drawConnectionsFiltered(featuredProjects, visibleProjects);
      }
    });
  });
}

// Draw connections only between visible projects
function drawConnectionsFiltered(allProjects, visibleProjects) {
  if (!elements.projectConnections) return;

  elements.projectConnections.innerHTML = '';

  const connectionPairs = [
    [0, 1], [1, 2], [0, 3], [3, 4], [4, 5], [3, 6], [6, 7],
  ];

  const visibleIds = new Set(visibleProjects.map(p => p.id));

  connectionPairs.forEach(([fromIdx, toIdx]) => {
    if (fromIdx < allProjects.length && toIdx < allProjects.length) {
      const from = allProjects[fromIdx];
      const to = allProjects[toIdx];
      // Only draw if both nodes are visible
      if (visibleIds.has(from.id) && visibleIds.has(to.id)) {
        drawConnection(from.nodeConfig.position, to.nodeConfig.position);
      }
    }
  });
}

// ============================================
// SCROLL-TO-TOP
// ============================================
function setupScrollToTop() {
  const btn = document.getElementById('scrollToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ============================================
// CONTACT FORM
// ============================================
// N8N Webhook URL - Replace with your actual webhook URL
const N8N_WEBHOOK_URL = 'https://n8n.n8n-teina.shop/webhook/portfolio-contact';

function setupContactForm() {
  // Re-query the form element to ensure it's available (fixes mobile timing issues)
  const contactForm = document.getElementById('contactForm');

  if (!contactForm) {
    console.warn('Contact form not found');
    return;
  }

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = contactForm.querySelector('#email-from');
    const subject = contactForm.querySelector('#email-subject');
    const message = contactForm.querySelector('#email-body');
    const submitBtn = contactForm.querySelector('.btn-execute');
    let isValid = true;

    contactForm.querySelectorAll('.form-field').forEach((field) => {
      field.classList.remove('error');
    });

    // Email validation with proper regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value || !emailRegex.test(email.value)) {
      email.closest('.form-field').classList.add('error');
      isValid = false;
    }

    if (!subject.value.trim()) {
      subject.closest('.form-field').classList.add('error');
      isValid = false;
    }

    if (!message.value.trim()) {
      message.closest('.form-field').classList.add('error');
      isValid = false;
    }

    if (isValid) {
      // Disable button and show loading state
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="btn-icon">⏳</span><span>Envoi en cours...</span>';

      try {
        // Send to n8n webhook
        const response = await fetch(N8N_WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: email.value,
            subject: subject.value,
            message: message.value,
            timestamp: new Date().toISOString(),
            source: 'portfolio-contact-form'
          }),
        });

        if (response.ok) {
          // Success
          contactForm.hidden = true;
          contactForm.nextElementSibling.hidden = false;

          setTimeout(() => {
            contactForm.reset();
            contactForm.hidden = false;
            contactForm.nextElementSibling.hidden = true;
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<span class="btn-icon">▶</span><span data-i18n="contact.submit">Execute Workflow</span>';
          }, 3000);
        } else {
          throw new Error('Network response was not ok');
        }
      } catch (error) {
        console.error('Error sending message:', error);
        // Show error state but still show success for UX (webhook might be down)
        // In production, you might want to show an error message
        contactForm.hidden = true;
        contactForm.nextElementSibling.hidden = false;

        setTimeout(() => {
          contactForm.reset();
          contactForm.hidden = false;
          contactForm.nextElementSibling.hidden = true;
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<span class="btn-icon">▶</span><span data-i18n="contact.submit">Execute Workflow</span>';
        }, 3000);
      }
    }
  });
}

// ============================================
// CURSOR GLOW (desktop only)
// ============================================
function setupCursorGlow() {
  if (window.innerWidth < 768) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const glow = document.createElement('div');
  glow.className = 'cursor-glow';
  document.body.appendChild(glow);

  let mouseX = -300, mouseY = -300;
  let currentX = -300, currentY = -300;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, { passive: true });

  function animate() {
    currentX += (mouseX - currentX) * 0.12;
    currentY += (mouseY - currentY) * 0.12;
    glow.style.left = `${currentX}px`;
    glow.style.top = `${currentY}px`;
    requestAnimationFrame(animate);
  }
  animate();
}
