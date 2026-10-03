// Main JavaScript for Shubail Haque Turzo Academic Portfolio

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

  // 5. Image Lightbox
  const lightbox = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');

  if (lightbox && lightboxImg && lightboxCaption) {
    document.querySelectorAll('.gallery-card').forEach(card => {
      card.addEventListener('click', () => {
        const imgSrc = card.getAttribute('data-img');
        const caption = card.getAttribute('data-caption');
        lightboxImg.src = imgSrc;
        lightboxCaption.innerText = caption;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
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
});
