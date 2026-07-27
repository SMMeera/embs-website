document.addEventListener("DOMContentLoaded", function () {
  var navbar    = document.getElementById("navbar");
  var hamburger = document.getElementById("hamburger");
  var navLinks  = document.getElementById("navLinks");

  if (!navbar || !hamburger || !navLinks) { return; }

  /* Scroll */
  window.addEventListener("scroll", function () {
    navbar.classList.toggle("scrolled", window.scrollY > 20);
  });

  /* Hamburger toggle */
  hamburger.addEventListener("click", function (e) {
    e.stopPropagation();
    hamburger.classList.toggle("open");
    navLinks.classList.toggle("open");
  });

  /* Close menu on plain link click */
  navLinks.querySelectorAll("li:not(.nav-item-dropdown) .nav-link").forEach(function (link) {
    link.addEventListener("click", function () {
      hamburger.classList.remove("open");
      navLinks.classList.remove("open");
    });
  });

  /* Dropdowns */
  var dropdowns = document.querySelectorAll(".nav-item-dropdown");

  dropdowns.forEach(function (dropdown) {
    var arrow = dropdown.querySelector(".nav-dropdown-arrow");
    var link  = dropdown.querySelector(".nav-link");

    function toggleDropdown(e) {
      e.stopPropagation();
      var isOpen = dropdown.classList.contains("open");
      dropdowns.forEach(function (d) { d.classList.remove("open"); });
      if (!isOpen) { dropdown.classList.add("open"); }
    }

    if (arrow) {
      arrow.addEventListener("click", toggleDropdown);
    }

    if (link) {
      link.addEventListener("click", function (e) {
        /* On mobile hamburger is visible (offsetParent != null) */
        if (hamburger.offsetParent !== null) {
          toggleDropdown(e);
        }
      });
    }

    dropdown.querySelectorAll(".nav-dropdown-item").forEach(function (item) {
      item.addEventListener("click", function () {
        dropdown.classList.remove("open");
        hamburger.classList.remove("open");
        navLinks.classList.remove("open");
      });
    });
  });

  /* Outside click closes everything */
  document.addEventListener("click", function (e) {
    if (!e.target.closest(".nav-item-dropdown")) {
      dropdowns.forEach(function (d) { d.classList.remove("open"); });
    }
    if (!e.target.closest(".navbar")) {
      hamburger.classList.remove("open");
      navLinks.classList.remove("open");
    }
  });
});
