document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    sidebar.parentNode.insertBefore(overlay, sidebar.nextSibling);

    function toggleSidebar() {
        sidebar.classList.toggle('collapsed');
        document.body.classList.toggle('sidebar-open');
    }

    sidebarToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleSidebar();
    });

    overlay.addEventListener('click', function() {
        sidebar.classList.remove('collapsed');
        document.body.classList.remove('sidebar-open');
    });

    document.querySelectorAll('.sidebar-link').forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth < 992) {
                sidebar.classList.remove('collapsed');
                document.body.classList.remove('sidebar-open');
            }
        });
    });
    function handleResize() {
        if (window.innerWidth >= 992) {
            sidebar.classList.remove('collapsed');
            document.body.classList.remove('sidebar-open');
        }
    }

    window.addEventListener('resize', handleResize);
    handleResize();
});

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

document.addEventListener("DOMContentLoaded", () => {

  document.querySelectorAll(".sidebar-link").forEach((link) => {
    link.addEventListener("click", function (e) {
      if (this.getAttribute("href") === "#") return;

      const linkText = this.textContent.trim();
      showLoader(`Loading ${linkText}...`);

      setTimeout(hideLoader, 1000);
    });
  });
  document.querySelectorAll("button[onclick]").forEach((button) => {
    button.addEventListener("click", function () {
      showLoader(`Processing ${this.textContent.trim()}...`);
    });
  });
});
