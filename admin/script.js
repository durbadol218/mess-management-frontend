const hamburger = document.querySelector("#toggle-btn");

hamburger.addEventListener("click", function () {
  document.querySelector("#sidebar").classList.toggle("expand");
});

const sidebarToggle = document.querySelector("#sidebar-toggle");
sidebarToggle.addEventListener("click", function () {
  document.querySelector("#sidebar").classList.toggle("collapsed");
});

document.querySelector(".theme-toggle").addEventListener("click", () => {
  toggleLocalStorage();
  toggleRootClass();
});

function toggleRootClass() {
  const current = document.documentElement.getAttribute("data-bs-theme");
  const inverted = current == "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-bs-theme", inverted);
}

function toggleLocalStorage() {
  if (isLight()) {
    localStorage.removeItem("light");
  } else {
    localStorage.setItem("light", "set");
  }
}

function isLight() {
  return localStorage.getItem("light");
}

if (isLight()) {
  toggleRootClass();
}

// Loader Utility Functions
const showLoader = (message = "Loading...") => {
  const loaderHTML = `
    <div class="loader-overlay">
      <div class="loader-content">
        <div class="spinner-border text-primary spinner" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-2">${message}</p>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML("beforeend", loaderHTML);
};

const hideLoader = () => {
  const loader = document.querySelector(".loader-overlay");
  if (loader) loader.remove();
};

// Add to all navigation clicks
document.addEventListener("DOMContentLoaded", () => {
  // Handle sidebar link clicks
  document.querySelectorAll(".sidebar-link").forEach((link) => {
    link.addEventListener("click", function (e) {
      if (this.getAttribute("href") === "#") return;

      // Show loader with contextual message
      const linkText = this.textContent.trim();
      showLoader(`Loading ${linkText}...`);

      // Simulate loading (remove this in production)
      setTimeout(hideLoader, 1000);
    });
  });

  // Handle button clicks
  document.querySelectorAll("button[onclick]").forEach((button) => {
    button.addEventListener("click", function () {
      showLoader(`Processing ${this.textContent.trim()}...`);
    });
  });
});
