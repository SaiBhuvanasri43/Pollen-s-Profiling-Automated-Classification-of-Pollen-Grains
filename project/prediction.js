// JavaScript for prediction.html
let selectedFile = null
let classificationResults = null

document.addEventListener("DOMContentLoaded", () => {
  initializePredictionPage()
})

function initializePredictionPage() {
  const fileInput = document.getElementById("fileInput")
  const uploadArea = document.getElementById("uploadArea")
  const imagePreview = document.getElementById("imagePreview")
  const classifyBtn = document.getElementById("classifyBtn")

  // File input change event
  fileInput.addEventListener("change", handleFileSelect)

  // Drag and drop events
  uploadArea.addEventListener("dragover", handleDragOver)
  uploadArea.addEventListener("dragleave", handleDragLeave)
  uploadArea.addEventListener("drop", handleDrop)

  // Click to upload
  uploadArea.addEventListener("click", () => fileInput.click())
}

function handleFileSelect(event) {
  const file = event.target.files[0]
  if (file) {
    processFile(file)
  }
}

function handleDragOver(event) {
  event.preventDefault()
  event.currentTarget.classList.add("dragover")
}

function handleDragLeave(event) {
  event.currentTarget.classList.remove("dragover")
}

function handleDrop(event) {
  event.preventDefault()
  event.currentTarget.classList.remove("dragover")

  const files = event.dataTransfer.files
  if (files.length > 0) {
    processFile(files[0])
  }
}

function processFile(file) {
  // Validate file type
  if (!file.type.startsWith("image/")) {
    alert("Please select an image file.")
    return
  }

  // Validate file size (10MB limit)
  if (file.size > 10 * 1024 * 1024) {
    alert("File size must be less than 10MB.")
    return
  }

  selectedFile = file
  displayImagePreview(file)
  enableClassifyButton()
}

function displayImagePreview(file) {
  const uploadArea = document.getElementById("uploadArea")
  const imagePreview = document.getElementById("imagePreview")
  const previewImg = document.getElementById("previewImg")

  const reader = new FileReader()
  reader.onload = (e) => {
    previewImg.src = e.target.result
    uploadArea.style.display = "none"
    imagePreview.style.display = "block"
  }
  reader.readAsDataURL(file)
}

function removeImage() {
  selectedFile = null
  const uploadArea = document.getElementById("uploadArea")
  const imagePreview = document.getElementById("imagePreview")
  const fileInput = document.getElementById("fileInput")

  uploadArea.style.display = "block"
  imagePreview.style.display = "none"
  fileInput.value = ""
  disableClassifyButton()
  hideResults()
}

function enableClassifyButton() {
  const classifyBtn = document.getElementById("classifyBtn")
  classifyBtn.disabled = false
}

function disableClassifyButton() {
  const classifyBtn = document.getElementById("classifyBtn")
  classifyBtn.disabled = true
}

async function classifyImage() {
  if (!selectedFile) {
    alert("Please select an image first.")
    return
  }

  const classifyBtn = document.getElementById("classifyBtn")
  const btnText = document.getElementById("btnText")
  const spinner = document.getElementById("spinner")

  // Show loading state
  classifyBtn.disabled = true
  btnText.textContent = "Classifying..."
  spinner.style.display = "inline-block"

  try {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Mock classification results
    const mockResults = generateMockResults()
    displayResults(mockResults)

    // Update classification count
    updateClassificationCount()
  } catch (error) {
    console.error("Classification error:", error)
    alert("An error occurred during classification. Please try again.")
  } finally {
    // Reset button state
    classifyBtn.disabled = false
    btnText.textContent = "Classify Pollen"
    spinner.style.display = "none"
  }
}

function generateMockResults() {
  const pollenTypes = [
    "Betula (Birch)",
    "Quercus (Oak)",
    "Pinus (Pine)",
    "Alnus (Alder)",
    "Corylus (Hazel)",
    "Fagus (Beech)",
    "Populus (Poplar)",
    "Salix (Willow)",
  ]

  const morphologies = ["Tricolporate", "Inaperturate", "Monocolpate", "Tricolpate", "Stephanocolpate", "Periporate"]

  const sizeCategories = ["Small (10-25μm)", "Medium (25-50μm)", "Large (50-100μm)"]
  const surfacePatterns = ["Smooth", "Reticulate", "Striate", "Scabrate", "Verrucate"]

  const primaryType = pollenTypes[Math.floor(Math.random() * pollenTypes.length)]
  const primaryConfidence = (85 + Math.random() * 10).toFixed(1)

  const alternatives = []
  for (let i = 0; i < 3; i++) {
    let altType
    do {
      altType = pollenTypes[Math.floor(Math.random() * pollenTypes.length)]
    } while (altType === primaryType || alternatives.some((alt) => alt.type === altType))

    alternatives.push({
      type: altType,
      confidence: (60 + Math.random() * 20).toFixed(1),
    })
  }

  return {
    primary: {
      type: primaryType,
      confidence: primaryConfidence,
    },
    alternatives: alternatives,
    details: {
      morphology: morphologies[Math.floor(Math.random() * morphologies.length)],
      sizeCategory: sizeCategories[Math.floor(Math.random() * sizeCategories.length)],
      surfacePattern: surfacePatterns[Math.floor(Math.random() * surfacePatterns.length)],
      processingTime: (1.2 + Math.random() * 2.3).toFixed(2) + "s",
    },
  }
}

function displayResults(results) {
  classificationResults = results

  // Update primary result
  document.getElementById("primaryType").textContent = results.primary.type
  document.getElementById("primaryConfidence").textContent = results.primary.confidence + "%"

  // Update alternative results
  const alternativeContainer = document.getElementById("alternativeResults")
  alternativeContainer.innerHTML = ""

  results.alternatives.forEach((alt) => {
    const resultItem = document.createElement("div")
    resultItem.className = "result-item"
    resultItem.innerHTML = `
            <span class="pollen-type">${alt.type}</span>
            <span class="confidence">${alt.confidence}%</span>
        `
    alternativeContainer.appendChild(resultItem)
  })

  // Update details
  document.getElementById("morphology").textContent = results.details.morphology
  document.getElementById("sizeCategory").textContent = results.details.sizeCategory
  document.getElementById("surfacePattern").textContent = results.details.surfacePattern
  document.getElementById("processingTime").textContent = results.details.processingTime

  // Show results section
  document.getElementById("resultsSection").style.display = "block"

  // Scroll to results
  document.getElementById("resultsSection").scrollIntoView({
    behavior: "smooth",
    block: "start",
  })
}

function hideResults() {
  document.getElementById("resultsSection").style.display = "none"
}

function downloadReport() {
  if (!classificationResults) {
    alert("No classification results to download.")
    return
  }

  const reportContent = generateReportContent()
  const blob = new Blob([reportContent], { type: "text/plain" })
  const url = URL.createObjectURL(blob)

  const a = document.createElement("a")
  a.href = url
  a.download = `pollen-classification-report-${new Date().toISOString().split("T")[0]}.txt`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function generateReportContent() {
  const timestamp = new Date().toLocaleString()
  const results = classificationResults

  return `
POLLEN CLASSIFICATION REPORT
============================

Generated: ${timestamp}
System: Pollen's Profiling v1.0

PRIMARY CLASSIFICATION
---------------------
Type: ${results.primary.type}
Confidence: ${results.primary.confidence}%

ALTERNATIVE CLASSIFICATIONS
--------------------------
${results.alternatives.map((alt) => `${alt.type}: ${alt.confidence}%`).join("\n")}

MORPHOLOGICAL ANALYSIS
---------------------
Features: ${results.details.morphology}
Size Category: ${results.details.sizeCategory}
Surface Pattern: ${results.details.surfacePattern}
Processing Time: ${results.details.processingTime}

NOTES
-----
This classification was performed using automated image analysis
and machine learning algorithms. Results should be verified by
qualified palynologists for scientific applications.

For questions or support, please contact the development team.
    `.trim()
}

function newAnalysis() {
  removeImage()
  window.scrollTo({ top: 0, behavior: "smooth" })
}

function updateClassificationCount() {
  const currentCount = Number.parseInt(localStorage.getItem("classificationsToday") || "0")
  localStorage.setItem("classificationsToday", (currentCount + 1).toString())
  localStorage.setItem("lastActivity", new Date().toISOString())
}
