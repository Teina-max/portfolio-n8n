/**
 * Scroll Animations - Portfolio n8n Style
 * ========================================
 * Handles: GSAP ScrollTrigger, zoom révélateur, section transitions
 *
 * @version 2.0 - Zoom Révélateur
 */

class ScrollAnimations {
  constructor(n8nScene) {
    this.n8nScene = n8nScene;
    this.scrollTriggers = [];
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.isMobile = window.innerWidth < 768;

    if (this.prefersReducedMotion) {
      this.setupReducedMotion();
      return;
    }

    this.init();
  }

  init() {
    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger);

    // Configure ScrollTrigger
    ScrollTrigger.config({
      limitCallbacks: true,
      ignoreMobileResize: true,
    });

    // Setup animations
    this.setupZoomRevelateur();
    this.setupAboutAnimation();
    this.setupSkillsAnimation();
    this.setupProjectsAnimation();
    this.setupContactAnimation();

    // Refresh after all setup
    ScrollTrigger.refresh();
  }

  setupReducedMotion() {
    document.querySelectorAll('.section').forEach((section) => {
      section.style.opacity = '1';
      section.style.transform = 'none';
    });
    // Also reveal hero elements immediately
    document.querySelectorAll('.hero-eyebrow, .hero-name, .hero-tagline-text, .hero-cta-group').forEach((el) => {
      el.style.opacity = '1';
    });
  }

  /**
   * Hero Intro — Staggered GSAP timeline
   */
  setupHeroIntro() {
    const eyebrow = document.querySelector('.hero-eyebrow');
    const name = document.querySelector('.hero-name');
    const tagline = document.querySelector('.hero-tagline-text');
    const ctas = document.querySelector('.hero-cta-group');

    if (!eyebrow) return;

    const tl = gsap.timeline({ delay: 0.2 });

    tl.fromTo(eyebrow,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
    )
    .fromTo(name,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
      '-=0.2'
    )
    .fromTo(tagline,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
      '-=0.25'
    )
    .fromTo(ctas,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
      '-=0.2'
    );
  }

  /**
   * Main Zoom Révélateur Effect
   * ---------------------------
   * Phase 1 (0-50%): Camera zooms into webhook node
   * Phase 2 (50-80%): Node dissolves, skills appear
   * Phase 3 (80-100%): Skills world, camera settles
   */
  setupZoomRevelateur() {
    const hero = document.getElementById('hero');
    const about = document.getElementById('about');

    if (!hero) return;

    // Desktop: Three.js zoom effect
    if (this.n8nScene?.isEnabled) {
      // Pin the hero section during zoom
      ScrollTrigger.create({
        trigger: hero,
        start: 'top top',
        end: '+=200%', // 2x viewport height for smooth zoom
        pin: true,
        pinSpacing: true,
        scrub: 0.5,
        onUpdate: (self) => {
          this.n8nScene.updateScroll(self.progress);
        },
      });

      // Fade in About section after zoom completes
      if (about) {
        gsap.set(about, { opacity: 0, y: 50 });

        ScrollTrigger.create({
          trigger: about,
          start: 'top 90%',
          end: 'top 50%',
          scrub: 0.3,
          onUpdate: (self) => {
            gsap.set(about, {
              opacity: self.progress,
              y: 50 * (1 - self.progress),
            });
          },
        });
      }
    }
    // Mobile: CSS fallback animation
    else {
      this.setupMobileFallback(hero, about);
    }
  }

  /**
   * Mobile Fallback Animation
   * -------------------------
   * Simpler CSS-based zoom effect for performance
   */
  setupMobileFallback(hero, about) {
    const webhookNode = document.querySelector('.node-webhook');
    const heroContainer = document.querySelector('.hero-container');

    if (!webhookNode || !heroContainer) return;

    // Create a wrapper for the zoom effect
    gsap.set(heroContainer, { transformOrigin: 'center center' });

    // Zoom and fade timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: '+=150%',
        pin: true,
        pinSpacing: true,
        scrub: 0.8,
      },
    });

    // Phase 1: Zoom in
    tl.to(heroContainer, {
      scale: 1.5,
      duration: 0.5,
      ease: 'none',
    });

    // Phase 2: Scale up and fade
    tl.to(heroContainer, {
      scale: 3,
      opacity: 0,
      duration: 0.5,
      ease: 'none',
    });

    // Show mobile skills overlay
    const mobileSkills = document.querySelector('.mobile-skills-overlay');
    if (mobileSkills) {
      tl.to(mobileSkills, {
        opacity: 1,
        duration: 0.3,
      }, '-=0.3');
    }
  }

  setupAboutAnimation() {
    const about = document.getElementById('about');
    if (!about) return;

    const webhookExpanded = about.querySelector('.webhook-expanded');
    const profileCard = about.querySelector('.profile-card');
    const statsItems = about.querySelectorAll('.stat-item');
    const storyBlock = about.querySelector('.story-block');
    const valuesBlock = about.querySelector('.values-block');

    // Skip initial fade if Three.js handles it
    if (!this.n8nScene?.isEnabled) {
      gsap.from(webhookExpanded, {
        y: 60,
        opacity: 0,
        duration: 0.8,
        scrollTrigger: {
          trigger: about,
          start: 'top 80%',
          toggleActions: 'play reverse play reverse',
        },
      });
    }

    // Profile card slide in
    gsap.from(profileCard, {
      x: -40,
      opacity: 0,
      duration: 0.6,
      scrollTrigger: {
        trigger: about,
        start: 'top 70%',
        toggleActions: 'play reverse play reverse',
      },
    });

    // Stats stagger
    gsap.from(statsItems, {
      y: 30,
      opacity: 0,
      duration: 0.5,
      stagger: 0.1,
      scrollTrigger: {
        trigger: about,
        start: 'top 60%',
        toggleActions: 'play reverse play reverse',
      },
    });

    // Animate stat counters
    statsItems?.forEach((item) => {
      const counter = item.querySelector('[data-count]');
      if (!counter) return;

      const target = parseInt(counter.dataset.count, 10);

      gsap.to(counter, {
        textContent: target,
        duration: 2,
        ease: 'power2.out',
        snap: { textContent: 1 },
        scrollTrigger: {
          trigger: item,
          start: 'top 80%',
          once: true,
        },
        onUpdate: function () {
          const val = Math.round(parseFloat(counter.textContent));
          counter.textContent = val >= 1000 ? `${Math.round(val / 1000)}K` : val;
        },
      });
    });

    // Story block
    gsap.from(storyBlock, {
      y: 40,
      opacity: 0,
      duration: 0.6,
      scrollTrigger: {
        trigger: storyBlock,
        start: 'top 80%',
        toggleActions: 'play reverse play reverse',
      },
    });

    // Values block
    gsap.from(valuesBlock, {
      y: 40,
      opacity: 0,
      duration: 0.6,
      scrollTrigger: {
        trigger: valuesBlock,
        start: 'top 85%',
        toggleActions: 'play reverse play reverse',
      },
    });
  }

  setupSkillsAnimation() {
    const skills = document.getElementById('skills');
    if (!skills) return;

    const title = skills.querySelector('.section-title');
    const subtitle = skills.querySelector('.section-subtitle');
    const cards = skills.querySelectorAll('.skill-card');
    const journey = skills.querySelector('.skills-journey');

    // Title and subtitle
    gsap.from([title, subtitle], {
      y: 30,
      opacity: 0,
      duration: 0.5,
      stagger: 0.1,
      scrollTrigger: {
        trigger: skills,
        start: 'top 80%',
        toggleActions: 'play reverse play reverse',
      },
    });

    // Skill cards with stagger and 3D effect
    cards.forEach((card, index) => {
      gsap.from(card, {
        y: 50,
        opacity: 0,
        rotateX: 15,
        duration: 0.6,
        delay: index * 0.1,
        ease: 'back.out(1.4)',
        scrollTrigger: {
          trigger: skills,
          start: 'top 60%',
          toggleActions: 'play reverse play reverse',
        },
      });

      // Cursor-based tilt effect
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateY = ((x - centerX) / centerX) * 8;
        const rotateX = ((centerY - y) / centerY) * 8;

        gsap.to(card, {
          rotateX: rotateX,
          rotateY: rotateY,
          y: -6,
          scale: 1.02,
          duration: 0.3,
          ease: 'power2.out',
        });
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          y: 0,
          rotateX: 0,
          rotateY: 0,
          scale: 1,
          duration: 0.4,
          ease: 'power2.out',
        });
      });
    });

    // Journey text
    gsap.from(journey, {
      y: 20,
      opacity: 0,
      duration: 0.5,
      scrollTrigger: {
        trigger: journey,
        start: 'top 90%',
        toggleActions: 'play reverse play reverse',
      },
    });
  }

  setupProjectsAnimation() {
    const projects = document.getElementById('projects');
    if (!projects) return;

    const header = projects.querySelector('.canvas-header');
    const nodes = projects.querySelectorAll('.project-node');

    // Header
    gsap.from(header, {
      y: 30,
      opacity: 0,
      duration: 0.5,
      scrollTrigger: {
        trigger: projects,
        start: 'top 70%',
        toggleActions: 'play reverse play reverse',
      },
    });

    // Nodes with elastic pop-in
    gsap.from(nodes, {
      scale: 0,
      opacity: 0,
      duration: 0.5,
      stagger: 0.08,
      ease: 'back.out(1.7)',
      scrollTrigger: {
        trigger: projects,
        start: 'top 50%',
        toggleActions: 'play reverse play reverse',
      },
    });

    // Connection lines draw
    setTimeout(() => {
      const paths = projects.querySelectorAll('.connection-path');
      paths.forEach((path) => {
        const length = path.getTotalLength?.() || 100;
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });

        gsap.to(path, {
          strokeDashoffset: 0,
          duration: 0.8,
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: projects,
            start: 'top 40%',
            toggleActions: 'play reverse play reverse',
          },
        });
      });
    }, 200);
  }

  setupContactAnimation() {
    const contact = document.getElementById('contact');
    if (!contact) return;

    const emailNode = contact.querySelector('.node-email');
    const contactLinks = contact.querySelectorAll('.contact-link');

    gsap.from(emailNode, {
      y: 50,
      opacity: 0,
      rotateX: 10,
      duration: 0.6,
      scrollTrigger: {
        trigger: contact,
        start: 'top 70%',
        toggleActions: 'play reverse play reverse',
      },
    });

    gsap.from(contactLinks, {
      y: 20,
      opacity: 0,
      duration: 0.4,
      stagger: 0.1,
      scrollTrigger: {
        trigger: contact,
        start: 'top 60%',
        toggleActions: 'play reverse play reverse',
      },
    });
  }

  destroy() {
    this.scrollTriggers.forEach((st) => st.kill());
    ScrollTrigger.getAll().forEach((st) => st.kill());
  }
}

// Export for use
window.ScrollAnimations = ScrollAnimations;
