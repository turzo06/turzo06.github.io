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

  // 5. Image Lightbox (Universal for any element with data-img)
  const lightbox = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');

  if (lightbox && lightboxImg && lightboxCaption) {
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('[data-img]');
      if (trigger) {
        e.preventDefault();
        const imgSrc = trigger.getAttribute('data-img');
        const caption = trigger.getAttribute('data-caption') || '';
        lightboxImg.src = imgSrc;
        lightboxCaption.innerText = caption;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });

    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
      lightboxImg.src = '';
    }

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
      }
    });
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
