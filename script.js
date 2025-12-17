document.addEventListener('DOMContentLoaded', function() {
  const body = document.body;
  const pageLoader = document.querySelector('.page-loader');
  const navbar = document.getElementById('navbar');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav a');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.querySelector('.lightbox-img');
  const lightboxClose = document.querySelector('.lightbox-close');
  const contactForm = document.getElementById('contactForm');
  const toast = document.getElementById('toast');
  const yearSpan = document.getElementById('year');
  const cursor = document.querySelector('.cursor');
  const cursorFollower = document.querySelector('.cursor-follower');

  yearSpan.textContent = new Date().getFullYear();
  
  pageLoader.classList.add('hidden');
  animateHeroElements();

  function animateHeroElements() {
    const heroElements = document.querySelectorAll('#hero .anim-item');
    heroElements.forEach(function(el, index) {
      setTimeout(function() {
        el.classList.add('visible');
      }, index * 150);
    });
  }

  if (cursor && cursorFollower) {
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let followerX = 0;
    let followerY = 0;

    document.addEventListener('mousemove', function(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function animateCursor() {
      cursorX += (mouseX - cursorX) * 0.2;
      cursorY += (mouseY - cursorY) * 0.2;
      followerX += (mouseX - followerX) * 0.1;
      followerY += (mouseY - followerY) * 0.1;

      cursor.style.left = cursorX - 6 + 'px';
      cursor.style.top = cursorY - 6 + 'px';
      cursorFollower.style.left = followerX - 20 + 'px';
      cursorFollower.style.top = followerY - 20 + 'px';

      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    const hoverElements = document.querySelectorAll('a, button, .gallery-item, .service-card');
    hoverElements.forEach(function(el) {
      el.addEventListener('mouseenter', function() {
        cursor.style.transform = 'scale(2)';
        cursorFollower.style.transform = 'scale(1.5)';
        cursorFollower.style.borderColor = 'var(--secondary)';
      });
      el.addEventListener('mouseleave', function() {
        cursor.style.transform = 'scale(1)';
        cursorFollower.style.transform = 'scale(1)';
        cursorFollower.style.borderColor = 'var(--secondary)';
      });
    });
  }

  let lastScrollY = 0;
  let ticking = false;

  function updateNavbar() {
    const scrollY = window.scrollY;
    
    if (scrollY > 100) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    lastScrollY = scrollY;
    ticking = false;
  }

  window.addEventListener('scroll', function() {
    if (!ticking) {
      requestAnimationFrame(updateNavbar);
      ticking = true;
    }
  });

  mobileMenuBtn.addEventListener('click', function() {
    mobileMenuBtn.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
  });

  mobileNavLinks.forEach(function(link) {
    link.addEventListener('click', function() {
      mobileMenuBtn.classList.remove('active');
      mobileMenu.classList.remove('active');
      body.style.overflow = '';
    });
  });

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -100px 0px',
    threshold: 0.1
  };

  const animationObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  const animatedElements = document.querySelectorAll('.anim-item, .anim-scale, .anim-slide-right');
  animatedElements.forEach(function(el) {
    if (!el.closest('#hero')) {
      animationObserver.observe(el);
    }
  });

  const parallaxBgs = document.querySelectorAll('.hero-bg img, .about-img-main, .about-img-secondary');
  
  function updateParallax() {
    const scrollY = window.scrollY;
    
    parallaxBgs.forEach(function(el) {
      const rect = el.getBoundingClientRect();
      const speed = 0.3;
      
      if (rect.bottom > 0 && rect.top < window.innerHeight) {
        const yPos = (scrollY - el.offsetTop) * speed;
        el.style.transform = 'translateY(' + yPos + 'px) scale(1.1)';
      }
    });
  }

  window.addEventListener('scroll', function() {
    requestAnimationFrame(updateParallax);
  });

  const counters = document.querySelectorAll('.counter');
  const counterObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.getAttribute('data-target'));
        animateCounter(counter, target);
        counterObserver.unobserve(counter);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(function(counter) {
    counterObserver.observe(counter);
  });

  function animateCounter(element, target) {
    let current = 0;
    const increment = target / 60;
    const duration = 2000;
    const stepTime = duration / 60;

    function step() {
      current += increment;
      if (current < target) {
        element.textContent = Math.floor(current);
        setTimeout(step, stepTime);
      } else {
        element.textContent = target;
      }
    }
    step();
  }

  galleryItems.forEach(function(item) {
    item.addEventListener('click', function() {
      const imgSrc = this.getAttribute('data-img');
      lightboxImg.src = imgSrc;
      lightbox.classList.add('active');
      body.style.overflow = 'hidden';
    });
  });

  lightboxClose.addEventListener('click', function() {
    lightbox.classList.remove('active');
    body.style.overflow = '';
  });

  lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox) {
      lightbox.classList.remove('active');
      body.style.overflow = '';
    }
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      lightbox.classList.remove('active');
      body.style.overflow = '';
    }
  });

  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    
    if (name.length < 2) {
      shakeElement(document.getElementById('name'));
      return;
    }
    
    if (!isValidEmail(email)) {
      shakeElement(document.getElementById('email'));
      return;
    }

    const submitBtn = contactForm.querySelector('.btn-submit');
    submitBtn.innerHTML = '<span>Sending...</span>';
    submitBtn.disabled = true;

    setTimeout(function() {
      toast.classList.add('show');
      contactForm.reset();
      submitBtn.innerHTML = '<span>Send Message</span><svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      submitBtn.disabled = false;
      
      setTimeout(function() {
        toast.classList.remove('show');
      }, 4000);
    }, 1500);
  });

  function shakeElement(element) {
    element.style.animation = 'shake 0.5s ease';
    element.style.borderColor = '#ef4444';
    
    setTimeout(function() {
      element.style.animation = '';
      element.style.borderColor = '';
    }, 500);
  }

  const style = document.createElement('style');
  style.textContent = '@keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-10px); } 75% { transform: translateX(10px); } }';
  document.head.appendChild(style);

  function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const target = document.querySelector(targetId);
      
      if (target) {
        const navHeight = navbar.offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  const serviceCards = document.querySelectorAll('.service-card');
  serviceCards.forEach(function(card) {
    card.addEventListener('mouseenter', function(e) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      card.style.setProperty('--mouse-x', x + 'px');
      card.style.setProperty('--mouse-y', y + 'px');
    });
  });

  const marquee = document.querySelector('.marquee-content');
  if (marquee) {
    const clone = marquee.cloneNode(true);
    marquee.parentNode.appendChild(clone);
  }

  const formInputs = document.querySelectorAll('.form-group input, .form-group textarea, .form-group select');
  formInputs.forEach(function(input) {
    input.addEventListener('focus', function() {
      this.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', function() {
      this.parentElement.classList.remove('focused');
      if (this.value) {
        this.parentElement.classList.add('filled');
      } else {
        this.parentElement.classList.remove('filled');
      }
    });
  });

  const images = document.querySelectorAll('img');
  images.forEach(function(img) {
    if (img.complete) {
      img.classList.add('loaded');
    } else {
      img.addEventListener('load', function() {
        img.classList.add('loaded');
      });
    }
  });

  const buttons = document.querySelectorAll('.btn-hero-primary, .btn-cta, .btn-services, .btn-submit');
  buttons.forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const ripple = document.createElement('span');
      ripple.className = 'btn-ripple';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      
      btn.appendChild(ripple);
      
      setTimeout(function() {
        ripple.remove();
      }, 600);
    });
  });

  const rippleStyle = document.createElement('style');
  rippleStyle.textContent = `
    .btn-ripple {
      position: absolute;
      width: 10px;
      height: 10px;
      background: rgba(255, 255, 255, 0.4);
      border-radius: 50%;
      transform: translate(-50%, -50%) scale(0);
      animation: rippleEffect 0.6s ease-out;
      pointer-events: none;
    }
    @keyframes rippleEffect {
      to {
        transform: translate(-50%, -50%) scale(20);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(rippleStyle);

  const titleReveals = document.querySelectorAll('.title-reveal');
  const titleObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'revealUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards';
        titleObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  titleReveals.forEach(function(title, index) {
    title.style.opacity = '0';
    title.style.transform = 'translateY(100%)';
    title.style.animationDelay = (index * 0.1) + 's';
    titleObserver.observe(title);
  });

  const revealStyle = document.createElement('style');
  revealStyle.textContent = `
    @keyframes revealUp {
      from {
        opacity: 0;
        transform: translateY(100%);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;
  document.head.appendChild(revealStyle);
});
