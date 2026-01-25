# 🎯 BRIEF TECHNIQUE - Portfolio n8n Style

> **Document pour Claude Code**
> **Version** : 1.0
> **Date** : 24 Janvier 2026

---

## 📌 Contexte du Projet

**Objectif** : Créer un portfolio interactif qui simule l'expérience de naviguer dans un workflow n8n. L'utilisateur "scroll" à travers un workflow qui raconte l'histoire professionnelle du développeur.

**Cible** : Recruteurs tech, clients potentiels, entreprises cherchant des experts en automatisation.

**Différenciation** : Le portfolio EST la démonstration des compétences (meta-portfolio).

---

## 🎨 Design System

### Couleurs (voir css/variables.css)

Utiliser les variables CSS n8n définies dans `css/variables.css`. Les principales :

```css
/* Primaire */
--n8n-color-primary: hsl(6.9, 100%, 67.6%); /* Orange/Coral */

/* Nodes */
--n8n-node-trigger: #FF6D5A;    /* Webhook, Schedule */
--n8n-node-ai: #9B59B6;         /* OpenAI, Claude */
--n8n-node-data: #3498DB;       /* Supabase, DB */
--n8n-node-communication: #1ABC9C; /* Email, Telegram */
--n8n-node-logic: #F39C12;      /* IF, Switch, Merge */
--n8n-node-transform: #27AE60;  /* Code, Function */

/* Background */
--n8n-color-canvas-background: #1a1a1a;
--n8n-color-canvas-dot: #333333;
```

### Typography

```css
font-family: 'Inter', sans-serif;
font-weight: 300 (light), 400 (regular), 500 (medium), 600 (semibold), 700 (bold)
```

---

## 🏗️ Architecture UX

### Flow Narratif (Scroll Journey)

```
[HERO] Webhook Node 3D
    │
    │ scroll → zoom into
    ▼
[ABOUT] Inside Webhook (profile + story)
    │
    │ scroll → pan to next node
    ▼
[DECISIONS] IF Node (career choices)
    │
    │ scroll → expand to canvas
    ▼
[PROJECTS] Canvas Workflow (interactive nodes)
    │
    │ scroll/click
    ▼
[CONTACT] Email Node (form)
```

---

## 📐 Structure HTML Attendue

```html
<!DOCTYPE html>
<html lang="fr" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Teina | Automation & Data Architect</title>
  
  <!-- Preconnect -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  
  <!-- Fonts -->
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  
  <!-- Styles -->
  <link rel="stylesheet" href="css/variables.css">
  <link rel="stylesheet" href="css/main.css">
</head>
<body>
  
  <!-- ==========================================
       PROGRESS NAV (Mini workflow sidebar)
       ========================================== -->
  <nav class="workflow-progress" aria-label="Navigation sections">
    <a href="#hero" class="progress-node active" data-section="hero" aria-label="Accueil">
      <span class="node-icon">⚡</span>
      <span class="node-label">Trigger</span>
    </a>
    <div class="progress-line"></div>
    <a href="#about" class="progress-node" data-section="about" aria-label="À propos">
      <span class="node-icon">👤</span>
      <span class="node-label">About</span>
    </a>
    <div class="progress-line"></div>
    <a href="#decisions" class="progress-node" data-section="decisions" aria-label="Parcours">
      <span class="node-icon">❓</span>
      <span class="node-label">IF</span>
    </a>
    <div class="progress-line"></div>
    <a href="#projects" class="progress-node" data-section="projects" aria-label="Projets">
      <span class="node-icon">📊</span>
      <span class="node-label">Projects</span>
    </a>
    <div class="progress-line"></div>
    <a href="#contact" class="progress-node" data-section="contact" aria-label="Contact">
      <span class="node-icon">📧</span>
      <span class="node-label">Email</span>
    </a>
  </nav>

  <!-- ==========================================
       SECTION 1: HERO - Webhook Trigger
       ========================================== -->
  <section id="hero" class="section section--hero">
    <div class="hero-container">
      <!-- 3D Node Webhook -->
      <div class="node-3d node-webhook" data-depth="0.2">
        <div class="node-face node-face--front">
          <div class="node-header" style="background: var(--n8n-node-trigger)">
            <img src="assets/icons/node-webhook.svg" alt="" class="node-icon">
            <span class="node-title">Webhook</span>
          </div>
          <div class="node-body">
            <div class="node-field">
              <span class="field-label">Method</span>
              <span class="field-value">GET</span>
            </div>
            <div class="node-field">
              <span class="field-label">Path</span>
              <span class="field-value">/teina</span>
            </div>
          </div>
        </div>
        <div class="node-connector node-connector--output"></div>
      </div>
      
      <!-- Hero CTA -->
      <div class="hero-cta">
        <p class="hero-instruction">Scroll pour déclencher le workflow</p>
        <div class="scroll-indicator">
          <span class="scroll-arrow">↓</span>
        </div>
      </div>
    </div>
  </section>

  <!-- ==========================================
       SECTION 2: ABOUT - Inside Webhook
       ========================================== -->
  <section id="about" class="section section--about">
    <div class="webhook-expanded">
      <div class="webhook-header">
        <span class="webhook-status">● Triggered</span>
        <span class="webhook-timestamp">Just now</span>
      </div>
      
      <div class="webhook-payload">
        <div class="profile-card">
          <img src="assets/images/profile.jpg" alt="Teina" class="profile-photo">
          <div class="profile-info">
            <h1 class="profile-name">Teina</h1>
            <p class="profile-title">Automation & Data Architect</p>
            <p class="profile-location">📍 [Location]</p>
          </div>
        </div>
        
        <div class="stats-grid">
          <div class="stat-item">
            <span class="stat-value" data-count="103000">0</span>
            <span class="stat-label">Enregistrements</span>
          </div>
          <div class="stat-item">
            <span class="stat-value" data-count="13">0</span>
            <span class="stat-label">Workflows n8n</span>
          </div>
          <div class="stat-item">
            <span class="stat-value" data-count="14">0</span>
            <span class="stat-label">Edge Functions</span>
          </div>
          <div class="stat-item">
            <span class="stat-value" data-count="93">0</span>
            <span class="stat-suffix">%</span>
            <span class="stat-label">Temps économisé</span>
          </div>
        </div>
        
        <div class="story-block">
          <h2>Mon histoire</h2>
          <p class="story-text">
            <!-- À COMPLÉTER : Histoire personnelle -->
            En 2023, j'ai découvert n8n en cherchant à automatiser des tâches
            répétitives pour un client. Ce qui devait être un simple script
            est devenu une passion...
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- ==========================================
       SECTION 3: DECISIONS - IF Node
       ========================================== -->
  <section id="decisions" class="section section--decisions">
    <div class="if-node-container">
      <!-- IF Node -->
      <div class="node-if">
        <div class="node-header" style="background: var(--n8n-node-logic)">
          <img src="assets/icons/node-if.svg" alt="" class="node-icon">
          <span class="node-title">IF</span>
        </div>
        <div class="node-body">
          <div class="node-field">
            <span class="field-label">Condition</span>
            <span class="field-value">Freelance === true</span>
          </div>
        </div>
      </div>
      
      <!-- Branches -->
      <div class="if-branches">
        <div class="branch branch--true">
          <div class="branch-line"></div>
          <div class="branch-card">
            <span class="branch-label">TRUE</span>
            <h3>Liberté</h3>
            <p>Choisir mes projets, mes clients, mon rythme</p>
          </div>
        </div>
        
        <div class="branch branch--false">
          <div class="branch-line"></div>
          <div class="branch-card">
            <span class="branch-label">FALSE</span>
            <h3>Stabilité</h3>
            <p>CDI, équipe, projets long terme</p>
          </div>
        </div>
      </div>
      
      <!-- Merge -->
      <div class="merge-node">
        <div class="node-header" style="background: var(--n8n-node-logic)">
          <img src="assets/icons/node-merge.svg" alt="" class="node-icon">
          <span class="node-title">Merge</span>
        </div>
        <div class="merge-message">
          <p>"J'ai choisi de combiner les deux. Le meilleur des mondes."</p>
        </div>
      </div>
    </div>
  </section>

  <!-- ==========================================
       SECTION 4: PROJECTS - Canvas Workflow
       ========================================== -->
  <section id="projects" class="section section--projects">
    <div class="canvas-container">
      <div class="canvas-header">
        <h2>Mes Projets</h2>
        <p>Cliquez sur un node pour voir les détails</p>
      </div>
      
      <div class="canvas-viewport">
        <div class="canvas-grid"></div>
        <div class="canvas-nodes" id="projectNodes">
          <!-- Nodes générés dynamiquement depuis projects.json -->
        </div>
        <svg class="canvas-connections" id="projectConnections">
          <!-- Connexions SVG générées dynamiquement -->
        </svg>
      </div>
    </div>
    
    <!-- Modal Project Detail -->
    <div class="project-modal" id="projectModal" hidden>
      <div class="modal-overlay"></div>
      <div class="modal-content">
        <button class="modal-close" aria-label="Fermer">×</button>
        <div class="modal-header">
          <div class="modal-icon"></div>
          <h3 class="modal-title"></h3>
          <span class="modal-tag"></span>
        </div>
        <div class="modal-body">
          <p class="modal-description"></p>
          <div class="modal-metrics"></div>
          <div class="modal-tech"></div>
          <div class="modal-workflow"></div>
        </div>
        <div class="modal-image">
          <img src="" alt="" class="modal-screenshot">
        </div>
      </div>
    </div>
  </section>

  <!-- ==========================================
       SECTION 5: CONTACT - Email Node
       ========================================== -->
  <section id="contact" class="section section--contact">
    <div class="email-node-container">
      <div class="node-email">
        <div class="node-header" style="background: var(--n8n-node-communication)">
          <img src="assets/icons/node-email.svg" alt="" class="node-icon">
          <span class="node-title">Send Email</span>
        </div>
        <div class="node-body">
          <form class="contact-form" id="contactForm">
            <div class="form-field">
              <label for="email-to">To</label>
              <input type="text" id="email-to" value="contact@manao-ia.com" readonly>
            </div>
            <div class="form-field">
              <label for="email-from">From</label>
              <input type="email" id="email-from" placeholder="votre@email.com" required>
            </div>
            <div class="form-field">
              <label for="email-subject">Subject</label>
              <input type="text" id="email-subject" placeholder="Collaboration" required>
            </div>
            <div class="form-field">
              <label for="email-body">Message</label>
              <textarea id="email-body" rows="4" placeholder="Votre message..." required></textarea>
            </div>
            <button type="submit" class="btn-execute">
              <span class="btn-icon">▶</span>
              Execute Workflow
            </button>
          </form>
        </div>
      </div>
      
      <div class="contact-links">
        <a href="https://linkedin.com/in/teina-automatise" target="_blank" class="contact-link">
          <span class="link-icon">💼</span>
          LinkedIn
        </a>
        <a href="https://manao-ia.com" target="_blank" class="contact-link">
          <span class="link-icon">🌐</span>
          manao-ia.com
        </a>
      </div>
    </div>
  </section>

  <!-- ==========================================
       SCRIPTS
       ========================================== -->
  <!-- GSAP -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
  
  <!-- Lenis Smooth Scroll -->
  <script src="https://unpkg.com/lenis@1.1.18/dist/lenis.min.js"></script>
  
  <!-- App -->
  <script src="js/main.js" type="module"></script>
</body>
</html>
```

---

## 🎬 Animations GSAP Requises

### 1. Hero → About (Zoom Into Webhook)

```javascript
// Zoom 3D dans le node webhook
gsap.timeline({
  scrollTrigger: {
    trigger: "#hero",
    start: "top top",
    end: "bottom top",
    scrub: 1,
    pin: true
  }
})
.to(".node-webhook", {
  scale: 15,
  z: 500,
  opacity: 0,
  duration: 1
})
.from(".webhook-expanded", {
  scale: 0.5,
  opacity: 0,
  duration: 0.5
}, "-=0.3");
```

### 2. Stats Counter Animation

```javascript
// Compteur animé pour les stats
const counters = document.querySelectorAll('[data-count]');
counters.forEach(counter => {
  gsap.to(counter, {
    textContent: counter.dataset.count,
    duration: 2,
    ease: "power2.out",
    snap: { textContent: 1 },
    scrollTrigger: {
      trigger: counter,
      start: "top 80%"
    }
  });
});
```

### 3. IF Node Branches

```javascript
// Animation des branches IF
gsap.timeline({
  scrollTrigger: {
    trigger: "#decisions",
    start: "top center",
    toggleActions: "play none none reverse"
  }
})
.from(".branch--true", { x: -100, opacity: 0, duration: 0.5 })
.from(".branch--false", { x: 100, opacity: 0, duration: 0.5 }, "<")
.from(".merge-node", { y: 50, opacity: 0, duration: 0.5 });
```

### 4. Canvas Nodes Apparition

```javascript
// Apparition progressive des nodes
gsap.from(".project-node", {
  scale: 0,
  opacity: 0,
  duration: 0.4,
  stagger: 0.1,
  ease: "back.out(1.7)",
  scrollTrigger: {
    trigger: "#projects",
    start: "top center"
  }
});
```

### 5. Connection Lines Animation

```javascript
// Animation des lignes de connexion
const paths = document.querySelectorAll('.connection-path');
paths.forEach(path => {
  const length = path.getTotalLength();
  gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
  gsap.to(path, {
    strokeDashoffset: 0,
    duration: 1,
    ease: "power2.inOut",
    scrollTrigger: {
      trigger: path,
      start: "top 80%"
    }
  });
});
```

---

## 📦 Données Projets

Charger depuis `data/projects.json`. Structure :

```javascript
// Génération des nodes dans le canvas
async function loadProjects() {
  const response = await fetch('data/projects.json');
  const data = await response.json();
  
  const container = document.getElementById('projectNodes');
  
  data.projects.filter(p => p.featured).forEach(project => {
    const node = createProjectNode(project);
    container.appendChild(node);
  });
  
  // Dessiner les connexions
  drawConnections();
}

function createProjectNode(project) {
  const node = document.createElement('div');
  node.className = 'project-node';
  node.style.setProperty('--node-color', project.nodeConfig.color);
  node.style.left = `${project.nodeConfig.position.x}px`;
  node.style.top = `${project.nodeConfig.position.y}px`;
  
  node.innerHTML = `
    <div class="node-header">
      <span class="node-emoji">${project.nodeConfig.icon}</span>
      <span class="node-title">${project.title.fr}</span>
    </div>
    <div class="node-tag">${project.tag}</div>
  `;
  
  node.addEventListener('click', () => openProjectModal(project));
  
  return node;
}
```

---

## 📱 Responsive

### Mobile (< 768px)

- Désactiver les effets 3D complexes
- Canvas en scroll vertical (nodes en colonne)
- Navigation progress cachée ou minimale
- Animations simplifiées

### Tablet (768px - 1024px)

- Canvas avec zoom réduit
- Animations partielles

### Desktop (> 1024px)

- Expérience complète
- Toutes les animations
- Canvas interactif

---

## ✅ Checklist de Développement

### Phase 1 : Structure
- [ ] HTML sémantique complet
- [ ] CSS variables n8n intégrées
- [ ] Styles de base (reset, typography)
- [ ] Grid/Flexbox layout

### Phase 2 : Composants
- [ ] Style des nodes n8n
- [ ] Style du canvas avec grille
- [ ] Style des modals
- [ ] Style du formulaire contact

### Phase 3 : Animations
- [ ] Setup GSAP + ScrollTrigger
- [ ] Animation hero zoom
- [ ] Animation stats counter
- [ ] Animation IF branches
- [ ] Animation canvas nodes
- [ ] Animation connexions SVG

### Phase 4 : Interactivité
- [ ] Chargement projets JSON
- [ ] Modal détail projet
- [ ] Navigation progress
- [ ] Formulaire contact

### Phase 5 : Polish
- [ ] Responsive mobile
- [ ] Performance (lazy load images)
- [ ] Accessibility (aria, focus)
- [ ] Prefers-reduced-motion

---

## 🔗 Ressources

- **GSAP Docs** : https://gsap.com/docs/
- **ScrollTrigger** : https://gsap.com/docs/v3/Plugins/ScrollTrigger/
- **Lenis** : https://lenis.darkroom.engineering/
- **n8n Design System** : Voir `css/variables.css`

---

## 📞 Contact Projet

- **Email** : contact@manao-ia.com
- **Site** : manao-ia.com
- **LinkedIn** : linkedin.com/in/teina-automatise
