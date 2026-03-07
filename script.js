
(function () {
  'use strict';

  // ==================== DOM ELEMENTS ====================
  const elements = {
    header: document.getElementById('header'),
    navMenu: document.getElementById('nav-menu'),
    navToggle: document.getElementById('nav-toggle'),
    navClose: document.getElementById('nav-close'),
    navLinks: document.querySelectorAll('.nav__link'),
    sections: document.querySelectorAll('section[id]'),
    contactForm: document.getElementById('contact-form'),
    yearSpan: document.getElementById('year'),
    themeToggle: document.getElementById('theme-toggle'),
    typingText: document.querySelector('.typing-text'),
  };

  // ==================== THEME TOGGLE ====================
  const themeManager = {
    storageKey: 'portfolio-theme',

    init() {
      this.loadTheme();
      if (elements.themeToggle) {
        elements.themeToggle.addEventListener('click', () => this.toggleTheme());
      }
    },

    loadTheme() {
      const savedTheme = localStorage.getItem(this.storageKey);
      if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
      }
    },

    toggleTheme() {
      document.body.classList.toggle('light-mode');
      const isLight = document.body.classList.contains('light-mode');
      localStorage.setItem(this.storageKey, isLight ? 'light' : 'dark');
    },
  };

  // ==================== TYPING ANIMATION ====================
  const typingAnimation = {
    words: ['Energy Data Analyst', 'Electrical Engineer', 'Data Analyst', 'Fintech Specialist'],
    currentWordIndex: 0,
    currentCharIndex: 0,
    isDeleting: false,
    typeSpeed: 100,
    deleteSpeed: 50,
    pauseBeforeDelete: 2000,
    pauseBeforeType: 500,

    init() {
      if (!elements.typingText) return;
      this.type();
    },

    type() {
      const currentWord = this.words[this.currentWordIndex];

      if (this.isDeleting) {
        this.currentCharIndex--;
        elements.typingText.textContent = currentWord.substring(0, this.currentCharIndex);

        if (this.currentCharIndex === 0) {
          this.isDeleting = false;
          this.currentWordIndex = (this.currentWordIndex + 1) % this.words.length;
          setTimeout(() => this.type(), this.pauseBeforeType);
          return;
        }

        setTimeout(() => this.type(), this.deleteSpeed);
      } else {
        this.currentCharIndex++;
        elements.typingText.textContent = currentWord.substring(0, this.currentCharIndex);

        if (this.currentCharIndex === currentWord.length) {
          this.isDeleting = true;
          setTimeout(() => this.type(), this.pauseBeforeDelete);
          return;
        }

        setTimeout(() => this.type(), this.typeSpeed);
      }
    },
  };

  // ==================== MOBILE NAVIGATION ====================
const navigation = {
  overlay: null,

  init() {
    this.createOverlay();
    this.bindEvents();
  },

  createOverlay() {
    this.overlay = document.createElement('div');
    this.overlay.classList.add('nav-overlay');
    document.body.appendChild(this.overlay);
  },

  bindEvents() {
    if (elements.navToggle) {
      elements.navToggle.addEventListener('click', () => this.openMenu());
    }

    if (elements.navClose) {
      elements.navClose.addEventListener('click', () => this.closeMenu());
    }

    if (this.overlay) {
      this.overlay.addEventListener('click', () => this.closeMenu());
    }

    elements.navLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          e.preventDefault();
          const target = document.querySelector(href);
          this.closeMenu();
          setTimeout(() => {
            if (target) {
              target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 350);
        } else {
          this.closeMenu();
        }
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && elements.navMenu.classList.contains('active')) {
        this.closeMenu();
      }
    });
  },

  openMenu() {
    elements.navMenu.classList.add('active');
    this.overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  },

  closeMenu() {
    elements.navMenu.classList.remove('active');
    this.overlay.classList.remove('active');
    document.body.style.overflow = '';
  },
};
  // ==================== HEADER SCROLL EFFECT ====================
  const headerScroll = {
    scrollThreshold: 50,

    init() {
      this.handleScroll();
      window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
    },

    handleScroll() {
      if (window.scrollY > this.scrollThreshold) {
        elements.header.classList.add('scrolled');
      } else {
        elements.header.classList.remove('scrolled');
      }
    },
  };

  // ==================== ACTIVE NAVIGATION LINK ====================
  const activeNav = {
    init() {
      this.handleScroll();
      window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
    },

    handleScroll() {
      const scrollY = window.scrollY;
      const headerHeight = elements.header.offsetHeight;

      elements.sections.forEach((section) => {
        const sectionTop = section.offsetTop - headerHeight - 100;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
          elements.navLinks.forEach((link) => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
              link.classList.add('active');
            }
          });
        }
      });
    },
  };

  // ==================== SCROLL ANIMATIONS ====================
  const scrollAnimations = {
    observer: null,

    init() {
      const options = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      };

      this.observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animated');
            this.observer.unobserve(entry.target);
          }
        });
      }, options);

      document.querySelectorAll('[data-animate]').forEach((el) => {
        this.observer.observe(el);
      });
    },
  };

  // ==================== CONTACT FORM ====================
  const contactForm = {
    init() {
      if (!elements.contactForm) return;
      elements.contactForm.addEventListener('submit', (e) => this.handleSubmit(e));
    },

    handleSubmit(e) {
      e.preventDefault();

      const formData = new FormData(elements.contactForm);
      const name = formData.get('name');
      const email = formData.get('email');
      const message = formData.get('message');

      const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
      const mailtoLink = `mailto:nkeokweluarinze@gmail.com?subject=${subject}&body=${body}`;

      window.location.href = mailtoLink;
      elements.contactForm.reset();
    },
  };

  // ==================== DYNAMIC YEAR ====================
  const dynamicYear = {
    init() {
      if (elements.yearSpan) {
        elements.yearSpan.textContent = new Date().getFullYear();
      }
    },
  };

  // ==================== SMOOTH SCROLL ====================
  const smoothScroll = {
    init() {
      document.querySelectorAll('a[href^="#"]:not(.nav__link)').forEach((anchor) => {
        anchor.addEventListener('click', (e) => this.handleClick(e, anchor));
      });
    },

    handleClick(e, anchor) {
      const href = anchor.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const headerHeight = elements.header.offsetHeight;
      const targetPosition = target.offsetTop - headerHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth',
      });
    },
  };

  // ==================== INITIALIZE ====================
  function init() {
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }

    themeManager.init();
    typingAnimation.init();
    navigation.init();
    headerScroll.init();
    activeNav.init();
    scrollAnimations.init();
    contactForm.init();
    dynamicYear.init();
    smoothScroll.init();
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

  // ==================== COUNT STAT VALUES ====================
const counters = document.querySelectorAll('.about__stat-value');
const speed = 90; 

counters.forEach(counter => {
    const target = +counter.dataset.target;
    let count = 0; 
    const updateCount = () => {
        const increment = Math.ceil(target / speed);
        count += increment;

        if (count < target) {
            counter.innerText = count;
            setTimeout(updateCount, 20);
        } else {
            counter.innerText = target;
        }
    };

    updateCount();
});
