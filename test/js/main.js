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
  }

  // ==========================================================================
  // Logo Animation (Alternating Colors)
  // ==========================================================================

  function initLogoAnimation() {
    const logo = document.querySelector('.logo-animated');
    if (!logo) return;

    const frames = [
      "assets/colors/color1.svg",
      "assets/colors/color2.svg",
      "assets/colors/color3.svg",
      "assets/colors/color4.svg",
      "assets/colors/color5.svg"
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
    // Check for Intersection Observer support
    if (!('IntersectionObserver' in window)) {
      // Fallback: just show everything
      document.querySelectorAll('.who-we-are, .what-create, .what-we-are').forEach(function (el) {
        el.classList.add('is-visible');
      });
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
          // Optionally unobserve after animation
          // observer.unobserve(entry.target);
        }
      });
    }, options);

    // Observe main sections
    const sections = document.querySelectorAll('.who-we-are, .what-create, .what-we-are, .footer');
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

    // Check if already duplicated to avoid infinite loops
    if (track.getAttribute('data-duplicated') === 'true') return;

    const originalChildren = Array.from(track.children);
    if (originalChildren.length === 0) return;

    // Calculate how many repetitions of the original set we need to fill the screen
    // Estimate item width (card + gap) = 400 + 50 = 450px
    // Use a robust width target (e.g., 2500px) to cover large screens
    const itemWidth = 450;
    const minWidth = Math.max(window.innerWidth * 1.5, 2500);
    const currentSetWidth = originalChildren.length * itemWidth;

    // Calculate how many total sets we need to form one "half" of the loop
    let setsNeeded = Math.ceil(minWidth / currentSetWidth);
    if (setsNeeded < 1) setsNeeded = 1;

    // Append (setsNeeded - 1) copies to form the full first half
    for (let i = 1; i < setsNeeded; i++) {
      originalChildren.forEach(child => {
        track.appendChild(child.cloneNode(true));
      });
    }

    // Now duplicate the entire first half for the endless loop effect
    const halfChildren = Array.from(track.children);
    halfChildren.forEach(child => {
      const clone = child.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
    });

    track.setAttribute('data-duplicated', 'true');
  }

})();

