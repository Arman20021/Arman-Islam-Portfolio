document.addEventListener('DOMContentLoaded', () => {
  const navMenu = document.getElementById('nav-menu');
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.querySelectorAll('.nav__link');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('show-menu');
    });
  }

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu?.classList.remove('show-menu');
    });
  });

  const words = [
    'Software Engineer',
    'Backend Engineer',
    'Django & ASP.NET Core',
    'REST APIs',
    'Competitive Programmer'
  ];

  const dynamicText = document.getElementById('dynamic-text');
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function typeLoop() {
    if (!dynamicText) return;

    const currentWord = words[wordIndex];
    dynamicText.textContent = currentWord.slice(0, charIndex);

    if (!isDeleting && charIndex < currentWord.length) {
      charIndex += 1;
      setTimeout(typeLoop, 70);
      return;
    }

    if (!isDeleting && charIndex === currentWord.length) {
      isDeleting = true;
      setTimeout(typeLoop, 1200);
      return;
    }

    if (isDeleting && charIndex > 0) {
      charIndex -= 1;
      setTimeout(typeLoop, 36);
      return;
    }

    isDeleting = false;
    wordIndex = (wordIndex + 1) % words.length;
    setTimeout(typeLoop, 260);
  }

  typeLoop();

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, { threshold: 0.16, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach((el, index) => {
    el.style.transitionDelay = `${Math.min(index % 6, 5) * 55}ms`;
    revealObserver.observe(el);
  });

  const sections = document.querySelectorAll('section[id]');
  function setActiveLink() {
    const scrollY = window.scrollY;

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      const link = document.querySelector(`.nav__link[href="#${sectionId}"]`);

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(item => item.classList.remove('active-link'));
        link?.classList.add('active-link');
      }
    });
  }

  window.addEventListener('scroll', setActiveLink, { passive: true });
  setActiveLink();

  window.addEventListener('mousemove', (event) => {
    document.body.style.setProperty('--mx', `${event.clientX}px`);
    document.body.style.setProperty('--my', `${event.clientY}px`);
  }, { passive: true });

  const form = document.getElementById('noteForm');
  const successMessage = document.getElementById('successMessage');

  if (form && successMessage) {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' }
        });

        if (!response.ok) throw new Error('Form submission failed');

        form.reset();
        successMessage.classList.add('show');
        setTimeout(() => successMessage.classList.remove('show'), 3000);
      } catch (error) {
        successMessage.textContent = 'Message could not be sent. Please try again.';
        successMessage.classList.add('show');
        setTimeout(() => successMessage.classList.remove('show'), 3000);
      }
    });
  }

  const scrollBtn = document.getElementById('scrollBtn');
  const scrollIcon = document.getElementById('scrollIcon');

  function isNearBottom() {
    return window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 120;
  }

  function updateScrollButton() {
    if (!scrollIcon) return;
    scrollIcon.className = isNearBottom() ? 'bx bx-up-arrow-alt' : 'bx bx-down-arrow-alt';
  }

  if (scrollBtn) {
    scrollBtn.addEventListener('click', () => {
      window.scrollTo({
        top: isNearBottom() ? 0 : document.documentElement.scrollHeight,
        behavior: 'smooth'
      });
    });

    window.addEventListener('scroll', updateScrollButton, { passive: true });
    updateScrollButton();
  }
});

function showReviewMessage() {
  alert('Sorry, this paper is currently under review.\nExpected Date: 20 April 2026');
}
