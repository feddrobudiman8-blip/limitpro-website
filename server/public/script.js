// ======================================
// LIMITPRO INDONESIA
// SCRIPT.JS
// ======================================

// ==========================
// ELEMENT
// ==========================

const header = document.querySelector(".header");
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");
const topBtn = document.getElementById("backToTop");

// ==========================
// NAVBAR SCROLL
// ==========================

window.addEventListener("scroll", () => {
  if (window.scrollY > 40) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

// ==========================
// HAMBURGER
// ==========================

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");

  navMenu.classList.toggle("active");
});

// ==========================
// CLOSE MENU AFTER CLICK
// ==========================

document.querySelectorAll(".nav-menu a").forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("active");

    hamburger.classList.remove("active");
  });
});

// ==========================
// CLICK OUTSIDE MENU
// ==========================

document.addEventListener("click", (e) => {
  if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
    navMenu.classList.remove("active");

    hamburger.classList.remove("active");
  }
});

// ==========================
// BACK TO TOP
// ==========================

window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    topBtn.style.display = "flex";
  } else {
    topBtn.style.display = "none";
  }
});

topBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,

    behavior: "smooth",
  });
});

// ==========================
// SCROLL REVEAL
// ==========================

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  },
  {
    threshold: 0.15,
  },
);

document.querySelectorAll(".fade-up").forEach((el) => {
  observer.observe(el);
});

/* ===========================
   Visitor Statistics
=========================== */

async function loadVisitorStats() {
  try {
    const response = await fetch("/api/stats");
    const stats = await response.json();

    document.getElementById("todayVisits").textContent = stats.todayVisits;

    document.getElementById("totalVisits").textContent = stats.totalVisits;

    document.getElementById("uniqueVisitors").textContent =
      stats.uniqueVisitors;

    document.getElementById("onlineVisitors").textContent =
      stats.onlineVisitors;
  } catch (error) {
    console.error("Gagal mengambil statistik:", error);
  }
}

loadVisitorStats();

setInterval(loadVisitorStats, 5000);
