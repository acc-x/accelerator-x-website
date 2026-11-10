(() => {
  // ========================================
  // SCROLL REVEAL + MICRO-INTERACTION SYSTEM
  // ========================================
  // Generic elements use `.reveal` (+ optional `.reveal-delay-*`) and toggle
  // `is-visible` via IntersectionObserver. Hero library runs independently.
  // prefers-reduced-motion: skips animation, applies final visual state.

  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  const makeAllRevealsVisible = () => {
    document.querySelectorAll('.reveal').forEach((el) => {
      el.classList.add('is-visible');
    });
  };

  const initialiseHeroLibrary = () => {
    const library = document.querySelector('[data-hero-library]');
    if (!library) return;

    const slides = Array.from(library.querySelectorAll('[data-hero-slide]'));
    if (slides.length < 2) return;

    const hydrateSlide = (slide) => {
      if (!slide || slide.dataset.heroLoaded === 'true') return;

      const pictureSource = slide.querySelector('source[data-srcset]');
      if (pictureSource) {
        pictureSource.setAttribute('srcset', pictureSource.dataset.srcset);
        if (pictureSource.dataset.sizes) {
          pictureSource.setAttribute('sizes', pictureSource.dataset.sizes);
        }
      }

      const image = slide.querySelector('img[data-src]');
      if (image) {
        image.setAttribute('src', image.dataset.src);
        if (image.dataset.srcset) {
          image.setAttribute('srcset', image.dataset.srcset);
        }
        if (image.dataset.sizes) {
          image.setAttribute('sizes', image.dataset.sizes);
        }
      }

      slide.dataset.heroLoaded = 'true';
    };

    let activeIndex = slides.findIndex((slide) => slide.classList.contains('is-active'));
    if (activeIndex === -1) activeIndex = 0;

    hydrateSlide(slides[activeIndex]);
    if (slides.length > 1) {
      hydrateSlide(slides[(activeIndex + 1) % slides.length]);
    }

    const interval = Number.parseInt(library.dataset.heroInterval || '6500', 10);
    if (!Number.isFinite(interval) || interval < 3000) return;

    let paused = false;

    window.setInterval(() => {
      if (paused) return;
      slides[activeIndex].classList.remove('is-active');
      activeIndex = (activeIndex + 1) % slides.length;
      hydrateSlide(slides[activeIndex]);
      if (slides.length > 2) {
        hydrateSlide(slides[(activeIndex + 1) % slides.length]);
      }
      slides[activeIndex].classList.add('is-active');
    }, interval);

    // WCAG 2.2.2 (Pause, Stop, Hide): content that auto-advances for more than 5s needs a
    // user control. Added here, not in the generated markup, so it exists only when the
    // rotation actually runs (prefers-reduced-motion returns before this point and gets
    // a static hero with nothing to pause). The label carries the state, and a polite
    // live region announces the change.
    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'hero-media-toggle';
    const status = document.createElement('span');
    status.className = 'hero-media-status';
    status.setAttribute('role', 'status');

    const renderToggle = () => {
      toggle.dataset.state = paused ? 'paused' : 'playing';
      toggle.setAttribute(
        'aria-label',
        paused ? 'Play hero image rotation' : 'Pause hero image rotation'
      );
    };

    toggle.addEventListener('click', () => {
      paused = !paused;
      renderToggle();
      status.textContent = paused ? 'Hero image rotation paused' : 'Hero image rotation playing';
    });

    renderToggle();
    library.append(toggle, status);
  };

  if (prefersReducedMotion) {
    makeAllRevealsVisible();
    return;
  }

  initialiseHeroLibrary();

  // Generic scroll reveals — fade + translateY. Add `.reveal` (+ optional
  // `.reveal-delay-*`) to any element to wire it up automatically.
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    { root: null, rootMargin: '0px 0px -50px 0px', threshold: 0.1 }
  );

  document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));
})();
