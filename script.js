const tabButtons = document.querySelectorAll(".tab-button");
const sections = document.querySelectorAll(".content-section");

function activateButton(sectionId) {
  tabButtons.forEach((button) => {
    const isActive = button.dataset.target === sectionId;
    button.classList.toggle("is-active", isActive);
  });
}

function syncActiveButtonToViewport() {
  let matched = false;

  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    const isVisible = rect.top <= window.innerHeight * 0.35 && rect.bottom >= window.innerHeight * 0.35;

    if (!isVisible) {
      return;
    }

    tabButtons.forEach((button) => {
      const isCurrent = button.dataset.target === section.id;
      button.classList.toggle("is-active", isCurrent);
      matched = matched || isCurrent;
    });
  });

  if (!matched) {
    tabButtons.forEach((button) => {
      button.classList.remove("is-active");
    });
  }
}

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const targetSection = document.getElementById(button.dataset.target);

    if (!targetSection) {
      return;
    }

    activateButton(button.dataset.target);
  });

  button.addEventListener("keydown", (event) => {
    const currentIndex = Array.from(tabButtons).indexOf(button);

    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      event.preventDefault();
      const nextButton = tabButtons[(currentIndex + 1) % tabButtons.length];
      nextButton.focus();
      const targetSection = document.getElementById(nextButton.dataset.target);
      activateButton(nextButton.dataset.target);
      targetSection?.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      event.preventDefault();
      const nextButton = tabButtons[(currentIndex - 1 + tabButtons.length) % tabButtons.length];
      nextButton.focus();
      const targetSection = document.getElementById(nextButton.dataset.target);
      activateButton(nextButton.dataset.target);
      targetSection?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      let matched = false;
      tabButtons.forEach((button) => {
        const isCurrent = button.dataset.target === entry.target.id;
        button.classList.toggle("is-active", isCurrent);
        matched = matched || isCurrent;
      });

      if (!matched) {
        tabButtons.forEach((button) => {
          button.classList.remove("is-active");
        });
      }
    });
  },
  {
    rootMargin: "-35% 0px -45% 0px",
    threshold: 0.2,
  }
);

sections.forEach((section) => observer.observe(section));
syncActiveButtonToViewport();
