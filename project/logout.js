// JavaScript for logout.html
document.addEventListener("DOMContentLoaded", () => {
  initializeLogoutPage()
})

function initializeLogoutPage() {
  loadSessionInfo()
  setupLogoutHandlers()
}

function loadSessionInfo() {
  const sessionStartTime = localStorage.getItem("sessionStartTime")
  const lastActivity = localStorage.getItem("lastActivity")
  const classificationsCount = localStorage.getItem("classificationsToday") || "0"

  if (sessionStartTime) {
    const startTime = new Date(sessionStartTime)
    document.getElementById("loginTime").textContent = startTime.toLocaleString()
  }

  if (lastActivity) {
    const lastTime = new Date(lastActivity)
    document.getElementById("lastActivity").textContent = lastTime.toLocaleString()
  }

  document.getElementById("classificationsCount").textContent = classificationsCount
}

function setupLogoutHandlers() {
  // Update session info every 30 seconds
  setInterval(loadSessionInfo, 30000)
}

async function performLogout() {
  const logoutBtn = document.querySelector(".logout-btn")
  const logoutText = document.getElementById("logoutText")
  const logoutSpinner = document.getElementById("logoutSpinner")
  const logoutMessage = document.getElementById("logoutMessage")

  // Get user preferences
  const saveProgress = document.getElementById("saveProgress").checked
  const clearCache = document.getElementById("clearCache").checked
  const rememberSession = document.getElementById("rememberSession").checked

  // Show loading state
  logoutBtn.disabled = true
  logoutText.textContent = "Logging out..."
  logoutSpinner.style.display = "inline-block"

  try {
    // Simulate logout process
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Handle user preferences
    if (!saveProgress) {
      // Clear analysis progress
      localStorage.removeItem("currentAnalysis")
      localStorage.removeItem("analysisHistory")
    }

    if (clearCache) {
      // Clear browser cache (limited to localStorage)
      const keysToKeep = rememberSession ? ["sessionPreferences"] : []
      const allKeys = Object.keys(localStorage)

      allKeys.forEach((key) => {
        if (!keysToKeep.includes(key)) {
          localStorage.removeItem(key)
        }
      })
    }

    if (rememberSession) {
      localStorage.setItem(
        "sessionPreferences",
        JSON.stringify({
          rememberMe: true,
          lastLogout: new Date().toISOString(),
        }),
      )
    }

    // Update session status
    updateSessionStatus("Logged out")

    // Show success message
    showLogoutSuccess()
  } catch (error) {
    console.error("Logout error:", error)
    alert("An error occurred during logout. Please try again.")

    // Reset button state
    logoutBtn.disabled = false
    logoutText.textContent = "Logout"
    logoutSpinner.style.display = "none"
  }
}

function clearSessionData() {
  if (confirm("Are you sure you want to clear all session data? This action cannot be undone.")) {
    // Clear all localStorage data
    localStorage.clear()

    // Reset session info display
    document.getElementById("loginTime").textContent = "-"
    document.getElementById("lastActivity").textContent = "-"
    document.getElementById("classificationsCount").textContent = "0"

    // Update session status
    updateSessionStatus("Data cleared")

    alert("Session data has been cleared successfully.")
  }
}

function updateSessionStatus(status) {
  const sessionStatus = document.getElementById("sessionStatus")
  sessionStatus.textContent = status
  sessionStatus.className = "status"

  if (status === "Logged out" || status === "Data cleared") {
    sessionStatus.classList.add("inactive")
    sessionStatus.style.background = "#ff6b6b"
  }
}

function showLogoutSuccess() {
  const logoutCard = document.querySelector(".logout-card")
  const logoutMessage = document.getElementById("logoutMessage")

  // Hide main logout content
  const mainContent = logoutCard.children
  for (let i = 0; i < mainContent.length - 1; i++) {
    mainContent[i].style.display = "none"
  }

  // Show success message
  logoutMessage.style.display = "block"

  // Auto-redirect after 5 seconds
  setTimeout(() => {
    window.location.href = "index.html"
  }, 5000)
}

// Add CSS for inactive status
const style = document.createElement("style")
style.textContent = `
    .status.inactive {
        background: #ff6b6b !important;
    }
`
document.head.appendChild(style)
