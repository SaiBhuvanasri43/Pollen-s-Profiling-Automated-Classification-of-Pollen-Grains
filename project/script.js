// Main JavaScript file for index.html
document.addEventListener("DOMContentLoaded", () => {
  // Smooth scrolling for navigation links
  const navLinks = document.querySelectorAll(".nav-link")
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href")
      if (href.startsWith("#")) {
        e.preventDefault()
        const target = document.querySelector(href)
        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
          })
        }
      }
    })
  })

  // Add animation to scenario cards on scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1"
        entry.target.style.transform = "translateY(0)"
      }
    })
  }, observerOptions)

  // Observe scenario cards
  const scenarioCards = document.querySelectorAll(".scenario-card")
  scenarioCards.forEach((card) => {
    card.style.opacity = "0"
    card.style.transform = "translateY(30px)"
    card.style.transition = "opacity 0.6s ease, transform 0.6s ease"
    observer.observe(card)
  })

  // Add hover effects to feature cards
  const featureCards = document.querySelectorAll(".feature")
  featureCards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-5px)"
      this.style.transition = "transform 0.3s ease"
    })

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0)"
    })
  })

  // CTA button animation
  const ctaButton = document.querySelector(".cta-button")
  if (ctaButton) {
    ctaButton.addEventListener("mouseenter", function () {
      this.style.boxShadow = "0 8px 25px rgba(255,107,107,0.6)"
    })

    ctaButton.addEventListener("mouseleave", function () {
      this.style.boxShadow = "0 5px 15px rgba(255,107,107,0.4)"
    })
  }

  // Initialize session data
  initializeSession()
})

function initializeSession() {
  // Set session start time if not exists
  if (!localStorage.getItem("sessionStartTime")) {
    localStorage.setItem("sessionStartTime", new Date().toISOString())
  }

  // Update last activity
  localStorage.setItem("lastActivity", new Date().toISOString())

  // Initialize classification count
  if (!localStorage.getItem("classificationsToday")) {
    localStorage.setItem("classificationsToday", "0")
  }
}

// Update activity timestamp
function updateActivity() {
  localStorage.setItem("lastActivity", new Date().toISOString())
}

// Call updateActivity on user interactions
document.addEventListener("click", updateActivity)
document.addEventListener("scroll", updateActivity)
