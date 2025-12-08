// MOBILE MENU - Single implementation to avoid conflicts

// GLAVNA SLIDER FUNKCIJA
function initSlider(sliderId, interval = null) {
  const slider = document.getElementById(sliderId);
  if (!slider) return;

  const track = slider.querySelector(".slider-track");
  const slides = slider.querySelectorAll(".slide");
  const prevBtn = slider.querySelector(".prev");
  const nextBtn = slider.querySelector(".next");

  // original behavior

  let index = 0;
  let autoPlay = null;

  function showSlide(i) {
    if (i < 0) index = slides.length - 1;
    else if (i >= slides.length) index = 0;
    else index = i;

    // Use percentage-based transform for responsive design
    // Each slide is 100% of container, so we move by 100% per slide
    const containerWidth = slider.offsetWidth || slider.clientWidth;
    track.style.transform = `translateX(-${index * 100}%)`;
    
    // Ensure track width accommodates all slides
    track.style.width = `${slides.length * 100}%`;
    
    // Ensure all slides maintain proper width and visibility
    // Don't override display or visibility - let CSS handle it
    slides.forEach((slide) => {
      slide.style.flexShrink = '0';
      slide.style.flexBasis = '100%';
      slide.style.width = '100%';
      slide.style.minWidth = '100%';
      slide.style.maxWidth = '100%';
      // Remove inline styles that conflict with CSS
      slide.style.opacity = "";
      slide.style.visibility = "";
      slide.style.display = "";
    });

    // pauziraj sve videe osim trenutnog
    slides.forEach((slide, idx) => {
      const video = slide.querySelector("video");
      if (video) {
        if (idx !== index) {
          video.pause();
          video.currentTime = 0;
        }
      }
    });
  }
  
  // Handle window resize for mobile - only add once per slider
  if (!slider.dataset.resizeListenerAdded) {
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        showSlide(index);
      }, 100);
    });
    slider.dataset.resizeListenerAdded = 'true';
  }

  function prevSlide() {
    showSlide(index - 1);
  }
  function nextSlide() {
    showSlide(index + 1);
  }

  // Dugmad
  if (prevBtn) prevBtn.addEventListener("click", prevSlide);
  if (nextBtn) nextBtn.addEventListener("click", nextSlide);

  // Autoplay samo ako je zadat interval
  if (interval) {
    autoPlay = setInterval(nextSlide, interval);
    slider.addEventListener("mouseenter", () => {
      if (autoPlay) clearInterval(autoPlay);
    });
    slider.addEventListener("mouseleave", () => {
      if (autoPlay) clearInterval(autoPlay);
      autoPlay = setInterval(nextSlide, interval);
    });
  }

  showSlide(index);
}

// Slike – automatski
initSlider("imageSlider", 4000);

// Video – ručno
initSlider("videoSlider", null);

// VIDEO GALERIJA — samo jedan aktivan
const videos = document.querySelectorAll("#videoSlider video");
videos.forEach(video => {
  video.muted = true;
  video.addEventListener("play", () => {
    videos.forEach(v => {
      if (v !== video) v.pause();
    });
  });
});



// MOBILE MENU - Single clean implementation
document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");
  const closeMenu = document.getElementById("closeMenu");
  const menuBackdrop = document.getElementById("menuBackdrop");

  if (!menuToggle || !navLinks || !closeMenu) return;

  const menuControls = menuToggle.closest(".menu-controls") || menuToggle.parentElement;

  function openMenu() {
    navLinks.classList.add("open");
    if (menuBackdrop) menuBackdrop.classList.add("active");
    if (menuControls) menuControls.classList.add("menu-open");
    document.body.style.overflow = "hidden"; // Prevent background scrolling
  }

  function closeMenuFunc() {
    navLinks.classList.remove("open");
    if (menuBackdrop) menuBackdrop.classList.remove("active");
    if (menuControls) menuControls.classList.remove("menu-open");
    document.body.style.overflow = ""; // Restore scrolling
  }

  // Otvori meni
  menuToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    openMenu();
  });

  // Zatvori meni
  closeMenu.addEventListener("click", (e) => {
    e.stopPropagation();
    closeMenuFunc();
  });

  // Zatvori meni kad se klikne na backdrop (left side)
  if (menuBackdrop) {
    menuBackdrop.addEventListener("click", () => {
      closeMenuFunc();
    });
  }

  // Zatvori meni kad se klikne na bilo koji link
  const links = navLinks.querySelectorAll("a");
  links.forEach(link => {
    link.addEventListener("click", () => {
      closeMenuFunc();
    });
  });

  // Zatvori meni ako se klikne van njega (fallback)
  document.addEventListener("click", (e) => {
    if (navLinks.classList.contains("open") && 
        !navLinks.contains(e.target) && 
        !menuToggle.contains(e.target) &&
        !menuBackdrop?.contains(e.target)) {
      closeMenuFunc();
    }
  });
});

// Scroll-triggered animations for sections - desktop only
document.addEventListener("DOMContentLoaded", () => {
  // Only run on desktop (above 768px)
  if (window.innerWidth <= 768) return;

  // Animation observer configuration
  const observerOptions = {
    threshold: 0.2, // Trigger when 20% of section is visible
    rootMargin: "0px 0px -100px 0px" // Trigger slightly before fully in view
  };

  const observerCallback = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-in");
        // Unobserve after animation triggers to prevent re-triggering
        observer.unobserve(entry.target);
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);

  // Observe O nama section
  const onamaSection = document.getElementById("onama");
  if (onamaSection) {
    observer.observe(onamaSection);
  }

  // Observe Kontakt section
  const kontaktSection = document.getElementById("kontakt");
  if (kontaktSection) {
    observer.observe(kontaktSection);
  }

  // Observe Shop section for extra small version only
  if (window.innerWidth <= 480) {
    const shopSection = document.getElementById("shop");
    if (shopSection) {
      const shopObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              shopSection.classList.add("animate-in");
              shopObserver.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.2,
          rootMargin: "0px 0px -100px 0px"
        }
      );
      shopObserver.observe(shopSection);
    }
  }
});



// iPhone detection (najpreciznije)
function isIphone() {
    return /iPhone|iPod/i.test(navigator.userAgent) && !window.MSStream;
}

// iPhone-specific code
if (isIphone()) {

    console.log("iPhone Safari detektovan — primenjujem posebne efekte.");

    /* Primer: Pojačaj blur u meniju samo na iPhone */
    const mobileMenu = document.querySelector(".mobile-menu");
    if (mobileMenu) {
        mobileMenu.style.backdropFilter = "blur(16px)";
    }

    /* Primer: Dodaj light fade na hero video */
    const hero = document.querySelector(".hero");
    if (hero) {
        hero.style.transition = "opacity 0.3s ease";
        hero.style.opacity = "0.95";
    }

    /* Primer: Hambuger opcije fade-in samo za iPhone */
    const links = document.querySelectorAll(".mobile-menu a");
    links.forEach((link, i) => {
        link.style.opacity = "0";
        setTimeout(() => {
            link.style.transition = "opacity 0.5s ease";
            link.style.opacity = "1";
        }, 150 * i);
    });
}
 
