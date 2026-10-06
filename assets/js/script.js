// Main JavaScript for Shubail Haque Turza Academic Portfolio

document.addEventListener('DOMContentLoaded', () => {
  // 1. Dark/Light Theme Switcher
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const themeIcon = document.getElementById('theme-icon');
  
  const savedTheme = localStorage.getItem('site-theme') || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  
  function applyTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      if (themeIcon) themeIcon.className = 'fa-solid fa-sun';
    } else {
      document.documentElement.removeAttribute('data-theme');
      if (themeIcon) themeIcon.className = 'fa-solid fa-moon';
    }
    localStorage.setItem('site-theme', theme);
  }

  applyTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
    });
  }

  // 2. Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navLinks = document.getElementById('nav-links');

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const icon = mobileMenuBtn.querySelector('i');
      if (icon) {
        icon.className = navLinks.classList.contains('open') ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
      }
    });

    // Close menu when link is clicked
    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        const icon = mobileMenuBtn.querySelector('i');
        if (icon) icon.className = 'fa-solid fa-bars';
      });
    });
  }

  // 3. Active Nav Link on Scroll
  const sections = document.querySelectorAll('.content-section');
  const navItems = document.querySelectorAll('.nav-link');

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navItems.forEach(item => {
          if (item.getAttribute('href') === `#${id}`) {
            item.classList.add('active');
          } else {
            item.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));

  // 4. BibTeX Toggle & Copy
  document.querySelectorAll('.btn-bibtex').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const block = document.getElementById(targetId);
      if (block) {
        block.classList.toggle('show');
        btn.classList.toggle('active');
      }
    });
  });

  document.querySelectorAll('.copy-bib-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const pre = btn.parentElement.querySelector('pre');
      if (pre) {
        navigator.clipboard.writeText(pre.innerText).then(() => {
          const originalText = btn.innerText;
          btn.innerText = 'Copied!';
          setTimeout(() => {
            btn.innerText = originalText;
          }, 2000);
        });
      }
    });
  });

  // 5. Image Lightbox with Multi-Image Gallery, Keyboard & Touch Navigation
  const lightbox = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');
  const lightboxCounter = document.getElementById('lightbox-counter');
  const lightboxDots = document.getElementById('lightbox-dots');

  let currentGallery = [];
  let currentIndex = 0;

  function renderDots() {
    if (!lightboxDots) return;
    lightboxDots.innerHTML = '';
    if (currentGallery.length <= 1) {
      lightboxDots.classList.add('hidden');
      return;
    }
    lightboxDots.classList.remove('hidden');

    currentGallery.forEach((_, idx) => {
      const dot = document.createElement('button');
      dot.className = `lightbox-dot ${idx === currentIndex ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Go to photo ${idx + 1}`);
      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        showImageAtIndex(idx);
      });
      lightboxDots.appendChild(dot);
    });
  }

  function updateDots() {
    if (!lightboxDots) return;
    const dots = lightboxDots.querySelectorAll('.lightbox-dot');
    dots.forEach((dot, idx) => {
      if (idx === currentIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  function preloadNeighbors() {
    if (currentGallery.length <= 1) return;
    const nextIdx = (currentIndex + 1) % currentGallery.length;
    const prevIdx = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
    const nextSrc = currentGallery[nextIdx]?.getAttribute('data-img');
    const prevSrc = currentGallery[prevIdx]?.getAttribute('data-img');
    if (nextSrc) { const img = new Image(); img.src = nextSrc; }
    if (prevSrc) { const img = new Image(); img.src = prevSrc; }
  }

  function showImageAtIndex(index) {
    if (index < 0 || index >= currentGallery.length) return;
    currentIndex = index;
    const item = currentGallery[currentIndex];
    const imgSrc = item.getAttribute('data-img');
    const caption = item.getAttribute('data-caption') || item.getAttribute('alt') || '';

    // Quick subtle transition
    lightboxImg.classList.add('switching');
    setTimeout(() => {
      lightboxImg.src = imgSrc;
      lightboxImg.alt = caption;
      if (lightboxCaption) lightboxCaption.innerText = caption;
      if (lightboxCounter) {
        if (currentGallery.length > 1) {
          lightboxCounter.innerText = `${currentIndex + 1} / ${currentGallery.length}`;
          lightboxCounter.classList.remove('hidden');
        } else {
          lightboxCounter.classList.add('hidden');
        }
      }
      updateDots();
      lightboxImg.classList.remove('switching');
    }, 90);

    preloadNeighbors();
  }

  function showNextImage() {
    if (currentGallery.length <= 1) return;
    const nextIndex = (currentIndex + 1) % currentGallery.length;
    showImageAtIndex(nextIndex);
  }

  function showPrevImage() {
    if (currentGallery.length <= 1) return;
    const prevIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
    showImageAtIndex(prevIndex);
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    if (lightboxImg) lightboxImg.src = '';
    currentGallery = [];
    currentIndex = 0;
  }

  if (lightbox && lightboxImg) {
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('[data-img]');
      if (trigger) {
        e.preventDefault();

        // 1. Determine Gallery Group
        const galleryAttr = trigger.getAttribute('data-gallery');
        const stripParent = trigger.closest('.contest-photo-strip, [data-gallery-group]');

        let rawItems = [];
        if (galleryAttr) {
          rawItems = Array.from(document.querySelectorAll(`[data-gallery="${galleryAttr}"][data-img]`));
        } else if (stripParent) {
          rawItems = Array.from(stripParent.querySelectorAll('[data-img]'));
        } else {
          rawItems = [trigger];
        }

        // Deduplicate by data-img src
        const seenSrcs = new Set();
        currentGallery = [];
        rawItems.forEach(item => {
          const src = item.getAttribute('data-img');
          if (src && !seenSrcs.has(src)) {
            seenSrcs.add(src);
            currentGallery.push(item);
          }
        });

        const targetSrc = trigger.getAttribute('data-img');
        currentIndex = currentGallery.findIndex(item => item.getAttribute('data-img') === targetSrc);
        if (currentIndex === -1) currentIndex = 0;

        // Toggle nav controls visibility based on count
        const isMulti = currentGallery.length > 1;
        if (lightboxPrev) {
          if (isMulti) lightboxPrev.classList.remove('hidden');
          else lightboxPrev.classList.add('hidden');
        }
        if (lightboxNext) {
          if (isMulti) lightboxNext.classList.remove('hidden');
          else lightboxNext.classList.add('hidden');
        }

        renderDots();
        showImageAtIndex(currentIndex);

        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxPrev) {
      lightboxPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        showPrevImage();
      });
    }
    if (lightboxNext) {
      lightboxNext.addEventListener('click', (e) => {
        e.stopPropagation();
        showNextImage();
      });
    }

    lightbox.addEventListener('click', (e) => {
      // Close only if clicking directly on the backdrop modal container
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    // Keyboard Navigation: Escape, ArrowLeft, ArrowRight
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        closeLightbox();
      } else if (e.key === 'ArrowRight' || e.key === 'Right') {
        e.preventDefault();
        showNextImage();
      } else if (e.key === 'ArrowLeft' || e.key === 'Left') {
        e.preventDefault();
        showPrevImage();
      }
    });

    // Touch Swipe Gesture Support for Mobile
    let touchStartX = 0;
    let touchStartY = 0;

    lightbox.addEventListener('touchstart', (e) => {
      if (!lightbox.classList.contains('active')) return;
      touchStartX = e.changedTouches[0].clientX;
      touchStartY = e.changedTouches[0].clientY;
    }, { passive: true });

    lightbox.addEventListener('touchend', (e) => {
      if (!lightbox.classList.contains('active')) return;
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;

      if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY) * 1.4) {
        if (deltaX < 0) {
          showNextImage(); // Swiped left -> Next
        } else {
          showPrevImage(); // Swiped right -> Previous
        }
      }
    }, { passive: true });
  }

  // 6. Interactive Cursor Spotlight Tracker (Hover Effect)
  const interactiveCards = document.querySelectorAll('.pub-card, .timeline-card, .cp-stat-card, .cert-card, .ref-card, .skills-group');
  interactiveCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // 7. Modular Publication Category Filtering
  const filterBtns = document.querySelectorAll('.pub-filter-btn');
  const pubCards = document.querySelectorAll('.pub-card');

  if (filterBtns.length > 0 && pubCards.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        pubCards.forEach(card => {
          const category = card.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            card.classList.remove('filtering-out');
            card.classList.add('filtering-in');
          } else {
            card.classList.add('filtering-out');
            card.classList.remove('filtering-in');
          }
        });
      });
    });
  }

  // 8. Paper Detail Modal System (Opens from Card click or "Inside Details" button)
  const paperModal = document.getElementById('paper-detail-modal');
  const paperModalClose = document.getElementById('paper-modal-close');

  function openPaperModal(paperId, focusSection) {
    if (!paperModal || !paperId) return;
    paperModal.querySelectorAll('.paper-modal-content-item').forEach(item => {
      item.style.display = 'none';
    });
    const targetContent = document.getElementById(`modal-content-${paperId}`);
    if (targetContent) {
      targetContent.style.display = 'block';
      paperModal.classList.add('active');
      document.body.style.overflow = 'hidden';

      if (focusSection === 'cite') {
        setTimeout(() => {
          const bibBlock = targetContent.querySelector('.bibtex-block');
          if (bibBlock) {
            bibBlock.scrollIntoView({ behavior: 'smooth', block: 'center' });
            bibBlock.style.transition = 'box-shadow 0.3s ease';
            bibBlock.style.boxShadow = '0 0 0 3px var(--accent)';
            setTimeout(() => { bibBlock.style.boxShadow = ''; }, 1800);
          }
        }, 150);
      }
    }
  }

  function closePaperModal() {
    if (!paperModal) return;
    paperModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (paperModal) {
    // Open on button click
    document.querySelectorAll('.btn-open-paper-modal').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const paperId = btn.getAttribute('data-paper');
        const focusSection = btn.getAttribute('data-focus');
        openPaperModal(paperId, focusSection);
      });
    });

    // Open on full card click (unless clicking a link, button, or bibtex block)
    pubCards.forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('a, button, pre, .copy-bib-btn, .bibtex-block')) {
          return;
        }
        const paperId = card.getAttribute('data-paper');
        if (paperId) {
          openPaperModal(paperId);
        }
      });
    });

    if (paperModalClose) {
      paperModalClose.addEventListener('click', closePaperModal);
    }

    paperModal.addEventListener('click', (e) => {
      if (e.target === paperModal) {
        closePaperModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && paperModal.classList.contains('active')) {
        closePaperModal();
      }
    });
  }
});
