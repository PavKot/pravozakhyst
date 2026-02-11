document.addEventListener("DOMContentLoaded", () => {
  // Mobile Menu Toggle
  const mobileBtn = document.querySelector(".mobile-menu-btn");
  const nav = document.querySelector(".nav");

  if (mobileBtn) {
    mobileBtn.addEventListener("click", () => {
      nav.classList.toggle("active");
      const icon = mobileBtn.querySelector("i");
      if (nav.classList.contains("active")) {
        icon.classList.remove("fa-bars");
        icon.classList.add("fa-xmark");
      } else {
        icon.classList.remove("fa-xmark");
        icon.classList.add("fa-bars");
      }
    });
  }

  // Smooth Scroll for Anchors
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      // Close mobile menu if open
      if (nav.classList.contains("active")) {
        nav.classList.remove("active");
        const icon = mobileBtn.querySelector("i");
        icon.classList.remove("fa-xmark");
        icon.classList.add("fa-bars");
      }

      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // Slider Implementation (Supports multiple sliders)
  const sliderContainers = document.querySelectorAll(".slider-container");

  sliderContainers.forEach((sliderContainer, sliderIndex) => {
    const slides = sliderContainer.querySelectorAll(".slide");
    const dots = sliderContainer.querySelectorAll(".slider-dot");
    const prevBtn = sliderContainer.querySelector(".slider-btn-prev");
    const nextBtn = sliderContainer.querySelector(".slider-btn-next");

    let currentSlide = 0;
    let autoSlideInterval;
    let isTransitioning = false;
    const slideCount = slides.length;
    const autoSlideDelay = 5000;

    // Update slider to show specific slide
    function goToSlide(index) {
      if (isTransitioning) return;
      isTransitioning = true;

      // Handle wrap-around
      if (index < 0) index = slideCount - 1;
      if (index >= slideCount) index = 0;

      // Update slides
      slides.forEach((slide, i) => {
        slide.classList.remove("active");
        if (i === index) {
          slide.classList.add("active");
        }
      });

      // Update dots
      dots.forEach((dot, i) => {
        dot.classList.remove("active");
        if (i === index) {
          dot.classList.add("active");
        }
      });

      currentSlide = index;

      // Reset progress bar animation
      sliderContainer.style.animation = "none";
      sliderContainer.offsetHeight; // Trigger reflow
      sliderContainer.style.animation = "";

      // Allow next transition after animation completes
      setTimeout(() => {
        isTransitioning = false;
      }, 700);
    }

    // Next slide
    function nextSlide() {
      goToSlide(currentSlide + 1);
    }

    // Previous slide
    function prevSlide() {
      goToSlide(currentSlide - 1);
    }

    // Start auto-slide
    function startAutoSlide() {
      stopAutoSlide();
      autoSlideInterval = setInterval(nextSlide, autoSlideDelay);
    }

    // Stop auto-slide
    function stopAutoSlide() {
      if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
      }
    }

    // Event listeners for navigation buttons
    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        nextSlide();
        startAutoSlide();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        prevSlide();
        startAutoSlide();
      });
    }

    // Event listeners for dots
    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        goToSlide(index);
        startAutoSlide();
      });
    });

    // Pause on hover
    sliderContainer.addEventListener("mouseenter", stopAutoSlide);
    sliderContainer.addEventListener("mouseleave", startAutoSlide);

    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    sliderContainer.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoSlide();
      },
      { passive: true },
    );

    sliderContainer.addEventListener(
      "touchend",
      (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        startAutoSlide();
      },
      { passive: true },
    );

    function handleSwipe() {
      const swipeThreshold = 50;
      const diff = touchStartX - touchEndX;

      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }
    }

    // Keyboard navigation when slider is focused
    sliderContainer.setAttribute("tabindex", "0");
    sliderContainer.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        prevSlide();
        startAutoSlide();
      } else if (e.key === "ArrowRight") {
        nextSlide();
        startAutoSlide();
      }
    });

    // Start auto-slide on page load
    startAutoSlide();

    // Pause when page is not visible (global listener, simplified for per-slider)
    // We attach this once globally or manage it?
    // Attaching multiple listeners is fine, but cleaner to have one.
    // However, since we are inside a loop, let's just keep it simple or remove it to avoid 10 listeners.
    // Instead of multiple listeners, let's just rely on the fact that setInterval keeps running.
    // Or add one global listener that iterates all sliders?
    // For now, let's keep it scoped but maybe debounced or just accept multiple listeners (it's only 2 sliders).
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        stopAutoSlide();
      } else {
        startAutoSlide();
      }
    });
  });

  // Reveal on Scroll Animation
  const observerOptions = {
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, observerOptions);

  // Initial check (can be expanded to add 'reveal' class to sections)

  // Dynamic year in footer
  const yearElement = document.getElementById("currentYear");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
});
