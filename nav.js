document.addEventListener("DOMContentLoaded", () => {
    // Your existing nav HTML (matches your site's CSS classes)
    const navHTML = `
      <nav class="main-nav" role="navigation" aria-label="Main navigation">
        <ul class="container">
          <li><a href="index.html"><i class="fa-solid fa-home fa-fw"></i> Home</a></li>
          <li><a href="aboutus.html"><i class="fa-solid fa-users fa-fw"></i> About Us</a></li>
          <li><a href="contact.html"><i class="fa-solid fa-phone fa-fw"></i> Contact</a></li>
          <li><a href="address.html"><i class="fa-solid fa-map-location-dot fa-fw"></i> Address</a></li>
          <li><a href="news.html"><i class="fa-solid fa-bullhorn fa-fw"></i> News</a></li>
          <li><a href="sharehub.html"><i class="fa-solid fa-school fa-fw"></i> ShareHub</a></li>
        <li><a href="contents.html"><i class="fa-solid fa-book fa-fw"></i> Contents</a></li>

          </ul>
      </nav>
    `;
  
    // Inject the navigation right after the header
    const header = document.querySelector(".site-header");
    if (header) {
      header.insertAdjacentHTML("afterend", navHTML);
    }
  
    // Highlight the current active page
    const currentPage = window.location.pathname.split("/").pop();
    const links = document.querySelectorAll(".main-nav a");
  
    links.forEach(link => {
      const href = link.getAttribute("href");
      if (href === currentPage) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  });
  