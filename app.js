/**
 * WATFIX PGM — Interactive Front-End Engine
 * Handles particle simulations, canvas graphics, interactive vessel layers,
 * counter animations, smooth navigation, and enquiry modal logic.
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initScrollReveals();
  initCounters();
  initMicroscopicCanvas();
  initBentoParticleCanvas();
  initFiltrationSimulator();
  initMolecularCanvas();
  initVideoGallery();
  initYear();
});

/* ==========================================================
   1. NAVIGATION & SCROLL SYSTEM
   ========================================================== */
function initNavigation() {
  const header = document.getElementById('main-header');
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const openIcon = document.querySelector('.menu-open-icon');
  const closeIcon = document.querySelector('.menu-close-icon');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  // Compact header on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('header-scrolled');
    } else {
      header.classList.remove('header-scrolled');
    }
  }, { passive: true });

  // Mobile Menu Toggle
  if (mobileMenuToggle && mobileMenu) {
    mobileMenuToggle.addEventListener('click', () => {
      const isHidden = mobileMenu.classList.contains('hidden');
      if (isHidden) {
        mobileMenu.classList.remove('hidden');
        openIcon.classList.add('hidden');
        closeIcon.classList.remove('hidden');
      } else {
        mobileMenu.classList.add('hidden');
        openIcon.classList.remove('hidden');
        closeIcon.classList.add('hidden');
      }
    });

    // Close mobile menu on link click
    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        openIcon.classList.remove('hidden');
        closeIcon.classList.add('hidden');
      });
    });
  }
}

/* ==========================================================
   2. SCROLL REVEAL OBSERVER
   ========================================================== */
function initScrollReveals() {
  const revealElements = document.querySelectorAll(
    'section > div, .bento-card, .feature-card, .app-card, .layer-card, .comparison-card, .step-card'
  );

  revealElements.forEach(el => el.classList.add('reveal-on-scroll'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

/* ==========================================================
   3. ANIMATED NUMBER COUNTERS
   ========================================================== */
function initCounters() {
  const counters = document.querySelectorAll('.counter');
  let hasRun = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasRun) {
        hasRun = true;
        counters.forEach(counter => {
          const target = parseFloat(counter.getAttribute('data-target'));
          const isDecimal = target % 1 !== 0;
          const duration = 1500;
          const startTime = performance.now();

          const updateNumber = (now) => {
            const progress = Math.min((now - startTime) / duration, 1);
            // Ease out cubic
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const currentVal = progress * target;

            if (counter.textContent.includes('–')) {
              // Range format, preserve
            } else if (isDecimal) {
              counter.textContent = currentVal.toFixed(1);
            } else {
              counter.textContent = Math.floor(currentVal);
            }

            if (progress < 1) {
              requestAnimationFrame(updateNumber);
            } else {
              if (target === 300) counter.textContent = '300';
              if (target === 20) counter.textContent = '20';
            }
          };

          requestAnimationFrame(updateNumber);
        });
      }
    });
  }, { threshold: 0.3 });

  if (counters.length > 0) {
    observer.observe(counters[0].closest('section'));
  }
}

/* ==========================================================
   4. MICROSCOPIC GLASS PARTICLES CANVAS (ABOUT SECTION)
   ========================================================== */
function initMicroscopicCanvas() {
  const canvas = document.getElementById('microscopic-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let animationId;
  let particles = [];

  function resize() {
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
    createParticles();
  }

  function createParticles() {
    particles = [];
    const count = Math.floor((canvas.width * canvas.height) / 18000);
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2.5 + 1,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        opacity: Math.random() * 0.5 + 0.2,
        color: i % 2 === 0 ? '#12B9D3' : '#087EC1'
      });
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.opacity;
      ctx.fill();
    });

    animationId = requestAnimationFrame(animate);
  }

  window.addEventListener('resize', resize, { passive: true });
  resize();
  animate();
}

/* ==========================================================
   5. BENTO PARTICLE CAPTURE CANVAS
   ========================================================== */
function initBentoParticleCanvas() {
  const canvas = document.getElementById('bento-particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resize() {
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
    particles = [];
    for (let i = 0; i < 35; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 3 + 1.5,
        speedY: Math.random() * 0.6 + 0.3,
        trapped: false,
        pulse: Math.random() * Math.PI
      });
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      p.y += p.speedY;
      p.pulse += 0.04;

      if (p.y > canvas.height * 0.6 && !p.trapped && Math.random() < 0.02) {
        p.trapped = true;
      }

      if (p.y > canvas.height) {
        p.y = 0;
        p.x = Math.random() * canvas.width;
        p.trapped = false;
      }

      ctx.beginPath();
      const currentRadius = p.trapped ? p.r * (1 + 0.2 * Math.sin(p.pulse)) : p.r;
      ctx.arc(p.x, p.y, currentRadius, 0, Math.PI * 2);
      ctx.fillStyle = p.trapped ? '#8DE7EF' : '#12B9D3';
      ctx.globalAlpha = p.trapped ? 0.8 : 0.4;
      ctx.fill();
    });

    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', resize, { passive: true });
  resize();
  animate();
}

/* ==========================================================
   6. REAL-TIME FILTRATION TANK SIMULATOR
   ========================================================== */
function initFiltrationSimulator() {
  const canvas = document.getElementById('filtration-sim-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let isBackwashMode = false;
  let backwashTimer = null;

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    initParticles();
  }

  function initParticles(turbidityLevel = 60) {
    particles = [];
    for (let i = 0; i < turbidityLevel; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * (canvas.height * 0.25),
        radius: Math.random() * 3.5 + 2,
        vy: Math.random() * 1.2 + 0.8,
        vx: (Math.random() - 0.5) * 0.5,
        type: Math.random() > 0.3 ? 'contaminant' : 'microbe',
        trappedAt: null,
        opacity: 0.9
      });
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const layer1Y = canvas.height * 0.28;
    const layer2Y = canvas.height * 0.55;
    const layer3Y = canvas.height * 0.78;
    const bottomY = canvas.height * 0.92;

    // Draw Media Bed Backgrounds
    // Layer 1: Fine (0.5 - 1.5mm)
    ctx.fillStyle = 'rgba(18, 185, 211, 0.12)';
    ctx.fillRect(0, layer1Y, canvas.width, layer2Y - layer1Y);

    // Layer 2: Medium (1.5 - 3.0mm)
    ctx.fillStyle = 'rgba(8, 126, 193, 0.15)';
    ctx.fillRect(0, layer2Y, canvas.width, layer3Y - layer2Y);

    // Layer 3: Coarse (3.0 - 6.0mm)
    ctx.fillStyle = 'rgba(39, 42, 135, 0.22)';
    ctx.fillRect(0, layer3Y, canvas.width, bottomY - layer3Y);

    // Draw Flow lines & Bed indicators
    ctx.strokeStyle = 'rgba(141, 231, 239, 0.25)';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(0, layer1Y); ctx.lineTo(canvas.width, layer1Y);
    ctx.moveTo(0, layer2Y); ctx.lineTo(canvas.width, layer2Y);
    ctx.moveTo(0, layer3Y); ctx.lineTo(canvas.width, layer3Y);
    ctx.stroke();
    ctx.setLineDash([]);

    // Media Bed Labels
    ctx.font = '10px Space Grotesk, sans-serif';
    ctx.fillStyle = '#8DE7EF';
    ctx.fillText('Grade 1 Bed (0.5–1.5mm) — Active Trap Zone', 12, layer1Y + 18);
    ctx.fillStyle = '#12B9D3';
    ctx.fillText('Grade 2 Bed (1.5–3.0mm) — Intermediate Buffer', 12, layer2Y + 18);
    ctx.fillStyle = '#8DE7EF';
    ctx.fillText('Grade 3 Bed (3.0–6.0mm) — Underbed Support', 12, layer3Y + 18);

    // Process & Draw Particles
    particles.forEach(p => {
      if (isBackwashMode) {
        // Reverse flow during backwash
        p.y -= 2.5;
        p.trappedAt = null;
        if (p.y < 0) {
          p.y = canvas.height * 0.85;
          p.x = Math.random() * canvas.width;
        }
      } else {
        // Normal Forward Downward Flow
        if (!p.trappedAt) {
          p.y += p.vy;
          p.x += p.vx;

          // Trapping Logic at Grade 1
          if (p.y >= layer1Y && p.y <= layer2Y) {
            if (Math.random() < 0.035) {
              p.trappedAt = p.y;
            }
          }
          // Trapping Logic at Grade 2
          else if (p.y > layer2Y && p.y <= layer3Y) {
            if (Math.random() < 0.05) {
              p.trappedAt = p.y;
            }
          }

          // Effluent conversion (Filtered water passes pure at bottom)
          if (p.y > bottomY) {
            p.radius = 1.2;
            p.type = 'purified';
          }

          // Recycle
          if (p.y > canvas.height) {
            p.y = 0;
            p.x = Math.random() * canvas.width;
            p.radius = Math.random() * 3.5 + 2;
            p.type = Math.random() > 0.3 ? 'contaminant' : 'microbe';
            p.trappedAt = null;
          }
        }
      }

      // Draw particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

      if (p.type === 'purified') {
        ctx.fillStyle = '#8DE7EF';
        ctx.globalAlpha = 0.9;
      } else if (p.trappedAt) {
        ctx.fillStyle = '#F59E0B';
        ctx.globalAlpha = 0.7;
      } else {
        ctx.fillStyle = p.type === 'microbe' ? '#EC4899' : '#38BDF8';
        ctx.globalAlpha = 0.85;
      }

      ctx.fill();
    });

    requestAnimationFrame(animate);
  }

  // Interactive Button Handlers
  const btnToggle = document.getElementById('btn-toggle-particles');
  const btnBackwash = document.getElementById('btn-backwash-sim');

  if (btnToggle) {
    btnToggle.addEventListener('click', () => {
      initParticles(100);
      btnToggle.textContent = 'Turbidity Injected (100 Particles)';
      setTimeout(() => {
        btnToggle.textContent = 'Inject High Turbidity';
      }, 2500);
    });
  }

  if (btnBackwash) {
    btnBackwash.addEventListener('click', () => {
      isBackwashMode = !isBackwashMode;
      if (isBackwashMode) {
        btnBackwash.textContent = 'Backwashing Active (Reversing Flow)...';
        btnBackwash.classList.add('bg-cyan', 'text-navy');
        clearTimeout(backwashTimer);
        backwashTimer = setTimeout(() => {
          isBackwashMode = false;
          btnBackwash.textContent = 'Simulate Backwash';
          btnBackwash.classList.remove('bg-cyan', 'text-navy');
          initParticles(60);
        }, 4000);
      } else {
        btnBackwash.textContent = 'Simulate Backwash';
        btnBackwash.classList.remove('bg-cyan', 'text-navy');
      }
    });
  }

  window.addEventListener('resize', resize, { passive: true });
  resize();
  animate();
}

/* ==========================================================
   7. MOLECULAR CATALYST CANVAS (BIOLOGICAL SECTION)
   ========================================================== */
function initMolecularCanvas() {
  const canvas = document.getElementById('molecular-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let nodes = [];

  function resize() {
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
    nodes = [];
    const count = Math.floor((canvas.width * canvas.height) / 25000);
    for (let i = 0; i < count; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1.5
      });
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update & draw links
    for (let i = 0; i < nodes.length; i++) {
      const n1 = nodes[i];
      n1.x += n1.vx;
      n1.y += n1.vy;

      if (n1.x < 0 || n1.x > canvas.width) n1.vx *= -1;
      if (n1.y < 0 || n1.y > canvas.height) n1.vy *= -1;

      for (let j = i + 1; j < nodes.length; j++) {
        const n2 = nodes[j];
        const dist = Math.hypot(n1.x - n2.x, n1.y - n2.y);
        if (dist < 140) {
          ctx.beginPath();
          ctx.moveTo(n1.x, n1.y);
          ctx.lineTo(n2.x, n2.y);
          ctx.strokeStyle = '#8DE7EF';
          ctx.globalAlpha = (1 - dist / 140) * 0.25;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      ctx.beginPath();
      ctx.arc(n1.x, n1.y, n1.radius, 0, Math.PI * 2);
      ctx.fillStyle = '#12B9D3';
      ctx.globalAlpha = 0.6;
      ctx.fill();
    }

    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', resize, { passive: true });
  resize();
  animate();
}

/* ==========================================================
   8. MEDIA LAYER TREATMENT MODE SWITCHER
   ========================================================== */
window.switchTreatmentMode = function(mode) {
  const btnCommercial = document.getElementById('btn-commercial-mode');
  const btnPool = document.getElementById('btn-pool-mode');

  const card1 = document.getElementById('layer-card-1');
  const card2 = document.getElementById('layer-card-2');
  const card3 = document.getElementById('layer-card-3');

  if (mode === 'commercial') {
    btnCommercial.classList.add('bg-navy', 'text-white', 'shadow-md');
    btnCommercial.classList.remove('text-navy/70');
    btnPool.classList.remove('bg-navy', 'text-white', 'shadow-md');
    btnPool.classList.add('text-navy/70');

    card1.classList.add('layer-card-active');
    card2.classList.remove('layer-card-active');
    card3.classList.remove('layer-card-active');
  } else {
    btnPool.classList.add('bg-navy', 'text-white', 'shadow-md');
    btnPool.classList.remove('text-navy/70');
    btnCommercial.classList.remove('bg-navy', 'text-white', 'shadow-md');
    btnCommercial.classList.add('text-navy/70');

    card1.classList.remove('layer-card-active');
    card2.classList.add('layer-card-active');
    card3.classList.remove('layer-card-active');
  }
};

/* ==========================================================
   9. INTERACTIVE HERO VESSEL LAYER HIGHLIGHT
   ========================================================== */
window.highlightLayer = function(layerNumber) {
  const targetSection = document.getElementById('performance');
  if (targetSection) {
    targetSection.scrollIntoView({ behavior: 'smooth' });
    const targetCard = document.getElementById(`layer-card-${layerNumber}`);
    if (targetCard) {
      targetCard.classList.add('layer-card-active');
      setTimeout(() => {
        targetCard.classList.remove('layer-card-active');
      }, 2500);
    }
  }
};

/* ==========================================================
   10. ENQUIRY MODAL SYSTEM
   ========================================================== */
window.openEnquiryModal = function(sourceContext = 'General Inquiry') {
  const modal = document.getElementById('enquiry-modal');
  const sourceInput = document.getElementById('inquiry-source');
  const form = document.getElementById('enquiry-form');
  const success = document.getElementById('enquiry-success');

  if (sourceInput) sourceInput.value = sourceContext;
  if (form) form.classList.remove('hidden');
  if (success) success.classList.add('hidden');

  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
};

window.closeEnquiryModal = function() {
  const modal = document.getElementById('enquiry-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
};

// Close modal when clicking backdrop
document.addEventListener('click', (e) => {
  const modal = document.getElementById('enquiry-modal');
  if (modal && e.target === modal) {
    closeEnquiryModal();
  }
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeEnquiryModal();
  }
});

/* ==========================================================
   11. ENQUIRY SUBMISSION HANDLER
   ========================================================== */
window.handleEnquirySubmit = function(event) {
  event.preventDefault();
  const form = document.getElementById('enquiry-form');
  const success = document.getElementById('enquiry-success');
  const submitBtn = document.getElementById('submit-enquiry-btn');

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg class="animate-spin w-4 h-4 text-cyan" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span>Processing...</span>
    `;
  }

  // Simulate fast response
  setTimeout(() => {
    if (form) form.classList.add('hidden');
    if (success) success.classList.remove('hidden');
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<span>Submit Enquiry</span>`;
    }
  }, 700);
};

/* ==========================================================
   12. FOOTER YEAR
   ========================================================== */
function initYear() {
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

/* ==========================================================
   13. VIDEO GALLERY & CINEMA THEATER SYSTEM
   ========================================================== */
const GALLERY_VIDEOS = [
  {
    id: 1,
    title: "Grade 1 Activated Glass Media Inspection & Flow Dynamics",
    shortTitle: "1. Grade 1 PGM Inspection & Flow",
    category: "purity",
    categoryLabel: "Purity & Grading",
    tag: "Grade 1 Fine Media (0.5–1.5mm)",
    duration: "0:40",
    src: "assets/videos/watfix-pgm-video-1.mp4",
    fallbackSrc: "WhatsApp Video 2026-10-01 at 16.58.07.mp4",
    poster: "assets/video-thumbs/watfix-video-1.jpg",
    description: "Direct inspection of WATFIX PGM Grade 1 (0.5 – 1.5 mm). Demonstrates pure amorphous glass granules completely free from crystalline silica dust, showing instant fluid particle dispersion and uniform granule shape.",
    highlights: [
      { label: "Particle Filtration", val: "4–5 µm Retention" },
      { label: "Silica Safety", val: "Zero Free Silica Dust" },
      { label: "Surface Texture", val: "Anti-Biofilm Smoothness" }
    ]
  },
  {
    id: 2,
    title: "Real-Time Effluent Clarity & High-Turbidity Removal Test",
    shortTitle: "2. Effluent Clarity & Turbidity Test",
    category: "clarity",
    categoryLabel: "Clarity & Filtration",
    tag: "Clarity & Turbidity Proof",
    duration: "0:34",
    src: "assets/videos/watfix-pgm-video-2.mp4",
    fallbackSrc: "WhatsApp Video 2026-10-01 at 16.58.14.mp4",
    poster: "assets/video-thumbs/watfix-video-2.jpg",
    description: "Live filtration trial displaying instant clarification of turbid water through the activated glass bed without chemical flocculants or coagulant additives.",
    highlights: [
      { label: "Turbidity Reduction", val: ">90% Single-Pass Removal" },
      { label: "Chemical Independence", val: "Zero Coagulants Needed" },
      { label: "Effluent Purity", val: "Lowest Chemical Byproducts" }
    ]
  },
  {
    id: 3,
    title: "Granule Morphology, Sizing Uniformity & Surface Activation",
    shortTitle: "3. Granule Morphology & Sizing",
    category: "purity",
    categoryLabel: "Purity & Grading",
    tag: "Media Quality & Morphology",
    duration: "0:41",
    src: "assets/videos/watfix-pgm-video-3.mp4",
    fallbackSrc: "WhatsApp Video 2026-10-01 at 16.58.40.mp4",
    poster: "assets/video-thumbs/watfix-video-3.jpg",
    description: "High-magnification view and physical handling of washed and activated glass granules, demonstrating uniform size distribution and engineered angular geometry that prevents bed compaction.",
    highlights: [
      { label: "Uniformity Coefficient", val: "< 1.4 Hydraulics" },
      { label: "Surface Activation", val: "Permanent Catalytic Charge" },
      { label: "Contact Area", val: "Up to 300× Greater" }
    ]
  },
  {
    id: 4,
    title: "Dynamic Fluidization & High-Speed Backwash Efficiency",
    shortTitle: "4. Fluidization & Backwash Test",
    category: "backwash",
    categoryLabel: "Backwash Dynamics",
    tag: "Backwash & Energy Savings",
    duration: "0:41",
    src: "assets/videos/watfix-pgm-video-4.mp4",
    fallbackSrc: "WhatsApp Video 2026-10-01 at 16.58.43 (1).mp4",
    poster: "assets/video-thumbs/watfix-video-4.jpg",
    description: "Demonstration of effortless bed expansion during backwash mode. Accumulated solids release rapidly with smooth fluidization, completing backwash in under 2 minutes with zero clumping.",
    highlights: [
      { label: "Water Savings", val: "Up to 80% Less Water" },
      { label: "Backwash Duration", val: "< 2 Minute Rinse Cycle" },
      { label: "Bed Health", val: "Zero Clumping or Channeling" }
    ]
  },
  {
    id: 5,
    title: "Commercial Vessel Media Packing & Multi-Grade Layering",
    shortTitle: "5. Vessel Packing & Layering",
    category: "layering",
    categoryLabel: "Vessel Loading",
    tag: "Site Installation & Vessel Loading",
    duration: "0:48",
    src: "assets/videos/watfix-pgm-video-5.mp4",
    fallbackSrc: "WhatsApp Video 2026-10-01 at 16.58.43.mp4",
    poster: "assets/video-thumbs/watfix-video-5.jpg",
    description: "Real site installation video showing commercial filtration pressure vessel filling with Grade 1 fine media and Grade 2 & 3 coarse support media in standard 20 KG moisture-sealed bags.",
    highlights: [
      { label: "Packaging Standard", val: "20 KG Sealed Bags" },
      { label: "Layer Ratio", val: "70% Top Fine / 30% Support" },
      { label: "Retrofit Ready", val: "100% Direct Sand Replacement" }
    ]
  }
];

let currentVideoIndex = 0;
let currentCinemaIndex = 0;

function initVideoGallery() {
  const mainVideo = document.getElementById('gallery-main-video');
  if (!mainVideo) return;

  // Keyboard navigation for Cinema Modal
  document.addEventListener('keydown', (e) => {
    const cinemaModal = document.getElementById('cinema-modal');
    if (cinemaModal && cinemaModal.classList.contains('active')) {
      if (e.key === 'ArrowRight') {
        nextCinemaVideo();
      } else if (e.key === 'ArrowLeft') {
        prevCinemaVideo();
      } else if (e.key === 'Escape') {
        closeCinemaModal();
      }
    }
  });

  // Clicking backdrop of cinema modal closes it
  const cinemaModal = document.getElementById('cinema-modal');
  if (cinemaModal) {
    cinemaModal.addEventListener('click', (e) => {
      if (e.target === cinemaModal) {
        closeCinemaModal();
      }
    });
  }
}

window.selectGalleryVideo = function(index, autoPlay = true) {
  if (index < 0 || index >= GALLERY_VIDEOS.length) return;
  currentVideoIndex = index;
  const videoData = GALLERY_VIDEOS[index];

  // Main video player elements
  const mainVideo = document.getElementById('gallery-main-video');
  const counterEl = document.getElementById('theater-header-counter');
  const tagEl = document.getElementById('theater-header-tag');
  const badgeTitle = document.getElementById('theater-badge-title');
  const titleEl = document.getElementById('theater-video-title');
  const categoryEl = document.getElementById('theater-video-category');
  const durationEl = document.getElementById('theater-video-duration');
  const descEl = document.getElementById('theater-video-desc');
  const highlightsEl = document.getElementById('theater-video-highlights');

  if (mainVideo) {
    mainVideo.poster = videoData.poster;
    
    // Update sources
    mainVideo.innerHTML = `
      <source src="${videoData.src}" type="video/mp4">
      <source src="${videoData.fallbackSrc}" type="video/mp4">
      Your browser does not support HTML5 video.
    `;
    mainVideo.load();
    if (autoPlay) {
      mainVideo.play().catch(() => {
        // Autoplay policy fallback: paused with poster
      });
    }
  }

  // Update text elements
  if (counterEl) counterEl.textContent = `Demonstration ${index + 1} of ${GALLERY_VIDEOS.length}`;
  if (tagEl) tagEl.textContent = videoData.tag;
  if (badgeTitle) badgeTitle.textContent = `WATFIX Demo #${index + 1}`;
  if (titleEl) titleEl.textContent = videoData.title;
  if (categoryEl) categoryEl.textContent = videoData.categoryLabel;
  if (durationEl) durationEl.textContent = `Duration: ${videoData.duration}`;
  if (descEl) descEl.textContent = videoData.description;

  // Update highlights
  if (highlightsEl && videoData.highlights) {
    highlightsEl.innerHTML = videoData.highlights.map(h => `
      <div class="p-3 rounded-2xl bg-cyan/10 border border-cyan/20">
        <div class="text-[10px] font-mono font-bold text-water-blue uppercase">${h.label}</div>
        <div class="text-xs font-bold text-navy mt-0.5">${h.val}</div>
      </div>
    `).join('');
  }

  // Update active card indicator
  const cards = document.querySelectorAll('.video-thumb-card');
  cards.forEach((card, i) => {
    if (i === index) {
      card.classList.add('active');
    } else {
      card.classList.remove('active');
    }
  });
};

window.filterGalleryVideos = function(category) {
  // Update button active state
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  filterBtns.forEach(btn => {
    if (btn.getAttribute('data-filter') === category) {
      btn.classList.add('bg-navy', 'text-white');
      btn.classList.remove('text-navy/70', 'hover:bg-navy/5');
    } else {
      btn.classList.remove('bg-navy', 'text-white');
      btn.classList.add('text-navy/70', 'hover:bg-navy/5');
    }
  });

  const cards = document.querySelectorAll('.video-thumb-card');
  let visibleCount = 0;
  let firstVisibleIndex = -1;

  cards.forEach((card, index) => {
    const cardCat = card.getAttribute('data-category');
    if (category === 'all' || cardCat === category) {
      card.style.display = 'block';
      visibleCount++;
      if (firstVisibleIndex === -1) firstVisibleIndex = index;
    } else {
      card.style.display = 'none';
    }
  });

  const countPill = document.getElementById('video-count-pill');
  if (countPill) {
    countPill.textContent = `${visibleCount} Demo${visibleCount === 1 ? '' : 's'}`;
  }

  // If active video is hidden, switch to first visible
  if (firstVisibleIndex !== -1 && category !== 'all') {
    const currentCard = cards[currentVideoIndex];
    if (currentCard && currentCard.style.display === 'none') {
      selectGalleryVideo(firstVisibleIndex, false);
    }
  }
};

/* Fullscreen Cinema Modal Logic */
window.openCinemaModal = function(index = currentVideoIndex) {
  currentCinemaIndex = index;
  const modal = document.getElementById('cinema-modal');
  const mainVideo = document.getElementById('gallery-main-video');
  if (mainVideo) mainVideo.pause();

  updateCinemaModalContent();

  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
};

window.closeCinemaModal = function() {
  const modal = document.getElementById('cinema-modal');
  const modalVideo = document.getElementById('cinema-modal-video');
  if (modalVideo) {
    modalVideo.pause();
  }
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
};

function updateCinemaModalContent() {
  const videoData = GALLERY_VIDEOS[currentCinemaIndex];
  const modalVideo = document.getElementById('cinema-modal-video');
  const titleEl = document.getElementById('cinema-modal-title');
  const counterEl = document.getElementById('cinema-modal-counter');
  const tagEl = document.getElementById('cinema-modal-tag');
  const descEl = document.getElementById('cinema-modal-desc');

  if (titleEl) titleEl.textContent = videoData.title;
  if (counterEl) counterEl.textContent = `Video ${currentCinemaIndex + 1} of ${GALLERY_VIDEOS.length}`;
  if (tagEl) tagEl.textContent = videoData.categoryLabel;
  if (descEl) descEl.textContent = videoData.description;

  if (modalVideo) {
    modalVideo.poster = videoData.poster;
    modalVideo.innerHTML = `
      <source src="${videoData.src}" type="video/mp4">
      <source src="${videoData.fallbackSrc}" type="video/mp4">
      Your browser does not support HTML5 video.
    `;
    modalVideo.load();
    modalVideo.play().catch(() => {});
  }
}

window.nextCinemaVideo = function() {
  currentCinemaIndex = (currentCinemaIndex + 1) % GALLERY_VIDEOS.length;
  updateCinemaModalContent();
  selectGalleryVideo(currentCinemaIndex, false);
};

window.prevCinemaVideo = function() {
  currentCinemaIndex = (currentCinemaIndex - 1 + GALLERY_VIDEOS.length) % GALLERY_VIDEOS.length;
  updateCinemaModalContent();
  selectGalleryVideo(currentCinemaIndex, false);
};

