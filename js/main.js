/**
 * Studio Node Website - Main JavaScript
 * Handles all interactive functionality
 */

(function () {
  'use strict';

  // ==========================================================================
  // DOM Ready
  // ==========================================================================

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

  function initAll() {
    initMenuToggle();
    initSmoothScroll();
    initMarquee();
    initScrollAnimations();
    initInfiniteScroll();
    initLogoAnimation();
    initOrbWave();
  }

  // ==========================================================================
  // Dynamic Orb Generation and Interactive Wave
  // ==========================================================================

  function initOrbWave() {
    const container = document.querySelector('.orb-divider');
    if (!container) return;

    const shapes = ['circle', 'square'];
    const colors = ['orange', 'sky', 'laguna', 'citra'];
    const sizes = ['tiny', 'small', 'medium', 'large', 'xlarge'];
    const averageShapeSize = 25;

    function generateShapes() {
      container.innerHTML = '';

      // Calculate how many shapes needed to fill the width (with overlap)
      const containerWidth = window.innerWidth + 40;
      const shapeCount = Math.ceil(containerWidth / (averageShapeSize - 8));

      let lastColor = null; // Track previous color to avoid repetition

      for (let i = 0; i < shapeCount; i++) {
        const shape = document.createElement('div');
        shape.classList.add('shape');

        // Random shape type
        const shapeType = shapes[Math.floor(Math.random() * shapes.length)];
        shape.classList.add(`shape--${shapeType}`);

        // Random color (but not the same as the previous shape)
        const availableColors = colors.filter(c => c !== lastColor);
        const color = availableColors[Math.floor(Math.random() * availableColors.length)];
        lastColor = color;
        shape.classList.add(`shape--${color}`);

        // Random size
        const size = sizes[Math.floor(Math.random() * sizes.length)];
        shape.classList.add(`shape--${size}`);

        // Slight random rotation for irregular feel
        const rotation = (Math.random() - 0.5) * 30;
        shape.style.transform = `rotate(${rotation}deg)`;

        // Wavy vertical offset using sine wave + slight randomness
        const waveAmplitude = 25;
        const waveFrequency = 0.3;
        const sineOffset = Math.sin(i * waveFrequency) * waveAmplitude;
        const randomOffset = (Math.random() - 0.5) * 6;
        shape.style.marginTop = `${sineOffset + randomOffset}px`;

        container.appendChild(shape);
      }

      setupMouseInteraction();
    }

    function setupMouseInteraction() {
      const shapes = document.querySelectorAll('.orb-divider .shape');
      const container = document.querySelector('.orb-divider');

      document.addEventListener('mousemove', function (e) {
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        const containerRect = container.getBoundingClientRect();
        const containerCenterY = containerRect.top + containerRect.height / 2;
        const direction = mouseY < containerCenterY ? -1 : 1;

        shapes.forEach(function (shape) {
          const rect = shape.getBoundingClientRect();
          const shapeCenterX = rect.left + rect.width / 2;
          const distanceX = Math.abs(mouseX - shapeCenterX);
          const maxDistance = 150;

          // Get existing rotation from data attribute or compute it
          let rotation = shape.dataset.rotation;
          if (!rotation) {
            const currentTransform = shape.style.transform;
            const match = currentTransform.match(/rotate\(([^)]+)\)/);
            rotation = match ? match[1] : '0deg';
            shape.dataset.rotation = rotation;
          }

          if (distanceX < maxDistance) {
            const intensity = 1 - (distanceX / maxDistance);
            const translateY = direction * 25 * intensity;
            const scale = 1 + (0.1 * intensity);

            shape.style.transform = `translateY(${translateY}px) scale(${scale}) rotate(${rotation})`;
          } else {
            shape.style.transform = `rotate(${rotation})`;
          }
        });
      });
    }

    // Generate shapes on load
    generateShapes();

    // Regenerate on resize (debounced)
    let resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(generateShapes, 250);
    });
  }

  // ==========================================================================
  // Logo Animation (Alternating Colors)
  // ==========================================================================

  function initLogoAnimation() {
    const logo = document.querySelector('.logo-animated');
    if (!logo) return;

    const frames = [
      "./assets/colors/color1.svg",
      "./assets/colors/color2.svg",
      "./assets/colors/color3.svg",
      "./assets/colors/color4.svg",
      "./assets/colors/color5.svg"
    ];

    let idx = 0;
    // Cycle every 750ms
    setInterval(() => {
      idx = (idx + 1) % frames.length;
      logo.src = frames[idx];
    }, 750);
  }

  // ==========================================================================
  // Mobile Menu Toggle
  // ==========================================================================

  function initMenuToggle() {
    const menuButton = document.querySelector('.nav-buttons__menu');

    if (!menuButton) return;

    menuButton.addEventListener('click', function () {
      // Toggle menu state
      const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', !isOpen);

      // Add animation class
      menuButton.classList.toggle('nav-buttons__menu--active');

      // TODO: Implement full menu overlay when design is provided
      console.log('Menu toggled:', !isOpen ? 'open' : 'closed');
    });
  }

  // ==========================================================================
  // Smooth Scroll for Anchor Links
  // ==========================================================================

  function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(function (link) {
      link.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');

        if (targetId === '#') return;

        const target = document.querySelector(targetId);

        if (target) {
          e.preventDefault();
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  // ==========================================================================
  // Marquee Animation Enhancement
  // The CSS handles the base animation, but JS can pause on hover
  // ==========================================================================

  function initMarquee() {
    const marquee = document.querySelector('.footer__reel');

    if (!marquee) return;

    // Pause animation on hover for accessibility
    marquee.addEventListener('mouseenter', function () {
      this.style.animationPlayState = 'paused';
    });

    marquee.addEventListener('mouseleave', function () {
      this.style.animationPlayState = 'running';
    });
  }

  // ==========================================================================
  // Scroll-triggered Animations
  // Uses Intersection Observer for performance
  // ==========================================================================

  function initScrollAnimations() {
    // Mouse enter/leave for title wave animations with 3-second cooldown
    const animatedSections = document.querySelectorAll('.what-create, .what-we-are, .who-we-are');
    const cooldownTime = 3000; // 3 seconds

    animatedSections.forEach(function (section) {
      let lastTriggered = 0;

      section.addEventListener('mouseenter', function () {
        const now = Date.now();

        // Check if cooldown has passed
        if (now - lastTriggered < cooldownTime) {
          return; // Still in cooldown, don't trigger
        }

        lastTriggered = now;

        // Remove class first to reset animation
        this.classList.remove('is-hovered');
        // Force reflow to restart animation
        void this.offsetWidth;
        // Add class to trigger animation
        this.classList.add('is-hovered');
      });

      section.addEventListener('mouseleave', function () {
        this.classList.remove('is-hovered');
      });
    });

    // Keep intersection observer for footer
    if (!('IntersectionObserver' in window)) {
      return;
    }

    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        } else {
          entry.target.classList.remove('is-visible');
        }
      });
    }, options);

    // Observe footer
    const sections = document.querySelectorAll('.footer');
    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  // ==========================================================================
  // Utility: Debounce function for resize events
  // ==========================================================================

  function debounce(func, wait) {
    var timeout;
    return function executedFunction() {
      var context = this;
      var args = arguments;
      var later = function () {
        timeout = null;
        func.apply(context, args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // ==========================================================================
  // Handle Window Resize (for responsive adjustments if needed)
  // ==========================================================================

  window.addEventListener('resize', debounce(function () {
    // Recalculate any JS-dependent layouts here if needed
  }, 250));

  // ==========================================================================
  // Custom Cursor Orb
  // ==========================================================================

  function initCursor() {
    // Creating the orb element
    const orb = document.createElement('div');
    orb.classList.add('cursor-orb');
    document.body.appendChild(orb);

    // Brand colors for trail
    const brandColors = [
      'var(--color-digital-sky)',
      'var(--color-citra)',
      'var(--color-node-orange)',
      'var(--color-laguna)'
    ];
    let colorIndex = 0;

    // Mouse move listener
    document.addEventListener('mousemove', function (e) {
      // Direct follow for responsiveness
      orb.style.left = e.clientX + 'px';
      orb.style.top = e.clientY + 'px';

      // Trail Effect (Scribble)
      const trailDot = document.createElement('div');
      trailDot.classList.add('cursor-trail');
      trailDot.style.left = e.clientX + 'px';
      trailDot.style.top = e.clientY + 'px';

      // Cycle colors
      trailDot.style.backgroundColor = brandColors[colorIndex];
      colorIndex = (colorIndex + 1) % brandColors.length;

      document.body.appendChild(trailDot);

      // Remove after animation (1s matches css animation)
      setTimeout(() => {
        trailDot.remove();
      }, 1000);
    });

    // Handle cursor on interactive elements (hover states)
    const interactives = document.querySelectorAll('a, button, input, textarea, select');
    interactives.forEach(el => {
      el.addEventListener('mouseenter', () => {
        orb.classList.add('is-hovering');
      });
      el.addEventListener('mouseleave', () => {
        orb.classList.remove('is-hovering');
      });
    });
  }

  // Initialize cursor
  initCursor();

  // ==========================================================================
  // Floating Heart Animation
  // ==========================================================================
  const heartHandsImg = document.querySelector('.who-we-are__heart-hands img');

  if (heartHandsImg) {
    // Add pointer cursor to indicate interactivity
    heartHandsImg.style.cursor = 'pointer';

    // Heart spawning function
    function spawnHeart() {
      const rect = heartHandsImg.getBoundingClientRect();

      // Create heart element
      const heart = document.createElement('div');
      heart.classList.add('floating-heart');
      heart.textContent = '❤️'; // Heart emoji

      // Position relative to the image (centered horizontally, at the top)
      // Use client coordinates for fixed positioning
      const centerX = rect.left + (rect.width / 2);
      const topY = rect.top + 50; // Top of the image

      // Add slight random offset for natural feeling
      const randomX = (Math.random() - 0.5) * 40; // +/- 20px

      heart.style.left = (centerX + randomX) + 'px';
      heart.style.top = topY + 'px';

      document.body.appendChild(heart);

      // Remove after animation
      setTimeout(() => {
        heart.remove();
      }, 1500);
    }

    // Click: Spawn a heart
    heartHandsImg.addEventListener('click', function (e) {
      spawnHeart();
      // Spawn a few extra for a burst effect
      setTimeout(spawnHeart, 100);
      setTimeout(spawnHeart, 200);
    });

    // Hover: Stream of hearts
    let hoverInterval;

    heartHandsImg.addEventListener('mouseenter', function () {
      // Spawn immediately
      spawnHeart();
      // Then start interval
      hoverInterval = setInterval(spawnHeart, 200); // New heart every 200ms
    });

    heartHandsImg.addEventListener('mouseleave', function () {
      clearInterval(hoverInterval);
    });
  }

  /* 
   * Ensure the image container allows the image to receive clicks
   * securely if any overlays exist, but typical img tag is fine.
   */

  // ==========================================================================
  // Infinite Scroll Portfolio
  // Duplicates items to create a seamless loop
  // ==========================================================================

  function initInfiniteScroll() {
    const track = document.querySelector('.portfolio-grid');
    if (!track) return;

    const originalItems = Array.from(track.children);
    if (originalItems.length === 0) return;

    // 1.5 Assign static colors to original items before cloning
    // This prevents :nth-child color shifting when the list wraps
    const brandColors = [
      'var(--color-node-orange)',
      'var(--color-digital-sky)',
      'var(--color-citra)',
      'var(--color-laguna)'
    ];

    originalItems.forEach((item, index) => {
      const color = brandColors[index % brandColors.length];
      item.style.setProperty('--item-color', color);

      // If it's the Citra Yellow color, add a class for dark text
      if (color === 'var(--color-citra)') {
        item.classList.add('portfolio-item--dark-text');
      }
    });

    // Estimate width. For robustness, we'll just clone the original set X times to ensure
    // we have a wide enough "base" strip, then duplicate that entire strip.
    // Let's aim for at least 2000px base strip.
    const itemWidthEstimate = 300; // conservative estimate (250px + 50px gap)
    const minStripWidth = Math.max(window.innerWidth * 1.5, 2500);
    const initialTotalWidth = originalItems.length * itemWidthEstimate;

    let clonesNeeded = Math.ceil(minStripWidth / initialTotalWidth);
    if (clonesNeeded < 1) clonesNeeded = 1;

    // Create the "base" strip
    for (let c = 1; c < clonesNeeded; c++) {
      originalItems.forEach(item => {
        track.appendChild(item.cloneNode(true));
      });
    }

    // Now duplicated the ENTIRE base strip once to create the loop reference
    // So distinct items: A B C -> A B C A B C (Base Strip) -> A B C A B C A B C A B C (Full)
    const baseChildren = Array.from(track.children);
    baseChildren.forEach(child => {
      const clone = child.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
    });

    // 2. State & Config
    let scrollPos = 0;
    let isHovered = false;
    let cursorXRelative = 0.5; // 0 (left) to 1 (right)
    const arrowLeft = document.querySelector('.scroller-arrow--left');
    const arrowRight = document.querySelector('.scroller-arrow--right');

    // Total width of ONE set (the point where we wrap)
    // We'll calculate this accurately after render and on resize
    let wrapWidth = 0;

    function calculateWrapWidth() {
      const firstItem = track.children[0];
      const firstClone = track.querySelector('[aria-hidden="true"]');

      if (firstItem && firstClone) {
        // Use getBoundingClientRect for sub-pixel precision
        const rect1 = firstItem.getBoundingClientRect();
        const rect2 = firstClone.getBoundingClientRect();
        wrapWidth = rect2.left - rect1.left;
      }
    }

    // Initial calculation
    calculateWrapWidth();

    // Also recalculate when images load to handle changing widths
    const images = track.querySelectorAll('img');
    images.forEach(img => {
      if (img.complete) {
        calculateWrapWidth();
      } else {
        img.addEventListener('load', calculateWrapWidth);
      }
    });

    const settings = {
      idleSpeed: -0.5,    // px per frame (move left) - halved from -1
      maxHoverSpeed: 3,   // Much slower user scroll speed
      baseHoverSpeed: 0  // Speed at center
    };

    // 3. Update Function
    function update() {
      if (wrapWidth === 0) {
        calculateWrapWidth();
        if (wrapWidth === 0) {
          requestAnimationFrame(update);
          return;
        }
      }

      let targetSpeed = settings.idleSpeed;

      if (isHovered) {
        // Calculate speed based on cursor position
        // 60% center deadzone: 0.2 to 0.8
        if (cursorXRelative >= 0.2 && cursorXRelative <= 0.8) {
          targetSpeed = 0;
          if (arrowLeft) arrowLeft.classList.remove('is-visible');
          if (arrowRight) arrowRight.classList.remove('is-visible');
        } else if (cursorXRelative < 0.2) {
          // One set scrolling speed when hovering
          targetSpeed = settings.maxHoverSpeed;
          if (arrowLeft) arrowLeft.classList.add('is-visible');
          if (arrowRight) arrowRight.classList.remove('is-visible');
        } else {
          // One set scrolling speed when hovering
          targetSpeed = -settings.maxHoverSpeed;
          if (arrowLeft) arrowLeft.classList.remove('is-visible');
          if (arrowRight) arrowRight.classList.add('is-visible');
        }
      } else {
        if (arrowLeft) arrowLeft.classList.remove('is-visible');
        if (arrowRight) arrowRight.classList.remove('is-visible');
      }

      scrollPos += targetSpeed;

      // Wrap logic
      if (scrollPos <= -wrapWidth) {
        scrollPos += wrapWidth;
      }
      else if (scrollPos > 0) {
        scrollPos -= wrapWidth;
      }

      track.style.transform = `translate3d(${scrollPos}px, 0, 0)`;

      requestAnimationFrame(update);
    }

    // 4. Events
    const interactionZone = document.querySelector('.portfolio-grid'); // or .what-create

    interactionZone.addEventListener('mouseenter', () => {
      isHovered = true;
      calculateWrapWidth();
    });

    interactionZone.addEventListener('mouseleave', () => {
      isHovered = false;
    });

    interactionZone.addEventListener('mousemove', (e) => {
      // get X relative to screen width
      // using window.innerWidth is safest for full-screen "steering" feel
      // or use rect of container if boxed. Grid is full width mostly.
      cursorXRelative = e.clientX / window.innerWidth;
    });

    // Handle Window Resize
    window.addEventListener('resize', () => {
      calculateWrapWidth();
    });

    // Start loop
    requestAnimationFrame(update);
  }

})();
